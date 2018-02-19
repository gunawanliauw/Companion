sap.ui.define(['jquery.sap.global','sap/ui/base/ManagedObject','sap/m/Token','sap/m/Tokenizer'],function(q,M,T,a){"use strict";var F=T.extend("sap.ui.mdc.FilterToken",{metadata:{library:"sap.ui.mdc",properties:{changeable:{type:"boolean",defaultValue:false}},events:{tokenChanged:{parameters:{text:{type:"string"}}}}}});F.prototype.init=function(){T.prototype.init.apply(this);this.bAllowTextSelection=true;this._bEditing=false;};F.prototype.setParent=function(p){if(p instanceof a){p.bAllowTextSelection=true;}M.prototype.setParent.apply(this,arguments);};F.prototype.setText=function(v){T.prototype.setText.call(this,v,true);this.getDomRef()&&(this.getDomRef().firstChild.innerText=this.getText());return this;};F.prototype._activateInput=function(){if(!this._bEditing){var i=this.getDomRef().firstChild;i.tabIndex="0";i.focus();i.setAttribute("contenteditable","true");this._bEditing=true;this.$().addClass("sapMTokenEditing");}};F.prototype._deactivateInput=function(){this.getDomRef().firstChild.tabIndex="-1";this.focus();var i=this.getDomRef().firstChild;var t=i.innerText;if(t!==this.getText()){var o=this.getText();this.setText(this.getDomRef().firstChild.innerText);this.fireTokenChanged({text:this.getText(),oldText:o});}this._bEditing=false;i.removeAttribute("contenteditable");this.$().removeClass("sapMTokenEditing");};F.prototype._onTokenPress=function(e){var s=this.getSelected(),c=e.ctrlKey||e.metaKey,S=e.shiftKey;T.prototype._onTokenPress.apply(this,arguments);if(s&&this.getChangeable()&&!c&&!S){this._activateInput();}};F.prototype.onsapfocusleave=function(e){if(this._bEditing){this._deactivateInput();}else{this._callBaseEventHandler(e,"onsapfocusleave");}};F.prototype.onsapenter=function(e){if(this._bEditing){this._deactivateInput();}else{this._callBaseEventHandler(e,"onsapfocusleave");}};F.prototype.oninput=function(e){if(this._bEditing||e.target===this.getDomRef().firstChild){e.stopImmediatePropagation();}else{this._callBaseEventHandler(e,"oninput");}};F.prototype.onkeydown=function(e){if(this._bEditing||e.target===this.getDomRef().firstChild){e.stopImmediatePropagation();if(e.keyCode===q.sap.KeyCodes.F2){this._deactivateInput();}}else{if(this.getChangeable()&&e.keyCode===q.sap.KeyCodes.F2){this._activateInput();}this._callBaseEventHandler(e,"onkeydown");}};F.prototype.onsapspace=function(e){if(this._bEditing||e.target===this.getDomRef().firstChild){e.stopImmediatePropagation();}else{this._callBaseEventHandler(e,"onsapspace");}};F.prototype.onsapescape=function(e){if(this._bEditing||e.target===this.getDomRef().firstChild){this._deactivateInput();e.stopImmediatePropagation();}else{this._callBaseEventHandler(e,"onsapescape");}};F.prototype.onkeyup=function(e){if(this._bEditing||e.target===this.getDomRef().firstChild){e.stopImmediatePropagation();}else{this._callBaseEventHandler(e,"onkeyup");}};F.prototype._callBaseEventHandler=function(e,n){var p=this.getMetadata().getParent();if(p){p=p.getClass();if(p.prototype[n]){p.prototype[n].apply(this,[e]);}}};return F;},true);
