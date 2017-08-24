import getApp from './app';
import getLogger from './util/logger';
import getMiradorProxyManager from './mirador-proxy/mirador-proxy-manager';
import MiradorConfigBuilder from './config/mirador-config-builder';
import {openAnnotationSelector} from './util/annotation-explorer';
import WindowProxy from './mirador-proxy/window-proxy';

const logger = getLogger();
const proxyMgr = getMiradorProxyManager();

/**
 * Wrapper of a single Mirador instance
 */
export default class MiradorWrapper {
  constructor(options) {
    logger.debug('MiradorWrapper#constructor options:', options);
    this.options = Object.assign({
      grid: null,
      miradorOptions: null
    }, options);
    this._miradorId = options.miradorOptions.miradorId;
    this._miradorConfig = this._buildMiradorConfig(options.miradorOptions);
    this._mirador = Mirador(this._miradorConfig);
    this._miradorProxy = this._addToMiradorProxy(this._miradorId, this._mirador);
    this._bindEvents(options.miradorOptions);
  }

  getMirador() {
    return this._mirador;
  }

  getMiradorProxy() {
    return this._miradorProxy;
  }

  getConfig() {
    return this._miradorConfig;
  }

  /**
   * Sets up configuration parameters to pass to Mirador.
   */
  _buildMiradorConfig(options) {
    const builder = new MiradorConfigBuilder(options);
    return builder.buildConfig();
  }

 _addToMiradorProxy(miradorId, mirador) {
    const miradorProxy = proxyMgr.addMirador(miradorId, mirador);

    miradorProxy.subscribe('OPEN_ANNOTATION_SELECTOR',
      (event, windowId, annotationEditor) =>
    {
      openAnnotationSelector(windowId).then((annotation) => {
        annotationEditor.loadAnnotation(annotation);
      });
    });

    return miradorProxy;
  }


  async zoomToTags(windowId, canvasId, tags) {
    const tocCache = getApp().getAnnotationTocCache();
    const toc = await tocCache.getToc(canvasId);
    const windowProxy = this._miradorProxy.getWindowProxyById(windowId);
    const imageView = windowProxy.getImageView();
    const tocNode = toc.getNodeFromTags(tags);
    const annotation = tocNode.canvasAnnotations[0];

    const zoomToAnnotation = function(event) {
      imageView.zoomToAnnotation(annotation);
      imageView.panToAnnotation(annotation);
      const drawTool = windowProxy.getDrawTool();
      drawTool.updateHighlights(annotation);
    }

    return new Promise((resolve, reject) => {
      const handler = event => {
        logger.debug('MiradorWrapper#zoomToTags:SUB:annotationsRendered');
        zoomToAnnotation();
        this._miradorProxy.unsubscribe('annotationsRendered.' + windowId, handler);
        resolve();
      }

      if (canvasId === windowProxy.getCurrentCanvasId()) {
        this._miradorProxy.publish('YM_DISPLAY_ON');
        zoomToAnnotation();
        resolve();
      } else {
        this._miradorProxy.subscribe('annotationsRendered.' + windowId, handler);
        windowProxy.setCurrentCanvasId(canvasId); // will trigger 'annotationsRendered' eventually
      }
    });
  }

  _bindEvents(options) {
    logger.debug('MiradorWrapper#_bindEvents options:', options);
    const miradorProxy = proxyMgr.getMiradorProxy(this._miradorId);

    miradorProxy.subscribe('YM_CLICKED_OPEN_ANNO_WINDOW', (event, canvasWindowId) => {
      logger.debug('MiradorWrapper received YM_CLICKED_OPEN_ANNO_WINDOW from ', canvasWindowId);
      miradorProxy.publish('YM_DISPLAY_ON');
      this.options.grid.addAnnotationWindow({
        miradorId: this._miradorId,
        imageWindowId: canvasWindowId
      });
    });

    jQuery.subscribe('ANNOWIN_ANNOTATION_FOCUSED', (event, params) => {
      const miradorProxy = proxyMgr.getMiradorProxy(this._miradorId);
      const windowProxy = miradorProxy.getWindowProxyById(params.imageWindowId);
      const tocPanel = windowProxy.getSidePanelTabContentElement('ym-annotation-toc');
      const annoTocMenu = tocPanel.data('AnnotationTableOfContent');

      if (annoTocMenu) {
        annoTocMenu.scrollToTags(params.annotation.tocTags);
      }
    });
  }
}
