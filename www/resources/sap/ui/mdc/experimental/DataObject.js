/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/EventProvider','sap/ui/mdc/experimental/DataObjectMetadata'],function(q,E,D){"use strict";var a=E.extend("sap.ui.mdc.experimental.DataObject",{constructor:function(s,p){E.call(this);this._aLayers=[];this._aLayerImpl=[];this._aLayerContext=[];this._aInactiveLayers=[];this._sActiveLayer="";this._mLayeredProperties={};this._mProperties=null;this._mDefaultProperties={};this.addLayer("base");this.applySettings(s);},metadata:{properties:{name:{type:"string",mandatory:true,unique:true,defaultValue:""},parent:{type:"any",defaultValue:{}},extensions:{type:"any",defaultValue:{}}},events:{change:{}}}},D);a.prototype.getAdapter=function(){return this._oImpl;};a.prototype.hideLayer=function(n){var i=this._aLayers.indexOf(n);if(i>0){this._aInactiveLayers.push(i);}else if(i==0){q.sap.log.debug("Layer 'base' cannot be hidden");}};a.prototype.showLayer=function(n){var i=this._aLayers.indexOf(n);if(i>0){this._aInactiveLayers.splice(this._aInactiveLayers.indexOf(i));}else if(i==0){q.sap.log.debug("Layer 'base' is always shown");}};a.prototype.setLayer=function(n,i,c){if(!this._mLayeredProperties[n]){this.addLayer(n,i,c);}this._sActiveLayer=n;};a.prototype.addLayer=function(n,i,c){if(this._aLayers.indexOf(n)>-1){q.sap.log.debug("Layer with "+n+" already exists");return;}this._aLayers.push(n);this._aLayerImpl.push(i);this._aLayerContext.push(c);this._mLayeredProperties[n]={};this._sActiveLayer=n;this._mProperties=this._mLayeredProperties[this._sActiveLayer];};a.prototype.isValid=function(p,v){return true;};a.prototype.setProperty=function(p,v,l){if(typeof p==="string"){this.addLayer("api");p=this.getMetadata().getProperty(p);}if(this.isValid(p,v)){if(l){var i=this._aLayers.indexOf(l);if(i===-1){return;}this._mLayeredProperties[this._aLayers[i]][p.name]=v;}else{this._mProperties[p.name]=v;}}};a.prototype.getLayeredProperty=function(p,l,r){var v,i;if(typeof p==="string"){p=this.getMetadata().getProperty(p);}if(!l){l=this._sActiveLayer;}i=this._aLayers.indexOf(l)||this._aLayers.length-1;while(v===undefined&&i>-1){if(this._aInactiveLayers.indexOf(i)>-1){i--;continue;}v=this._mLayeredProperties[this._aLayers[i]][p.name];this._iActiveContextLayer=i;if(v===undefined){var I=this._aLayerImpl[i];if(I&&I[p.name]){v=I[p.name].apply(this,[v]);}}if(v===undefined&&i==0){if(typeof p.defaultValue==="function"){v=p.defaultValue.apply(this);}else{this._mLayeredProperties[this._aLayers[i]][p.name]=v=JSON.parse(JSON.stringify(p.defaultValue));}}i--;if(r){break;}}return v;};a.prototype.getProperty=function(p){return this.getLayeredProperty(p);};a.prototype.getContext=function(){return this._aLayerContext[this._iActiveContextLayer];};a.prototype.getProperties=function(){var p=this._mProperties;var r={};for(var n in p){r[n]=p[n];if(typeof p[n]==="object"&&p[n].hasOwnProperty("length")){r[n]=[];for(var i=0;i<p[n].length;i++){if(p[n][i]instanceof a){r[n][i]=p[n][i].getProperties();}}}}return r;};a.prototype.applySettings=function(s){if(!s||q.isEmptyObject(s)){return this;}var m=this.getMetadata(),v=m.getJSONKeys(),k,V,K;for(k in s){V=s[k];if((K=v[k])!==undefined){switch(K._iKind){case 0:this[K.name]=V;break;case 5:if(typeof V=="function"){this[K._sMutator](V);}else{this[K._sMutator](V[0],V[1],V[2]);}break;case-1:default:break;}}else{}}return this;};a.prototype.toJSON=function(l){var c=this._sActiveLayer,p=this.getMetadata().getAllProperties(),r={};if(l){this._sActiveLayer=l;}for(var n in p){if(n==="parent"){continue;}r[n]=this[n];}this._sActiveLayer=c;return r;};return a;});
