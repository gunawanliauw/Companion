/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['./Base','sap/m/ToolbarSpacer'],function(B,T){"use strict";var P=B.extend("sap.ui.rta.toolbar.Personalization",{renderer:'sap.ui.rta.toolbar.BaseRenderer',type:'personalization',metadata:{events:{"exit":{},"restore":{}}}});P.prototype.buildControls=function(){var c=[new T(),new sap.m.Button({type:"Transparent",text:this.getTextResources().getText("BTN_RESTORE"),tooltip:this.getTextResources().getText("BTN_RESTORE"),visible:true,press:this.eventHandler.bind(this,'Restore')}).data('name','restore'),new sap.m.Button({type:"Emphasized",text:this.getTextResources().getText("BTN_DONE"),tooltip:this.getTextResources().getText("BTN_DONE"),press:this.eventHandler.bind(this,'Exit')}).data('name','exit')];return c;};P.prototype.setUndoRedoEnabled=function(){};P.prototype.setPublishEnabled=function(){};P.prototype.setRestoreEnabled=function(e){this.getControl('restore').setEnabled(e);};return P;},true);
