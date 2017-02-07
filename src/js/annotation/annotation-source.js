import getAnnotationCache from './annotation-cache';
import getLogger from '../util/logger';
import getMiradorWindow from '../mirador-window';
import getStateStore from '../state-store';

// Implements inteface between Joosugi annotation explorer and the annotation server
export default class AnnotationSource {
  constructor(options) {
    this.options = jQuery.extend({
      prefix: null
    }, options);
    this.logger = getLogger();
    this.layers = null;
  }

  async getLayers() {
    this.logger.debug('AnnotationSource#getLayers');
    let layers = null;

    if (this.layers) {
      this.logger.debug('AnnotationSource#getLayers hit cache', this.layers);
      layers = this.layers;
    } else {
      layers = await this._getRemoteLayers();
      this._updateLayerIndex(layers);
    }

    return layers;
  }

  _getRemoteLayers() {
    var _this = this;

    return new Promise(function(resolve, reject) {
      const settings = getMiradorWindow().getConfig().extension;
      let url = _this.options.prefix + '/layers';
      if (settings.projectId && !settings.disableAuthz) {
        url += '?group_id=' + settings.projectId;
      }
      _this.logger.debug('AnnotationSource#getLayers url:', url);

      jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, jqXHR) {
          _this.logger.debug('AnnotationSource#getLayers layers: ', data);
          _this.layers = data;
          resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'AnnotationSource#getLayers error status code: ' +
            jqXHR.status + ', textStatus: ' + textStatus +
            ', errorThrown: ' + errorThrown + ', URL: ' + url;
          _this.logger.error(msg);
          reject(msg);
        }
      });
    });
  }

  _updateLayerIndex(layers) {
    this.logger.debug('AnnotationSource#_updateLayerIndex');
    const state = getStateStore();
    
    if (!state.getObject('layerIndexMap')) {
      const map = {};
      let count = 0;
      layers.forEach((layer) => {
        map[layer['@id']] = count;
        ++count;
      });
      state.setObject('layerIndexMap', count > 0 ? map : null);
    }
    return layers;
  }

  async getAnnotations(options) {
    const _this = this;
    const canvasId = options.canvasId;
    const layerId = options.layerId;
    const cache = await getAnnotationCache();
    let annotations = null;

    if (cache) {
      annotations = await cache.getAnnotationsPerCanvas(canvasId);
      this.logger.debug('AnnotationSource#getAnnotations from cache:', annotations);
    }

    if (!annotations) {
      annotations = await this._getRemoteAnnotations(canvasId)
      .then((annotations) => {
        if (cache) {
          cache.setAnnotationsPerCanvas(canvasId, annotations);
        }
        return annotations;
      });
    }

    if (layerId) {
      annotations.filter((anno) => anno.layerId === layerId)
    }
    return annotations;
  }

  _getRemoteAnnotations(canvasId) {
    this.logger.debug('AnnotationSource#_getRemoteAnnotation canvas: ' + canvasId);
    const _this = this;
    return new Promise(function(resolve, reject) {
      const url = _this.options.prefix + '/getAnnotationsViaList?canvas_id=' + encodeURIComponent(canvasId);
      _this.logger.debug('AnnotationSource#_getRemoteAnnotations url: ', url);
      const annotations = [];

      jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, jqXHR) {
          _this.logger.debug('AnnotationSource#_getAnnotations data: ', data);
          for (let value of data) {
            let annotation = value.annotation;
            annotation.layerId = value.layer_id;
            annotations.push(annotation);
          }
          resolve(annotations);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'AnnotationSource#getAnnotations failed to get annotations from ' + url;
          reject(msg);
        }
      });
    });
  }
  
  async createAnnotation(oaAnnotation) {
    this.logger.debug('AnnotationSource#createAnnotation oaAnnotation:', oaAnnotation);
    const _this = this;
    const cache = await getAnnotationCache();
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
          _this.logger.debug('AnnotationSource#createAnnotation creation successful on the annotation server:', data);
          const annotation = data;
          const oaAnnotation = _this._getAnnotationInOA(annotation);
          oaAnnotation.layerId = layerId;
          if (cache) {
            setTimeout(() => {
              cache.invalidateAnnotation(oaAnnotation);
            }, 250);
          }
          resolve(oaAnnotation);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'Failed to create annotation: ' + textStatus + ' ' + jqXHR.status + ' ' + errorThrown;
          _this.logger.error(msg);
          reject(msg);
        }
      });
    });
  }
  
  async updateAnnotation(oaAnnotation) {
    const _this = this;
    const cache = await getAnnotationCache();
    const annotation = this._getAnnotationInEndpoint(oaAnnotation);
    const url = this.options.prefix + '/annotations';
    const data = {
      layer_id: [oaAnnotation.layerId],
      annotation: annotation
    };
    
    this.logger.debug('AnnotationSource#updateAnnotation payload:', data);

    return new Promise((resolve, reject) => {
      jQuery.ajax({
        url: url,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        success: function(data, textStatus, jqXHR) {
            _this.logger.debug('AnnotationSource#updateAnnotation successful', data);
            data.layerId = oaAnnotation.layerId;
            if (cache) {
              cache.invalidateAnnotation(oaAnnotation);
            }
            resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          const msg = 'Failed to update annotation: ' + textStatus + ' ' + jqXHR.status + ' ' + errorThrown;
          reject(msg);
        }
      });
    });
  }
  
  async deleteAnnotation (annotationId) {
    this.log.debug('AnnotationSource#deleteAnnotations annotationId:', annotationId);
    const _this = this;
    const cache = await getAnnotationCache();
    const url = annotationId;

    return new Promise((resolve, reject) => {
      jQuery.ajax({
        url: url,
        type: 'DELETE',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data, textStatus, jqXHR) {
          _this.logger.debug('AnnotationSource#deleteAnnotation success data:', data);
          if (cache) {
            cache.invalidateAnnotationId(annotationId);
          }
          resolve();
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'AnnotationSource#deleteAnnotation failed for annotationId: ' + annotationId;
          reject(msg);
        }
      });
    });
  }

  async updateAnnotationListOrder(canvasId, layerId, annoIds) {
    const _this = this;
    const cache = await getAnnotationCache();
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
          _this.logger.debug('AnnotationSource#updateAnnotationListOrder successful', data);
          if (cache) {
            cache.invalidateCanvasId(canvasId);
          }
          resolve(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          const msg = 'AnnotationSource#updateAnnotation failed: ' + textStatus + ' ' + jqXHR.status + ' ' + errorThrown;
          _this.logger.error(msg);
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
        this.logger.error('ERROR YaleEndpoint#getAnnotationInOA unexpected motivation value: ', motivation, ', id: ' + annotation['@id']);
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
