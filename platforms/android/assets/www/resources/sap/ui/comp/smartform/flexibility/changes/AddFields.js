/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/fl/Utils","sap/ui/fl/changeHandler/Base","sap/ui/fl/changeHandler/JsControlTreeModifier"],function(q,U,B,J){"use strict";var A={};A.applyChange=function(c,g,p){var C=c.getDefinition();var f=function(C){var b=C.content;var M=false;if(b){M=C.content.field&&(C.content.field.selector||C.content.field.id)&&C.content.field.jsTypes&&C.content.field.value&&C.content.field.valueProperty;}return b&&M;};var m=p.modifier;var v=p.view;if(f(C)){var F=C.content.field.selector;var s=C.content.field.id;var a=C.content.field.index;var G=m.createControl("sap.ui.comp.smartform.GroupElement",p.appComponent,v,F||s);for(var i=0;i<C.content.field.jsTypes.length;i++){var j=C.content.field.jsTypes[i];var P=C.content.field.valueProperty[i];var o=C.content.field.value[i];var e=C.content.field.entitySet;this.addElementIntoGroupElement(m,v,G,j,P,o,e,i,p.appComponent);}m.insertAggregation(g,"groupElements",G,a);return true;}else{U.log.error("Change does not contain sufficient information to be applied: ["+C.layer+"]"+C.namespace+"/"+C.fileName+"."+C.fileType);}};A.addElementIntoGroupElement=function(m,v,g,j,p,P,e,i,a){var V=m.createControl(j,a,v);m.bindProperty(V,p,P);m.insertAggregation(g,"elements",V,i,v,true);if(e){m.setProperty(V,"entitySet",e);}};A.completeChangeContent=function(c,s,p){var a=p.appComponent;var C=c.getDefinition();if(!C.content){C.content={};}if(!C.content.field){C.content.field={};}if(s.fieldValues){C.content.field.value=s.fieldValues;}else if(s.bindingPath){C.content.field.value=[s.bindingPath];}else{throw new Error("oSpecificChangeInfo.fieldValue or bindingPath attribute required");}if(s.valueProperty){C.content.field.valueProperty=s.valueProperty;}else if(s.bindingPath){C.content.field.valueProperty=["value"];}else{throw new Error("oSpecificChangeInfo.valueProperty or bindingPath attribute required");}if(s.newControlId){C.content.field.selector=J.getSelector(s.newControlId,a);}else{throw new Error("oSpecificChangeInfo.newControlId attribute required");}if(s.jsTypes){C.content.field.jsTypes=s.jsTypes;}else if(s.bindingPath){C.content.field.jsTypes=["sap.ui.comp.smartfield.SmartField"];}else{throw new Error("oSpecificChangeInfo.jsTypes or bindingPath attribute required");}if(s.index===undefined){throw new Error("oSpecificChangeInfo.index attribute required");}else{C.content.field.index=s.index;}if(s.entitySet){C.content.field.entitySet=s.entitySet;}};return A;},true);
