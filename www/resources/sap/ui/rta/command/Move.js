/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/rta/command/FlexCommand'],function(q,F){"use strict";var M=F.extend("sap.ui.rta.command.Move",{metadata:{library:"sap.ui.rta",properties:{movedElements:{type:"any[]"},target:{type:"any"},source:{type:"any"}},associations:{},events:{}}});M.prototype._getChangeSpecificData=function(i){var s=i?this.getTarget():this.getSource();var t=i?this.getSource():this.getTarget();if(s.parent){s.id=s.parent.getId();delete s.parent;}if(t.parent){t.id=t.parent.getId();delete t.parent;}var S={changeType:this.getChangeType(),source:s,target:t,movedElements:[]};this.getMovedElements().forEach(function(m){S.movedElements.push({id:m.id||m.element.getId(),sourceIndex:i?m.targetIndex:m.sourceIndex,targetIndex:i?m.sourceIndex:m.targetIndex});});return S;};M.prototype.prepare=function(l,d){F.prototype.prepare.apply(this,arguments);this._oPreparedUndoChange=this._createChangeFromData(this._getChangeSpecificData(true),l,d);};M.prototype.undo=function(){this._applyChange(this._oPreparedUndoChange);};return M;},true);
