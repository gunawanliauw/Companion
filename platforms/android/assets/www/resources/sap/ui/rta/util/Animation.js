/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var m={};m.waitTransition=function($,c){if(!($ instanceof q)){throw new Error('$element should be wrapped into jQuery object');}if(!q.isFunction(c)){throw new Error('fnCallback should be a function');}return new Promise(function(r){$.one('transitionend',r);c();});};return m;},true);
