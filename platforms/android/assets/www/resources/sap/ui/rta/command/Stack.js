/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/ManagedObject'],function(M){"use strict";var S=M.extend("sap.ui.rta.command.Stack",{metadata:{library:"sap.ui.rta",properties:{},aggregations:{commands:{type:"sap.ui.rta.command.BaseCommand",multiple:true}},events:{modified:{}}}});S.prototype._toBeExecuted=-1;S.prototype._getCommandToBeExecuted=function(){return this.getCommands()[this._toBeExecuted];};S.prototype.pushExecutedCommand=function(c){this.push(c,true);};S.prototype.push=function(c,e){if(this._bUndoneCommands){this._bUndoneCommands=false;while(this._toBeExecuted>-1){this.pop();}}this.insertCommand(c,0);if(!e){this._toBeExecuted++;}this.fireModified();};S.prototype.top=function(){return this.getCommands()[0];};S.prototype.pop=function(){if(this._toBeExecuted>-1){this._toBeExecuted--;}return this.removeCommand(0);};S.prototype.removeCommand=function(o,s){var r=this.removeAggregation("commands",o,s);this.fireModified();return r;};S.prototype.removeAllCommands=function(s){var c=this.removeAllAggregation("commands",s);this._toBeExecuted=-1;this.fireModified();return c;};S.prototype.isEmpty=function(){return this.getCommands().length===0;};S.prototype.execute=function(){var c=this._getCommandToBeExecuted();if(c){try{c.execute();}catch(e){this.pop();throw(e);}this._toBeExecuted--;this.fireModified();}};S.prototype._unExecute=function(){if(this.canUndo()){this._bUndoneCommands=true;this._toBeExecuted++;var c=this._getCommandToBeExecuted();if(c){c.undo();this.fireModified();}}};S.prototype.canUndo=function(){return(this._toBeExecuted+1)<this.getCommands().length;};S.prototype.undo=function(){this._unExecute();};S.prototype.canRedo=function(){return!!this._getCommandToBeExecuted();};S.prototype.redo=function(){this.execute();};S.prototype.pushAndExecute=function(c){this.push(c);this.execute();};S.prototype.getAllExecutedCommands=function(){var a=[];var c=this.getCommands();for(var i=c.length-1;i>this._toBeExecuted;i--){var s=this._getSubCommands(c[i]);a=a.concat(s);}return a;};S.prototype._getSubCommands=function(c){var C=[];if(c.getCommands){c.getCommands().forEach(function(s){var a=this._getSubCommands(s);C=C.concat(a);},this);}else{C.push(c);}return C;};return S;},true);
