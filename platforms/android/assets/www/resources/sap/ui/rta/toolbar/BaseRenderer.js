/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/core/Renderer','sap/m/ToolbarRenderer'],function(R,T){"use strict";var B=R.extend('sap.ui.rta.toolbar.BaseRenderer',T);B.decorateRootElement=function(r,c){r.addClass('sapContrastPlus');r.addClass('sapUiRtaToolbar');r.addClass("color_"+c.getColor());r.addClass("type_"+c.type);var z=c.getZIndex();z&&r.addStyle("z-index",z);T.decorateRootElement(r,c);};return B;});
