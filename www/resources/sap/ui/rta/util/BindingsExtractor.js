/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/dt/ElementUtil','sap/ui/rta/Utils'],function(E,R){"use strict";function g(e,p){var b=[];for(var A in e.getMetadata().getAllAggregations()){E.getAggregation(e,A).forEach(function(c){if(c.getMetadata){b=b.concat(a(c,p),g(c,p));}});}return b;}function f(b,p){var B=[];var m=b.getMetadata().getName();if(m==="sap.ui.model.CompositeBinding"){b.getBindings().forEach(function(b){B=B.concat(f(b,p));});}else if((m==="sap.ui.model.odata.ODataPropertyBinding"||m==="sap.ui.model.odata.v4.ODataPropertyBinding"||m==="sap.ui.model.json.JSONPropertyBinding"||m==="sap.ui.model.json.XMLPropertyBinding"||m==="sap.ui.model.resource.ResourcePropertyBinding")&&b.getModel()===p&&b.isRelative()&&jQuery.isFunction(b.getPath)&&b.getPath()){B.push(b);}return B;}function a(c,p){var P=Object.keys(c.getMetadata().getAllProperties());return P.filter(c.isBound.bind(c)).reduce(function(b,s){return b.concat(f(c.getBinding(s),p));},[]);}return{getBindings:g,flattenBindings:f,getBindingsFromProperties:a};},true);
