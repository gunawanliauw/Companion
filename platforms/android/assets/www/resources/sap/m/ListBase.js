/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./GroupHeaderListItem','./ListItemBase','./library','sap/ui/core/Control','sap/ui/core/delegate/ItemNavigation','sap/ui/core/InvisibleText','sap/ui/core/LabelEnablement'],function(q,G,L,l,C,I,a,b){"use strict";var c=C.extend("sap.m.ListBase",{metadata:{library:"sap.m",properties:{inset:{type:"boolean",group:"Appearance",defaultValue:false},headerText:{type:"string",group:"Misc",defaultValue:null},headerDesign:{type:"sap.m.ListHeaderDesign",group:"Appearance",defaultValue:sap.m.ListHeaderDesign.Standard,deprecated:true},footerText:{type:"string",group:"Misc",defaultValue:null},mode:{type:"sap.m.ListMode",group:"Behavior",defaultValue:sap.m.ListMode.None},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},includeItemInSelection:{type:"boolean",group:"Behavior",defaultValue:false},showUnread:{type:"boolean",group:"Misc",defaultValue:false},noDataText:{type:"string",group:"Misc",defaultValue:null},showNoData:{type:"boolean",group:"Misc",defaultValue:true},enableBusyIndicator:{type:"boolean",group:"Behavior",defaultValue:true},modeAnimationOn:{type:"boolean",group:"Misc",defaultValue:true},showSeparators:{type:"sap.m.ListSeparators",group:"Appearance",defaultValue:sap.m.ListSeparators.All},swipeDirection:{type:"sap.m.SwipeDirection",group:"Misc",defaultValue:sap.m.SwipeDirection.Both},growing:{type:"boolean",group:"Behavior",defaultValue:false},growingThreshold:{type:"int",group:"Misc",defaultValue:20},growingTriggerText:{type:"string",group:"Appearance",defaultValue:null},growingScrollToLoad:{type:"boolean",group:"Behavior",defaultValue:false},growingDirection:{type:"sap.m.ListGrowingDirection",group:"Behavior",defaultValue:sap.m.ListGrowingDirection.Downwards},rememberSelections:{type:"boolean",group:"Behavior",defaultValue:true},keyboardMode:{type:"sap.m.ListKeyboardMode",group:"Behavior",defaultValue:sap.m.ListKeyboardMode.Navigation}},defaultAggregation:"items",aggregations:{items:{type:"sap.m.ListItemBase",multiple:true,singularName:"item",bindable:"bindable"},swipeContent:{type:"sap.ui.core.Control",multiple:false},headerToolbar:{type:"sap.m.Toolbar",multiple:false},infoToolbar:{type:"sap.m.Toolbar",multiple:false}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{select:{deprecated:true,parameters:{listItem:{type:"sap.m.ListItemBase"}}},selectionChange:{parameters:{listItem:{type:"sap.m.ListItemBase"},listItems:{type:"sap.m.ListItemBase[]"},selected:{type:"boolean"}}},"delete":{parameters:{listItem:{type:"sap.m.ListItemBase"}}},swipe:{allowPreventDefault:true,parameters:{listItem:{type:"sap.m.ListItemBase"},swipeContent:{type:"sap.ui.core.Control"},srcControl:{type:"sap.ui.core.Control"}}},growingStarted:{deprecated:true,parameters:{actual:{type:"int"},total:{type:"int"}}},growingFinished:{deprecated:true,parameters:{actual:{type:"int"},total:{type:"int"}}},updateStarted:{parameters:{reason:{type:"string"},actual:{type:"int"},total:{type:"int"}}},updateFinished:{parameters:{reason:{type:"string"},actual:{type:"int"},total:{type:"int"}}},itemPress:{parameters:{listItem:{type:"sap.m.ListItemBase"},srcControl:{type:"sap.ui.core.Control"}}}},designTime:true}});c.prototype.iAnnounceDetails=1;c.getInvisibleText=function(){return this.oInvisibleText||(this.oInvisibleText=new a().toStatic());};c.prototype.sNavItemClass="sapMLIB";c.prototype.init=function(){this._aNavSections=[];this._aSelectedPaths=[];this._iItemNeedsHighlight=0;this.data("sap-ui-fastnavgroup","true",true);};c.prototype.onBeforeRendering=function(){this._bRendering=true;this._bActiveItem=false;this._aNavSections=[];this._removeSwipeContent();};c.prototype.onAfterRendering=function(){this._bRendering=false;this._sLastMode=this.getMode();if(sap.ui.Device.system.desktop){this._bItemNavigationInvalidated=true;}};c.prototype.exit=function(){this._oSelectedItem=null;this._aNavSections=[];this._aSelectedPaths=[];this._destroyGrowingDelegate();this._destroyItemNavigation();};c.prototype.refreshItems=function(r){if(r!="sort"||this.getBinding("items").getLength()!=0){this._showBusyIndicator();}if(this._oGrowingDelegate){this._oGrowingDelegate.refreshItems(r);}else{if(!this._bReceivingData){this._updateStarted(r);this._bReceivingData=true;}this.refreshAggregation("items");}};c.prototype.updateItems=function(r){if(this._oGrowingDelegate){this._oGrowingDelegate.updateItems(r);}else{if(this._bReceivingData){this._bReceivingData=false;}else{this._updateStarted(r);}this.updateAggregation("items");this._updateFinished();}};c.prototype.setBindingContext=function(){this._resetItemsBinding();return C.prototype.setBindingContext.apply(this,arguments);};c.prototype._bindAggregation=function(n){n=="items"&&this._resetItemsBinding();return C.prototype._bindAggregation.apply(this,arguments);};c.prototype.destroyItems=function(s){if(!this.getItems(true).length){return this;}this._oSelectedItem=null;this.destroyAggregation("items","KeepDom");if(!s){this.invalidate();}return this;};c.prototype.removeAllItems=function(A){this._oSelectedItem=null;return this.removeAllAggregation("items");};c.prototype.removeItem=function(i){var o=this.removeAggregation("items",i);if(o&&o===this._oSelectedItem){this._oSelectedItem=null;}return o;};c.prototype.getItems=function(r){if(r){return this.mAggregations["items"]||[];}return this.getAggregation("items",[]);};c.prototype.getId=function(s){var i=this.sId;return s?i+"-"+s:i;};c.prototype.setGrowing=function(g){g=!!g;if(this.getGrowing()!=g){this.setProperty("growing",g,!g);if(g){q.sap.require("sap.m.GrowingEnablement");this._oGrowingDelegate=new sap.m.GrowingEnablement(this);}else if(this._oGrowingDelegate){this._oGrowingDelegate.destroy();this._oGrowingDelegate=null;}}return this;};c.prototype.setGrowingThreshold=function(t){return this.setProperty("growingThreshold",t,true);};c.prototype.setEnableBusyIndicator=function(e){this.setProperty("enableBusyIndicator",e,true);if(!this.getEnableBusyIndicator()){this._hideBusyIndicator();}return this;};c.prototype.setNoDataText=function(n){this.setProperty("noDataText",n,true);this.$("nodata-text").text(this.getNoDataText());return this;};c.prototype.getNoDataText=function(d){if(d&&this._bBusy){return"";}var n=this.getProperty("noDataText");n=n||sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("LIST_NO_DATA");return n;};c.prototype.getSelectedItem=function(){var d=this.getItems(true);for(var i=0;i<d.length;i++){if(d[i].getSelected()){return d[i];}}return null;};c.prototype.setSelectedItem=function(o,s,f){if(this.indexOfItem(o)<0){q.sap.log.warning("setSelectedItem is called without valid ListItem parameter on "+this);return;}if(this._bSelectionMode){o.setSelected((s===undefined)?true:!!s);f&&this._fireSelectionChangeEvent([o]);}};c.prototype.getSelectedItems=function(){return this.getItems(true).filter(function(i){return i.getSelected();});};c.prototype.setSelectedItemById=function(i,s){var o=sap.ui.getCore().byId(i);return this.setSelectedItem(o,s);};c.prototype.getSelectedContexts=function(A){var B=this.getBindingInfo("items"),m=(B||{}).model,M=this.getModel(m);if(!B||!M){return[];}if(A&&this.getRememberSelections()){return this._aSelectedPaths.map(function(p){return M.getContext(p);});}return this.getSelectedItems().map(function(i){return i.getBindingContext(m);});};c.prototype.removeSelections=function(A,f,d){var e=[];this._oSelectedItem=null;A&&(this._aSelectedPaths=[]);this.getItems(true).forEach(function(i){if(!i.getSelected()){return;}if(d&&i.isSelectedBoundTwoWay()){return;}i.setSelected(false,true);e.push(i);!A&&this._updateSelectedPaths(i);},this);if(f&&e.length){this._fireSelectionChangeEvent(e);}return this;};c.prototype.selectAll=function(f){if(this.getMode()!="MultiSelect"){return this;}var d=[];this.getItems(true).forEach(function(i){if(!i.getSelected()){i.setSelected(true,true);d.push(i);this._updateSelectedPaths(i);}},this);if(f&&d.length){this._fireSelectionChangeEvent(d);}return this;};c.prototype.getLastMode=function(m){return this._sLastMode;};c.prototype.setMode=function(m){m=this.validateProperty("mode",m);var o=this.getMode();if(o==m){return this;}this._bSelectionMode=m.indexOf("Select")>-1;if(!this._bSelectionMode){this.removeSelections(true);}else{var s=this.getSelectedItems();if(s.length>1){this.removeSelections(true);}else if(o===sap.m.ListMode.MultiSelect){this._oSelectedItem=s[0];}}return this.setProperty("mode",m);};c.prototype.getGrowingInfo=function(){return this._oGrowingDelegate?this._oGrowingDelegate.getInfo():null;};c.prototype.setRememberSelections=function(r){this.setProperty("rememberSelections",r,true);!this.getRememberSelections()&&(this._aSelectedPaths=[]);return this;};c.prototype.setSelectedContextPaths=function(s){this._aSelectedPaths=s||[];};c.prototype.getSelectedContextPaths=function(){return this._aSelectedPaths.slice(0);};c.prototype.isAllSelectableSelected=function(){if(this.getMode()!=sap.m.ListMode.MultiSelect){return false;}var i=this.getItems(true),s=this.getSelectedItems().length,S=i.filter(function(o){return o.isSelectable();}).length;return(i.length>0)&&(s==S);};c.prototype.getVisibleItems=function(){return this.getItems(true).filter(function(i){return i.getVisible();});};c.prototype.getActiveItem=function(){return this._bActiveItem;};c.prototype.onItemDOMUpdate=function(o){if(!this._bRendering&&this.bOutput){this._startItemNavigation(true);}};c.prototype.onItemActiveChange=function(o,A){this._bActiveItem=A;};c.prototype.onItemHighlightChange=function(i,n){this._iItemNeedsHighlight+=(n?1:-1);if(this._iItemNeedsHighlight==1&&n){this.$("listUl").addClass("sapMListHighlight");}else if(this._iItemNeedsHighlight==0){this.$("listUl").removeClass("sapMListHighlight");}};c.prototype.onItemSelectedChange=function(o,s){if(this.getMode()==sap.m.ListMode.MultiSelect){this._updateSelectedPaths(o,s);return;}if(s){this._aSelectedPaths=[];this._oSelectedItem&&this._oSelectedItem.setSelected(false,true);this._oSelectedItem=o;}else if(this._oSelectedItem===o){this._oSelectedItem=null;}this._updateSelectedPaths(o,s);};c.prototype.getItemsContainerDomRef=function(){return this.getDomRef("listUl");};c.prototype.checkGrowingFromScratch=function(){};c.prototype.onBeforePageLoaded=function(g,s){this._fireUpdateStarted(s,g);this.fireGrowingStarted(g);};c.prototype.onAfterPageLoaded=function(g,s){this._fireUpdateFinished(g);this.fireGrowingFinished(g);};c.prototype.addNavSection=function(i){this._aNavSections.push(i);return i;};c.prototype.getMaxItemsCount=function(){var B=this.getBinding("items");if(B&&B.getLength){return B.getLength()||0;}return this.getItems(true).length;};c.prototype.shouldRenderItems=function(){return true;};c.prototype._resetItemsBinding=function(){if(this.isBound("items")){this._bUpdating=false;this._bReceivingData=false;this.removeSelections(true,false,true);this._oGrowingDelegate&&this._oGrowingDelegate.reset();this._hideBusyIndicator();if(this._oItemNavigation){this._oItemNavigation.iFocusedIndex=-1;}}};c.prototype._updateStarted=function(r){if(!this._bReceivingData&&!this._bUpdating){this._bUpdating=true;this._fireUpdateStarted(r);}};c.prototype._fireUpdateStarted=function(r,i){this._sUpdateReason=q.sap.charToUpperCase(r||"Refresh");this.fireUpdateStarted({reason:this._sUpdateReason,actual:i?i.actual:this.getItems(true).length,total:i?i.total:this.getMaxItemsCount()});};c.prototype._updateFinished=function(){if(!this._bReceivingData&&this._bUpdating){this._fireUpdateFinished();this._bUpdating=false;}};c.prototype._fireUpdateFinished=function(i){this._hideBusyIndicator();q.sap.delayedCall(0,this,function(){this._bItemNavigationInvalidated=true;this.fireUpdateFinished({reason:this._sUpdateReason,actual:i?i.actual:this.getItems(true).length,total:i?i.total:this.getMaxItemsCount()});});};c.prototype._showBusyIndicator=function(){if(this.getEnableBusyIndicator()&&!this.getBusy()&&!this._bBusy){this._bBusy=true;this._sBusyTimer=q.sap.delayedCall(this.getBusyIndicatorDelay(),this,function(){this.$("nodata-text").text("");});this.setBusy(true,"listUl");}};c.prototype._hideBusyIndicator=function(){if(this._bBusy){this._bBusy=false;this.setBusy(false,"listUl");q.sap.clearDelayedCall(this._sBusyTimer);if(!this.getItems(true).length){this.$("nodata-text").text(this.getNoDataText());}}};c.prototype.onItemBindingContextSet=function(i){if(!this._bSelectionMode||!this.getRememberSelections()||!this.isBound("items")){return;}if(i.isSelectedBoundTwoWay()){return;}var p=i.getBindingContextPath();if(p){var s=(this._aSelectedPaths.indexOf(p)>-1);i.setSelected(s);}};c.prototype.onItemInserted=function(i,s){if(s){this.onItemSelectedChange(i,true);}if(!this._bSelectionMode||!this._aSelectedPaths.length||!this.getRememberSelections()||!this.isBound("items")||i.isSelectedBoundTwoWay()||i.getSelected()){return;}var p=i.getBindingContextPath();if(p&&this._aSelectedPaths.indexOf(p)>-1){i.setSelected(true);}};c.prototype.onItemSelect=function(o,s){if(this.getMode()==sap.m.ListMode.MultiSelect){this._fireSelectionChangeEvent([o]);}else if(this._bSelectionMode&&s){this._fireSelectionChangeEvent([o]);}};c.prototype._fireSelectionChangeEvent=function(d){var o=d&&d[0];if(!o){return;}this.fireSelectionChange({listItem:o,listItems:d,selected:o.getSelected()});this.fireSelect({listItem:o});};c.prototype.onItemDelete=function(o){this.fireDelete({listItem:o});};c.prototype.onItemPress=function(o,s){if(o.getType()==sap.m.ListType.Inactive){return;}q.sap.delayedCall(0,this,function(){this.fireItemPress({listItem:o,srcControl:s});});};c.prototype._updateSelectedPaths=function(i,s){if(!this.getRememberSelections()||!this.isBound("items")){return;}var p=i.getBindingContextPath();if(!p){return;}s=(s===undefined)?i.getSelected():s;var d=this._aSelectedPaths.indexOf(p);if(s){d<0&&this._aSelectedPaths.push(p);}else{d>-1&&this._aSelectedPaths.splice(d,1);}};c.prototype._destroyGrowingDelegate=function(){if(this._oGrowingDelegate){this._oGrowingDelegate.destroy();this._oGrowingDelegate=null;}};c.prototype._destroyItemNavigation=function(){if(this._oItemNavigation){this.removeEventDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null;}};c.prototype._getTouchBlocker=function(){return this.$().children();};c.prototype._getSwipeContainer=function(){return this._$swipeContainer||(q.sap.require("sap.m.InstanceManager"),this._$swipeContainer=q("<div>",{"id":this.getId("swp"),"class":"sapMListSwp"}));};c.prototype._setSwipePosition=function(){if(this._isSwipeActive){return this._getSwipeContainer().css("top",this._swipedItem.$().position().top);}};c.prototype._renderSwipeContent=function(){var $=this._swipedItem.$(),d=this._getSwipeContainer();this.$().prepend(d.css({top:$.position().top,height:$.outerHeight(true)}));if(this._bRerenderSwipeContent){this._bRerenderSwipeContent=false;var r=sap.ui.getCore().createRenderManager();r.render(this.getSwipeContent(),d.empty()[0]);r.destroy();}return this;};c.prototype._swipeIn=function(){var t=this,$=t._getTouchBlocker(),d=t._getSwipeContainer();t._isSwipeActive=true;t._renderSwipeContent();sap.m.InstanceManager.addDialogInstance(t);window.document.activeElement.blur();q(window).on("resize.swp",function(){t._setSwipePosition();});$.css("pointer-events","none").on("touchstart.swp mousedown.swp",function(e){if(!d[0].firstChild.contains(e.target)){e.preventDefault();e.stopPropagation();}});d.bind("webkitAnimationEnd animationend",function(){q(this).unbind("webkitAnimationEnd animationend");d.css("opacity",1).focus();$.parent().on("touchend.swp touchcancel.swp mouseup.swp",function(e){if(!d[0].firstChild.contains(e.target)){t.swipeOut();}});}).removeClass("sapMListSwpOutAnim").addClass("sapMListSwpInAnim");};c.prototype._onSwipeOut=function(d){this._getSwipeContainer().css("opacity",0).remove();q(window).off("resize.swp");this._getTouchBlocker().css("pointer-events","auto").off("touchstart.swp mousedown.swp");if(typeof d=="function"){d.call(this,this._swipedItem,this.getSwipeContent());}this._isSwipeActive=false;sap.m.InstanceManager.removeDialogInstance(this);};c.prototype.swipeOut=function(d){if(!this._isSwipeActive){return this;}var t=this,$=this._getSwipeContainer();this._getTouchBlocker().parent().off("touchend.swp touchend.swp touchcancel.swp mouseup.swp");$.bind("webkitAnimationEnd animationend",function(){q(this).unbind("webkitAnimationEnd animationend");t._onSwipeOut(d);}).removeClass("sapMListSwpInAnim").addClass("sapMListSwpOutAnim");return this;};c.prototype._removeSwipeContent=function(){if(this._isSwipeActive){this.swipeOut()._onSwipeOut();}};c.prototype.close=c.prototype._removeSwipeContent;c.prototype._onSwipe=function(e){var o=this.getSwipeContent(),s=e.srcControl;if(o&&s&&!this._isSwipeActive&&this!==s&&!this._eventHandledByControl&&(sap.ui.Device.support.touch||(sap.ui.Device.os.windows&&sap.ui.Device.os.version>=8))){for(var d=s;d&&!(d instanceof sap.m.ListItemBase);d=d.oParent);if(d instanceof sap.m.ListItemBase){this._swipedItem=d;this.fireSwipe({listItem:this._swipedItem,swipeContent:o,srcControl:s},true)&&this._swipeIn();}}};c.prototype.ontouchstart=function(e){this._eventHandledByControl=e.isMarked();};c.prototype.onswipeleft=function(e){var d=sap.ui.getCore().getConfiguration().getRTL()?"RightToLeft":"LeftToRight";if(this.getSwipeDirection()!=d){this._onSwipe(e);}};c.prototype.onswiperight=function(e){var d=sap.ui.getCore().getConfiguration().getRTL()?"LeftToRight":"RightToLeft";if(this.getSwipeDirection()!=d){this._onSwipe(e);}};c.prototype.setSwipeDirection=function(d){return this.setProperty("swipeDirection",d,true);};c.prototype.getSwipedItem=function(){return(this._isSwipeActive?this._swipedItem:null);};c.prototype.setSwipeContent=function(o){this._bRerenderSwipeContent=true;this.toggleStyleClass("sapMListSwipable",!!o);return this.setAggregation("swipeContent",o,!this._isSwipeActive);};c.prototype.invalidate=function(o){if(o&&o===this.getSwipeContent()){this._bRerenderSwipeContent=true;this._isSwipeActive&&this._renderSwipeContent();return this;}C.prototype.invalidate.apply(this,arguments);return this;};c.prototype.addItemGroup=function(g,h,s){h=h||new G({title:g.text||g.key});h._bGroupHeader=true;this.addAggregation("items",h,s);return h;};c.prototype.removeGroupHeaders=function(s){this.getItems(true).forEach(function(i){if(i.isGroupHeader()){i.destroy(s);}});};c.prototype.getAccessibilityType=function(){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_LIST");};c.prototype.getAccessibilityStates=function(){if(!this.getItems(true).length){return"";}var s="",m=sap.m.ListMode,M=this.getMode(),B=this.getBinding("rows"),o=sap.ui.getCore().getLibraryResourceBundle("sap.m");if(b.isRequired(this)){s+=o.getText("LIST_REQUIRED")+" ";}if(M==m.MultiSelect){s+=o.getText("LIST_MULTISELECTABLE")+" ";}else if(M==m.Delete){s+=o.getText("LIST_DELETABLE")+" ";}else if(M!=m.None){s+=o.getText("LIST_SELECTABLE")+" ";}if(B&&B.isGrouped()){s+=o.getText("LIST_GROUPED")+" ";}return s;};c.prototype.getAccessibilityDescription=function(){var d=this.getAriaLabelledBy().map(function(A){var o=sap.ui.getCore().byId(A);return L.getAccessibilityText(o);}).join(" ");var h=this.getHeaderToolbar();if(h){var t=h.getTitleControl();if(t){d+=t.getText()+" ";}}else{d+=this.getHeaderText()+" ";}d+=this.getAccessibilityType()+" ";d+=this.getAccessibilityStates()+" ";d+=this.getFooterText();return d.trim();};c.prototype.getAccessibilityInfo=function(){return{description:this.getAccessibilityDescription(),focusable:true};};c.prototype.getAccessbilityPosition=function(i){var s=0,d=this.getVisibleItems(),p=d.indexOf(i)+1,B=this.getBinding("items");if(this.getGrowing()&&this.getGrowingScrollToLoad()&&B&&B.isLengthFinal()){s=B.getLength();if(B.isGrouped()){s+=d.filter(function(i){return i.isGroupHeader()&&i.getVisible();}).length;}}else{s=d.length;}return{setSize:s,posInset:p};};c.prototype.onItemFocusIn=function(i){if(!sap.ui.getCore().getConfiguration().getAccessibility()){return;}var o=i.getDomRef(),p=this.getAccessbilityPosition(i);if(!i.getContentAnnouncement){this.getNavigationRoot().setAttribute("aria-activedescendant",o.id);o.setAttribute("aria-posinset",p.posInset);o.setAttribute("aria-setsize",p.setSize);}else{var A=i.getAccessibilityInfo(),B=sap.ui.getCore().getLibraryResourceBundle("sap.m"),d=A.type+" ";d+=B.getText("LIST_ITEM_POSITION",[p.posInset,p.setSize])+" ";d+=A.description;this.updateInvisibleText(d,o);}};c.prototype.updateInvisibleText=function(t,i,p){var o=c.getInvisibleText(),f=q(i||document.activeElement);if(this.iAnnounceDetails){if(this.iAnnounceDetails==1){t=this.getAccessibilityStates()+" "+t;}else{t=this.getAccessibilityInfo().description+" "+t;}this.iAnnounceDetails=0;}o.setText(t.trim());f.addAriaLabelledBy(o.getId(),p);window.setTimeout(function(){f.removeAriaLabelledBy(o.getId());},0);};c.prototype.getNavigationRoot=function(){return this.getDomRef("listUl");};c.prototype.getFocusDomRef=function(){return this.getNavigationRoot();};c.prototype._startItemNavigation=function(i){if(!sap.ui.Device.system.desktop){return;}var k=this.getKeyboardMode(),K=sap.m.ListKeyboardMode;if(k==K.Edit&&!this.getItems(true).length){return;}if(i&&!this.getNavigationRoot().contains(document.activeElement)){this._bItemNavigationInvalidated=true;return;}if(!this._oItemNavigation){this._oItemNavigation=new I();this._oItemNavigation.setCycling(false);this.addEventDelegate(this._oItemNavigation);var t=(k==K.Edit)?-1:0;this._setItemNavigationTabIndex(t);this._oItemNavigation.setTableMode(true,true).setColumns(1);this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"]});}this._oItemNavigation.setPageSize(this.getGrowingThreshold());var n=this.getNavigationRoot();this._oItemNavigation.setRootDomRef(n);this.setNavigationItems(this._oItemNavigation,n);this._bItemNavigationInvalidated=false;};c.prototype.setNavigationItems=function(i,n){var N=q(n).children(".sapMLIB").get();i.setItemDomRefs(N);if(i.getFocusedIndex()==-1){if(this.getGrowing()&&this.getGrowingDirection()==sap.m.ListGrowingDirection.Upwards){i.setFocusedIndex(N.length-1);}else{i.setFocusedIndex(0);}}};c.prototype.getItemNavigation=function(){return this._oItemNavigation;};c.prototype._setItemNavigationTabIndex=function(t){if(this._oItemNavigation){this._oItemNavigation.iActiveTabIndex=t;this._oItemNavigation.iTabIndex=t;}};c.prototype.setKeyboardMode=function(k){this.setProperty("keyboardMode",k,true);if(this.isActive()){var t=(k==sap.m.ListKeyboardMode.Edit)?-1:0;this.$("listUl").prop("tabIndex",t);this.$("after").prop("tabIndex",t);this._setItemNavigationTabIndex(t);}return this;};c.prototype.setItemFocusable=function(o){if(!this._oItemNavigation){return;}var i=this._oItemNavigation.getItemDomRefs();var d=i.indexOf(o.getDomRef());if(d>=0){this._oItemNavigation.setFocusedIndex(d);}};c.prototype.forwardTab=function(f){this._bIgnoreFocusIn=true;this.$(f?"after":"before").focus();};c.prototype.onsaptabnext=function(e){if(e.isMarked()||this.getKeyboardMode()==sap.m.ListKeyboardMode.Edit){return;}if(e.target.id==this.getId("nodata")){this.forwardTab(true);e.setMarked();}};c.prototype.onsaptabprevious=function(e){if(e.isMarked()||this.getKeyboardMode()==sap.m.ListKeyboardMode.Edit){return;}var t=e.target.id;if(t==this.getId("nodata")){this.forwardTab(false);}else if(t==this.getId("trigger")){this.focusPrevious();e.preventDefault();}};c.prototype._navToSection=function(f){var t;var i=0;var s=f?1:-1;var d=this._aNavSections.length;this._aNavSections.some(function(S,e){var g=q.sap.domById(S);if(g&&g.contains(document.activeElement)){i=e;return true;}});var o=this.getItemsContainerDomRef();var $=q.sap.byId(this._aNavSections[i]);if($[0]===o&&this._oItemNavigation){$.data("redirect",this._oItemNavigation.getFocusedIndex());}this._aNavSections.some(function(){i=(i+s+d)%d;t=q.sap.byId(this._aNavSections[i]);if(t[0]===o&&this._oItemNavigation){var r=t.data("redirect");var e=this._oItemNavigation.getItemDomRefs();var T=e[r]||o.children[0];t=q(T);}if(t.is(":focusable")){t.focus();return true;}},this);return t;};c.prototype.onsapshow=function(e){if(e.isMarked()||e.which==q.sap.KeyCodes.F4||e.target.id!=this.getId("trigger")&&!q(e.target).hasClass(this.sNavItemClass)){return;}if(this._navToSection(true)){e.preventDefault();e.setMarked();}};c.prototype.onsaphide=function(e){if(e.isMarked()||e.target.id!=this.getId("trigger")&&!q(e.target).hasClass(this.sNavItemClass)){return;}if(this._navToSection(false)){e.preventDefault();e.setMarked();}};c.prototype.onkeydown=function(e){var d=(e.which==q.sap.KeyCodes.A)&&(e.metaKey||e.ctrlKey);if(e.isMarked()||!d||!q(e.target).hasClass(this.sNavItemClass)){return;}e.preventDefault();if(this.getMode()!==sap.m.ListMode.MultiSelect){return;}if(this.isAllSelectableSelected()){this.removeSelections(false,true);}else{this.selectAll(true);}e.setMarked();};c.prototype.onmousedown=function(e){if(this._bItemNavigationInvalidated){this._startItemNavigation();}};c.prototype.focusPrevious=function(){if(!this._oItemNavigation){return;}var n=this._oItemNavigation.getItemDomRefs();var i=this._oItemNavigation.getFocusedIndex();var $=q(n[i]);var r=$.control(0)||{};var t=r.getTabbables?r.getTabbables():$.find(":sapTabbable");var f=t.eq(-1).add($).eq(-1);this.iAnnounceDetails=2;f.focus();};c.prototype.onfocusin=function(e){if(this._bIgnoreFocusIn){this._bIgnoreFocusIn=false;e.stopImmediatePropagation(true);return;}if(this._bItemNavigationInvalidated){this._startItemNavigation();}if(e.isMarked()||!this._oItemNavigation||this.getKeyboardMode()==sap.m.ListKeyboardMode.Edit||e.target.id!=this.getId("after")){return;}this.focusPrevious();e.setMarked();};c.prototype.onsapfocusleave=function(e){if(!this.iAnnounceDetails&&this._oItemNavigation&&!this.getNavigationRoot().contains(e.target)){this.iAnnounceDetails=1;}};c.prototype.onItemArrowUpDown=function(o,e){var i=this.getItems(true),d=i.indexOf(o)+(e.type=="sapup"?-1:1),f=i[d];if(f&&f.isGroupHeader()){f=i[d+(e.type=="sapup"?-1:1)];}if(!f){return;}var t=f.getTabbables(),F=o.getTabbables().index(e.target),E=t.eq(t[F]?F:-1);E[0]?E.focus():f.focus();e.preventDefault();e.setMarked();};return c;},true);
