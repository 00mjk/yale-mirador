import getMiradorWindow from '../mirador-window';

// Implements inteface between Joosugi annotation explorer and the annotation server
export default class AnnotationSource {
  constructor(options) {
    this.options = jQuery.extend({
      prefix: null
    }, options);
  }

  getLayers() {
    console.log('AnnotationSource#getLayers');
    const _this = this;
    return new Promise(function(resolve, reject) {
      const groupId = getMiradorWindow().getConfig().extension.groupId;
      let url = _this.options.prefix + '/layers';
      
      if (groupId) {
        url += '?group_id=' + groupId;
      }

      jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, jqXHR) {
          console.log('AnnotationSource#getLayers layers: ', data);
          resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'AnnotationSource#getLayers error status code: ' +
            jqXHR.status + ', textStatus: ' + textStatus +
            ', errorThrown: ' + errorThrown + ', URL: ' + url;
          console.log(msg);
          reject(msg);
        }
      });
    });
  }

  getAnnotations(canvasId) {
    console.log('AnnotationSource#getAnnotation canvas: ' + canvasId);
    const _this = this;
    return new Promise(function(resolve, reject) {
      const url = _this.options.prefix + '/getAnnotationsViaList?canvas_id=' + encodeURIComponent(canvasId);
      console.log('AnnotationSource#_getAnnotations url: ', url);
      const annotations = [];

      jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, jqXHR) {
          console.log('AnnotationSource#_getAnnotations data: ', data);
          for (let value of data) {
            let annotation = value.annotation;
            annotation.layerId = value.layer_id;
            annotations.push(annotation);
          }
          resolve(annotations);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'AnnotationSource#getAnnotations failed to get annotations from ' + url;
          console.log(msg);
          reject(msg);
        }
      });
    });
  }
  
  createAnnotation(oaAnnotation) {
    console.log('AnnotationSource#createAnnotation oaAnnotation:', oaAnnotation);
    const _this = this;
    const layerId = oaAnnotation.layerId;
    const annotation = this._getAnnotationInEndpoint(oaAnnotation);
    const url = this.options.prefix + '/annotations';
    const request = {
      layer_id: layerId,
      annotation: annotation
    };

    return new Promise((resolve, reject) => {
      jQuery.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(request),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
          console.log('Creation was successful on the annotation server:', data);
          const annotation = data;
          const oaAnnotation = _this._getAnnotationInOA(annotation);
          oaAnnotation.layerId = layerId;
          if (typeof successCallback === 'function') {
            resolve(oaAnnotation);
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'Failed to create annotation: ' + textStatus + ' ' + jqXHR.status + ' ' + errorThrown;
          console.log(msg);
          reject(msg);
        }
      });
    });
  }
  
  updateAnnotation(oaAnnotation) {
    const _this = this;
    const annotation = this._getAnnotationInEndpoint(oaAnnotation);
    const url = this.options.prefix + '/annotations';
    const data = {
      layer_id: [oaAnnotation.layerId],
      annotation: annotation
    };
    
    console.log('AnnotationSource#updateAnnotation payload:', data);

    return new Promise((resolve, reject) => {
      jQuery.ajax({
        url: url,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: function(data, textStatus, jqXHR) {
            console.log('Update was successful: ', data);
            data.layerId = oaAnnotation.layerId;
            resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          const msg = 'Failed to update annotation: ' + textStatus + ' ' + jqXHR.status + ' ' + errorThrown;
          reject(msg);
        }
      });
    });
  }
  
  deleteAnnotation (annotationId) {
    console.log('AnnotationSource#deleteAnnotations annotationId:', annotationId);
    const _this = this;
    const url = annotationId;

    return new Promise((resolve, reject) => {
      jQuery.ajax({
        url: url,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, jqXHR) {
          console.log('AnnotationSource#deleteAnnotation success data:', data);
          resolve();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'AnnotationSource#deleteAnnotation failed for annotationId: ' + annotationId;
          reject(msg);
        }
      });
    });
  }

  updateAnnotationListOrder(canvasId, layerId, annoIds) {
    const url = this.options.prefix + '/resequenceList';
    const data = {
      canvas_id: canvasId,
      layer_id: layerId,
      annotation_ids: annoIds
    };

    return new Promise((resolve, reject) => {
      jQuery.ajax({
        url: url,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: function (data, textStatus, jqXHR) {
          console.log('Updating order was successful:', data);
          resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('AnnotationSource#updateAnnotationListOrder failed for request', data);
          const msg = 'AnnotationSource#updateAnnotation failed: ' + textStatus + ' ' + jqXHR.status + ' ' + errorThrown;
          reject(msg);
        }
      });
    });
  }

  // Convert Endpoint annotation to OA
  _getAnnotationInOA(annotation) {
    let motivation = annotation.motivation;
    if (!(motivation instanceof Array)) {
      if (motivation !== 'oa:commenting') {
        console.log('ERROR YaleEndpoint#getAnnotationInOA unexpected motivation value: ', motivation, ', id: ' + annotation['@id']);
      }
      motivation = ['oa:commenting'];
    }

    const oaAnnotation = {
      '@context': 'http://iiif.io/api/presentation/2/context.json',
      '@type': 'oa:Annotation',
      '@id': annotation['@id'],
      motivation: motivation,
      resource : annotation.resource,
      on: annotation.on,
      within: annotation.within,
    };

    oaAnnotation.layerId = annotation.layerId;
    oaAnnotation.endpoint = this;

    //console.log('YaleEndpoint#getAnnotationInOA oaAnnotation:', oaAnnotation);
    return oaAnnotation;
  }

  // Converts OA Annotation to endpoint format
  _getAnnotationInEndpoint(oaAnnotation) {
    const annotation = {
      '@id': oaAnnotation['@id'],
      '@type': oaAnnotation['@type'],
      '@context': oaAnnotation['@context'],
      motivation: oaAnnotation.motivation,
      resource: oaAnnotation.resource,
      on: oaAnnotation.on,
    };
    if (oaAnnotation.within) {
      annotation.within = oaAnnotation.within;
    }
    if (oaAnnotation.orderWeight) {
      annotation.orderWeight = oaAnnotation.orderWeight;
    }
    return annotation;
  }

}