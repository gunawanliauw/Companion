/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object"],function(q,B){"use strict";return B.extend("sap.ui.mdc.experimental.provider.model.ModelAdapter",{oMetaModel:undefined,sModelName:undefined,_mPropertyBag:{},constructor:function(m,M,s){this.oMetaModel=m;this.sModelName=M;if(s){this.switchMetaContext(s);}this.putProperty("visible",this.visible);this.putProperty("hidden",this.hidden);this.putProperty("enabled",this.enabled);this.putProperty("disabled",this.disabled);this.putProperty("required",this.required);this.putProperty("eMail",this.eMail);this.putProperty("url",this.url);this.putProperty("password",this.password);this.putProperty("phoneNumber",this.phoneNumber);this.putProperty("ui5Type",this.ui5Type);this.putProperty("tooltip",this.tooltip);this.putProperty("label",this.label);},switchMetaContext:function(m){this.oMetaContext=this.oMetaModel.getMetaContext(m);var c=this.oMetaContext.getPath();if(c&&c!=this.metaContext){this.sMetaContext=c;if(!this._mPropertyBag[this.sMetaContext]){this._mPropertyBag[this.sMetaContext]={};}}this.afterMetaContextSwitch(this.sMetaContext);},afterMetaContextSwitch:function(m){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method afterMetaContextSwitch must be redefined");},getModelName:function(){return this.sModelName;},putProperty:function(p,g,a,c){if(!c){c=this;}Object.defineProperty(this,p,{configurable:true,get:function(){if(!this._mPropertyBag[this.sMetaContext].hasOwnProperty(p)){this._mPropertyBag[this.sMetaContext][p]=g.apply(c,a);}return this._mPropertyBag[this.sMetaContext][p];}});},visible:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isVisible must be redefined");},hidden:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isHidden must be redefined");},enabled:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isEnabled must be redefined");},disabled:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isDisabled must be redefined");},required:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isRequired must be redefined");},url:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isURL must be redefined");},password:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isPassword must be redefined");},phoneNumber:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isPhoneNumber must be redefined");},eMail:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method isEmail must be redefined");},label:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method getLabel must be redefined");},tooltip:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method getTooltip must be redefined");},ui5Type:function(){throw new Error("sap.ui.mdc.experimental.provider.model.ModelAdapter:  method getUI5Type must be redefined");}});});
