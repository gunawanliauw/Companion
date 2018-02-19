/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/fl/Utils','sap/ui/dt/OverlayUtil','sap/ui/dt/OverlayRegistry','sap/ui/comp/odata/FieldSelectorModelConverter','sap/ui/fl/registry/Settings'],function(q,F,O,a,b,S){"use strict";var U={};U.RESOLVED_PROMISE=Promise.resolve(true);U._sFocusableOverlayClass=".sapUiDtOverlaySelectable";U.isExtensibilityEnabledInSystem=function(c){var C=F.getComponentClassName(c);if(!C||C==""){return Promise.resolve(false);}return S.getInstance(C).then(function(s){if(s.isModelS){return s.isModelS();}return false;});};U.getRelevantContainerDesigntimeMetadata=function(o){var r=o.getRelevantContainer();if(!r||!o.getParent()){return undefined;}var R=a.getOverlay(r);return R?R.getDesignTimeMetadata():undefined;};U.isServiceUpToDate=function(c){return this.isExtensibilityEnabledInSystem(c).then(function(e){if(e){q.sap.require("sap.ui.fl.fieldExt.Access");var m=c.getModel();if(m){var s=sap.ui.fl.fieldExt.Access.isServiceOutdated(m.sServiceUrl);if(s){sap.ui.fl.fieldExt.Access.setServiceValid(m.sServiceUrl);sap.ui.getCore().getEventBus().publish("sap.ui.core.UnrecoverableClientStateCorruption","RequestReload",{});return Promise.reject();}}}});};U.isCustomFieldAvailable=function(c){return this.isExtensibilityEnabledInSystem(c).then(function(s){if(!s){return false;}else if(!c.getModel()){return false;}else{var d=c.getModel().sServiceUrl;var e=this.getBoundEntityType(c).name;try{q.sap.require("sap.ui.fl.fieldExt.Access");var j=sap.ui.fl.fieldExt.Access.getBusinessContexts(d,e);return Promise.resolve(j).then(function(r){if(r){if(r.BusinessContexts){if(r.BusinessContexts.length>0){r.EntityType=e;return r;}}}else{return false;}}).catch(function(E){if(E){if(q.isArray(E.errorMessages)){for(var i=0;i<E.errorMessages.length;i++){q.sap.log.error(E.errorMessages[i].text);}}}return false;});}catch(E){q.sap.log.error("exception occured in sap.ui.fl.fieldExt.Access.getBusinessContexts",E);return false;}}}.bind(this));};U.openRemoveConfirmationDialog=function(e,t){var T=sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta");var s;return new Promise(function(r,c){s=T.getText("CTX_REMOVE_TITLE");var d={messageText:t,titleText:s,icon:"sap-icon://question-mark",removeText:T.getText("BTN_FREP_REMOVE"),cancelText:T.getText("BTN_FREP_CANCEL")};var m=new sap.ui.model.json.JSONModel();m.setData(d);var f;var C=function(){if(f){f.close();f.destroy();f=null;}};var o={removeField:function(){C();r(true);},closeDialog:function(){C();r(false);}};if(!f){f=sap.ui.xmlfragment("sap.ui.rta.view.RemoveElementDialog",o);f.setModel(m);}f.open();});};U.isOverlaySelectable=function(o){return o.isSelectable()&&o.$().is(":visible");};U.getPropertyValue=function(e,p){var m=e.getMetadata().getPropertyLikeSetting(p);var P=m._sGetter;return e[P]();};U.getOverlayInstanceForDom=function(d){var i=q(d).attr("id");if(i){return sap.ui.getCore().byId(i);}};U.getFocusedOverlay=function(){if(document.activeElement){var e=sap.ui.getCore().byId(document.activeElement.id);if(e instanceof sap.ui.dt.ElementOverlay){return e;}}};U.getFocusableParentOverlay=function(o){if(!o){return undefined;}var f=o.getParentElementOverlay();while(f&&!f.getSelectable()){f=f.getParentElementOverlay();}return f;};U.getFirstFocusableDescendantOverlay=function(o){return O.getFirstDescendantByCondition(o,this.isOverlaySelectable);};U.getNextFocusableSiblingOverlay=function(o){var n=O.getNextSiblingOverlay(o);while(n&&!this.isOverlaySelectable(n)){n=O.getNextSiblingOverlay(n);}return n;};U.getPreviousFocusableSiblingOverlay=function(o){var p=O.getPreviousSiblingOverlay(o);while(p&&!this.isOverlaySelectable(p)){p=O.getPreviousSiblingOverlay(p);}return p;};U.getIndex=function(p,c,A,g){var i;if(g&&typeof g==="function"){i=g.call(null,p,c);}else{var m=p.getMetadata();var o=m.getAggregation(A);var G=o._sGetter;var C=p[G]();if(c){i=C.indexOf(c)+1;}else{i=C.length;}}return i;};U.createFieldLabelId=function(p,e,B){return(p.getId()+"_"+e+"_"+B).replace("/","_");};U.getLabelForElement=function(e,f){if(f){return f(e);}else{var s=e.getText&&e.getText();if(!s){s=e.getLabelText&&e.getLabelText();}if(!s){s=e.getLabel&&e.getLabel();if(s&&s.getText){s=s.getText();}}if(!s){s=e.getTitle&&e.getTitle();}if(!s){s=e.getId&&e.getId();}return(typeof s)==="string"?s:undefined;}};U.getBoundEntityType=function(e,m){m||(m=e.getModel());var B=e.getBindingContext();if(B){return U.getEntityTypeByPath(m,B.getPath())||{};}return{};};U.openNewWindow=function(u){window.open(u,"_blank");};U.getElementBindingPaths=function(e){var p={};if(e.mBindingInfos){for(var i in e.mBindingInfos){var P=e.mBindingInfos[i].parts[0].path?e.mBindingInfos[i].parts[0].path:"";P=P.split("/")[P.split("/").length-1];p[P]={valueProperty:i};}}return p;};U.getFiori2Renderer=function(){var c=U.getUshellContainer()||{};return typeof c.getRenderer==="function"?c.getRenderer("fiori2"):undefined;};U.getUshellContainer=function(){return sap.ushell&&sap.ushell.Container;};U.getEntityTypeByPath=function(m,p){return m.oMetadata._getEntityTypeByPath(p);};U.getEntityTypeByNavProperty=function(m,o,n){return m.oMetadata._getEntityTypeByNavProperty(o,n);};U.mergeWith=function(d,s,c){if(!(typeof c==="function")){throw new Error('In order to use mergeWith() utility function fnCustomizer should be provided!');}for(var e in s){if(s.hasOwnProperty(e)){d[e]=d.hasOwnProperty(e)?c(d[e],s[e],e,d,s):s[e];}}return d;};return U;},true);
