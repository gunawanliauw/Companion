/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/MessageBox','sap/ui/comp/filterbar/FilterBar','sap/ui/comp/filterbar/FilterGroupItem','sap/ui/comp/filterbar/FilterItem','sap/ui/comp/library','./AdditionalConfigurationHelper','./ControlConfiguration','./FilterProvider','./GroupConfiguration','sap/ui/comp/smartvariants/PersonalizableInfo','sap/ui/comp/smartvariants/SmartVariantManagement','sap/ui/comp/odata/ODataModelUtil'],function(q,M,F,a,b,l,A,C,c,G,P,S,O){"use strict";var d=F.extend("sap.ui.comp.smartfilterbar.SmartFilterBar",{metadata:{library:"sap.ui.comp",designTime:true,properties:{entityType:{type:"string",group:"Misc",defaultValue:null},entitySet:{type:"string",group:"Misc",defaultValue:null},resourceUri:{type:"string",group:"Misc",defaultValue:null},basicSearchFieldName:{type:"string",group:"Misc",defaultValue:null},enableBasicSearch:{type:"boolean",group:"Misc",defaultValue:false},liveMode:{type:"boolean",group:"Misc",defaultValue:false},showMessages:{type:"boolean",group:"Misc",defaultValue:true},considerAnalyticalParameters:{type:"boolean",group:"Misc",defaultValue:false},useDateRangeType:{type:"boolean",group:"Misc",defaultValue:null},suppressSelection:{type:"boolean",group:"Misc",defaultValue:false},considerSelectionVariants:{type:"boolean",group:"Misc",defaultValue:false},defaultSelectionVariantName:{type:"string",group:"Misc",defaultValue:null},useProvidedNavigationProperties:{type:"boolean",group:"Misc",defaultValue:false},navigationProperties:{type:"string",group:"Misc",defaultValue:""}},associations:{smartVariant:{type:"sap.ui.comp.smartvariants.SmartVariantManagement",multiple:false}},aggregations:{controlConfiguration:{type:"sap.ui.comp.smartfilterbar.ControlConfiguration",multiple:true,singularName:"controlConfiguration"},groupConfiguration:{type:"sap.ui.comp.smartfilterbar.GroupConfiguration",multiple:true,singularName:"groupConfiguration"}},events:{pendingChange:{pendingValue:{type:"boolean"}}}},renderer:function(r,o){F.getMetadata().getRenderer().render(r,o);}});d.LIVE_MODE_INTERVAL=300;d.SELECTION_VARIANT_KEY_PREFIX="#";d.prototype.init=function(){this._aFilterBarViewMetadata=null;this.isRunningInValueHelpDialog=false;F.prototype.init.apply(this);sap.ui.getCore().getMessageManager().registerObject(this,true);};d.prototype._initializeMetadata=function(){if(!this.bIsInitialised){O.handleModelInit(this,this._onMetadataInitialised);}};d.prototype._onMetadataInitialised=function(){this._bMetaModelLoadAttached=false;if(!this.bIsInitialised){this._createFilterProvider();if(this._oFilterProvider){this._aFilterBarViewMetadata=this._oFilterProvider.getFilterBarViewMetadata();if(this._aFilterBarViewMetadata){this._attachAdditionalConfigurationChanged();this.bIsInitialised=true;this.setModel(this._oFilterProvider.oModel,this._oFilterProvider.sFilterModelName);this.registerGetFiltersWithValues(this.getFiltersWithValues.bind(this));this.registerFetchData(this.getFilterDataAsString.bind(this,true));this.registerApplyData(function(j){this.setFilterDataAsString(j,true);}.bind(this));this._initializeVariantManagement();}}}};d.prototype.getFilterBarViewMetadata=function(){return this._aFilterBarViewMetadata;};d.prototype.getAnalyticalParameters=function(){return this._oFilterProvider?this._oFilterProvider.getAnalyticParameters():[];};d.prototype.getSelectionVariants=function(){var s=null;if(this._oFilterProvider){s=this._oFilterProvider.getSelectionVariants();if(Object.keys(s).length<1){s=null;}}return s;};d.prototype._createFilterProvider=function(){var r,m,e,E;m=this.getModel();r=this.getResourceUri();e=this.getEntityType();E=this.getEntitySet();if((m||r)&&(e||E)){this._oFilterProvider=new sap.ui.comp.smartfilterbar.FilterProvider({basicSearchFieldName:this.getBasicSearchFieldName(),enableBasicSearch:this.getEnableBasicSearch(),entityType:e,entitySet:E,serviceUrl:r,isRunningInValueHelpDialog:this.isRunningInValueHelpDialog,model:m,additionalConfiguration:this.getAdditionalConfiguration(),defaultDropDownDisplayBehaviour:this.data("defaultDropDownDisplayBehaviour"),defaultTokenDisplayBehaviour:this.data("defaultTokenDisplayBehaviour"),dateFormatSettings:this.data("dateFormatSettings"),useContainsAsDefaultFilter:this.data("useContainsAsDefaultFilter"),smartFilter:this,considerAnalyticalParameters:this.getConsiderAnalyticalParameters(),useDateRangeType:this.getUseDateRangeType(),considerSelectionVariants:this.getConsiderSelectionVariants(),considerNavigations:this.getUseProvidedNavigationProperties()?this._createArrayFromString(this.getNavigationProperties()):null});this._oFilterProvider.attachPendingChange(function(o){this.firePendingChange({pendingValue:o.getParameter("pending")});}.bind(this));}};d.prototype._createArrayFromString=function(L){if(!L){return[];}var e=[];var r=L.split(",");r.forEach(function(f){if(f!==""){e.push(f.trim());}});return e;};d.prototype._attachAdditionalConfigurationChanged=function(){var e,g,i,f;g=this.getGroupConfiguration();f=g.length;for(i=0;i<f;i++){g[i].attachChange(this._handleGroupConfigurationChanged.bind(this));}e=this.getControlConfiguration();f=e.length;for(i=0;i<f;i++){e[i].attachChange(this._handleControlConfigurationChanged.bind(this));}};d.prototype._handleControlConfigurationChanged=function(e){var p,o,f,k,v;p=e.getParameter("propertyName");o=e.oSource;if(!o){return;}k=o.getKey();f=this._getFilterItemByName(k);if(!f){this._handleControlConfigurationChangedForDelayedFilterItems(k,o,p);return;}if(p==="visible"){v=o.getVisible();f.setVisible(v);}else if(p==="label"){v=o.getLabel();f.setLabel(v);}else if(p==="visibleInAdvancedArea"){v=o.getVisibleInAdvancedArea();if(f.setVisibleInAdvancedArea){f.setVisibleInAdvancedArea(v);}}};d.prototype._handleControlConfigurationChangedForDelayedFilterItems=function(k,o,p){var v,f=null;if(this._aFilterBarViewMetadata){this._aFilterBarViewMetadata.some(function(g){g.fields.some(function(i){if(i.fieldName===k){f=i;}return f?true:false;});return f?true:false;});}if(f){if(p==="visible"){v=o.getVisible();f.isVisible=v;}else if(p==="label"){v=o.getLabel();f.label=v;}else if(p==="visibleInAdvancedArea"){v=o.getVisibleInAdvancedArea();f.visibleInAdvancedArea=v;}}};d.prototype._handleGroupConfigurationChanged=function(e){var p,g;p=e.getParameter("propertyName");g=e.oSource;if(p==="label"){this._handleGroupConfigurationLabelChanged(g);}};d.prototype._handleGroupConfigurationLabelChanged=function(g){var f,k,L;if(!g){return;}L=g.getLabel();k=g.getKey();f=this._getFilterGroupItemByGroupName(k);if(f){f.setGroupTitle(L);}else{this._handleGroupConfigurationLabelChangedForDelayedFilterItems(k,L);}};d.prototype._handleGroupConfigurationLabelChangedForDelayedFilterItems=function(k,L){var g=null;if(this._aFilterBarViewMetadata){this._aFilterBarViewMetadata.some(function(i){if(i.groupName===k){g=i;}return g?true:false;});}if(g){g.groupLabel=L;}};d.prototype._getFilterItemByName=function(n){var f,e,i;f=this.getFilterItems();f.push.apply(f,this.getFilterGroupItems());e=f.length;for(i=0;i<e;i++){if(f[i].getName()===n){return f[i];}}};d.prototype._getFilterGroupItemByGroupName=function(n){var f,e,i;f=this.getFilterGroupItems();e=f.length;for(i=0;i<e;i++){if(f[i].getGroupName()===n){return f[i];}}};d.prototype.getAdditionalConfiguration=function(){return new A(this.getControlConfiguration(),this.getGroupConfiguration());};d.prototype.setEntityType=function(e){this.setProperty("entityType",e);this._initializeMetadata();return this;};d.prototype.setResourceUri=function(r){this.setProperty("resourceUri",r);this._initializeMetadata();return this;};d.prototype.propagateProperties=function(){F.prototype.propagateProperties.apply(this,arguments);this._initializeMetadata();};d.prototype._getFilterInformation=function(){var f,i,j,L=0,e=0,g,h=[],o;if(this._aFilterBarViewMetadata){L=this._aFilterBarViewMetadata.length;for(i=0;i<L;i++){f=this._aFilterBarViewMetadata[i];g=f.fields;e=g.length;for(j=0;j<e;j++){o=g[j];if(o.name===c.BASIC_SEARCH_FIELD_ID){this.setBasicSearch(o.control);this._attachToBasicSearch(o.control);continue;}else if(f.groupName===c.BASIC_FILTER_AREA_ID){this._createFieldInAdvancedArea({groupName:F.INTERNAL_GROUP,groupLabel:""},o);}else{this._createFieldInAdvancedArea(f,o);}h.push(o);}}var p=this.getAnalyticalParameters();L=p.length;for(i=0;i<L;i++){o=p[i];this._createAnalyticParameter(o);h.push(o);}}return h;};d.prototype._validateState=function(){var f=null,L,o,i=false;f=this.getAllFilterItems(true);if(f){L=f.length;while(L--){o=this.determineControlByFilterItem(f[L],true);if(o){if(o.__bValidatingToken){this.bIsSearchPending=true;i=true;break;}else if(o.getValueState&&o.getValueState()===sap.ui.core.ValueState.Error&&!o.data("__mandatoryEmpty")){i=true;break;}}}}if(this._oFilterProvider){return!i&&!this._oFilterProvider._validateConditionTypeFields();}else{return!i;}};d.prototype._isDateRangeTypeFilter=function(f){if(this._oFilterProvider&&this._oFilterProvider._mConditionTypeFields[f]){return true;}return false;};d.prototype._specialControls=function(o,f){if(o.setValue){if(this._isDateRangeTypeFilter(f)){return true;}else{q.sap.require("sap.m.DatePicker");if(o instanceof sap.m.DatePicker){return true;}}}return false;};d.prototype._clearErroneusControlValues=function(){var f=null,L,o,v;f=this.getAllFilterItems(true);if(f){L=f.length;while(L--){o=this.determineControlByFilterItem(f[L],true);if(o){if(o.getValueState&&o.getValueState()===sap.ui.core.ValueState.Error){v=o.getBinding("value");if(v&&!this._specialControls(o,f[L].getName())){v.checkUpdate(true);}else if(o.setValue){o.setValue("");o.setValueState(sap.ui.core.ValueState.None);}}}}}};d.prototype._attachToBasicSearch=function(B){if(B){B.attachSearch(function(){if(!this.isDialogOpen()){this.search();}}.bind(this));B.attachLiveChange(this._onChange.bind(this));}};d.prototype._onChange=function(e){var o=e.getSource();if(o.data("__mandatoryEmpty")){o.data("__mandatoryEmpty",null);o.setValueState(sap.ui.core.ValueState.None);}if(o.data("__validationError")&&!o.getValue()){o.data("__validationError",null);o.setValueState(sap.ui.core.ValueState.None);}if(this._oFilterProvider._bUpdatingFilterData||this._oFilterProvider._bCreatingInitialModel){return;}if(!o||(o&&!o.__bValidatingToken)){this.fireFilterChange(e);this._oFilterProvider._updateConditionTypeFields(e.getParameter("filterChangeReason"));}else{this._filterSetInErrorState(o);}if(this.isLiveMode()){this.search();}};d.prototype._handleChange=function(o){if(o){if(o.attachChange){o.attachChange(this._onChange.bind(this));}}};d.prototype._handleEnter=function(o){if(this.isLiveMode()){return;}o.attachBrowserEvent("keydown",function(e){if(e.which===13){o.__bSuggestInProgress=(o._oSuggestionPopup&&o._oSuggestionPopup.isOpen());}});o.attachBrowserEvent("keyup",function(e){if(e.which===13&&!o.__bSuggestInProgress){this.search();}}.bind(this));};d.prototype._createFilterFieldControl=function(f){if(f.conditionType){f.control=f.conditionType.initializeFilterItem();}else if(!f.control&&f.fCreateControl){f.fCreateControl(f);delete f.fCreateControl;}this._handleEnter(f.control);this._handleChange(f.control);};d.prototype._createAnalyticParameter=function(p){p.factory=function(){this._createFilterFieldControl(p);if(!p.control){return;}var o=new a({labelTooltip:p.quickInfo,label:p.label,name:p.fieldName,mandatory:p.isMandatory,visible:p.isVisible,control:p.control,hiddenFilter:false});this._addParameter(o);}.bind(this);p.groupName=F.INTERNAL_GROUP;return p;};d.prototype._createFieldInAdvancedArea=function(f,o){o.factory=function(){this._createFilterFieldControl(o);var e=new a({labelTooltip:o.quickInfo,label:o.label,name:o.fieldName,groupName:f.groupName,groupTitle:f.groupLabel,mandatory:o.isMandatory,visible:o.isVisible,visibleInAdvancedArea:o.visibleInAdvancedArea||(f.groupName===F.INTERNAL_GROUP),control:o.control,hiddenFilter:o.hiddenFilter});if(o.isCustomFilterField){e.data("isCustomField",true);}this.addFilterGroupItem(e);}.bind(this);o.groupName=f.groupName;o.groupTitle=f.groupLabel;return o;};d.prototype.ensureLoadedValueHelp=function(f){if(this._oFilterProvider){this._oFilterProvider.getAssociatedValueHelpProviders().some(function(v){if(v.sFieldName===f){if(!v.bInitialised){v.loadAnnotation();}return true;}});}};d.prototype.ensureLoadedValueList=function(f){if(this._oFilterProvider){this._oFilterProvider.getAssociatedValueListProviders().some(function(v){if(v.sFieldName===f){if(!v.bInitialised){v.loadAnnotation();}return true;}});}};d.prototype.ensureLoadedValueHelpList=function(f){this.ensureLoadedValueHelp(f);this.ensureLoadedValueList(f);};d.prototype.getFilters=function(f){if(!f||!f.length){f=this._getVisibleFieldNames(true);}return this._oFilterProvider?this._oFilterProvider.getFilters(f):[];};d.prototype.getParameters=function(){return this._oFilterProvider?this._oFilterProvider.getParameters():{};};d.prototype.getAnalyticBindingPath=function(){var B="";if(this._oFilterProvider&&this.getConsiderAnalyticalParameters()){B=this._oFilterProvider.getAnalyticBindingPath();}return B;};d.prototype.getControlByKey=function(k){return this.determineControlByName(k);};d.prototype._getVisibleFieldNames=function(i){var f=[],v=this.getAllFilterItems(true),L=v.length,I;L=v.length;while(L--){I=v[L];if(I){if(i&&I._isParameter()){continue;}f.push(I.getName());}}return f;};d.prototype.getFilterData=function(e){var D=null;if(this._oFilterProvider){if(e){D=this._oFilterProvider.getFilterData();}else{D=this._oFilterProvider.getFilledFilterData(this._getVisibleFieldNames());}}return D;};d.prototype._checkHasValueData=function(o){if(o){if(typeof o==="boolean"){return o;}else if(typeof o==="string"){if(o.toLowerCase()==="true"){return true;}}}return false;};d.prototype._checkForValues=function(D,f,o){var v=null;if(D&&f&&o){if(!f.data("isCustomField")){v=D[f.getName()];}else{var e=o.data("hasValue");if((e!==undefined)&&(e!=null)){return this._checkHasValueData(e);}else{if(o.getValue){v=o.getValue();}else if(o.getSelectedKey){v=o.getSelectedKey();}}}}return v?true:false;};d.prototype.getFiltersWithValues=function(){var f=[];var e=this.getAllFilterItems(true),o,D=this.getFilterData(),L=0,g;if(e&&D){L=e.length;while(L--){o=e[L];g=this.determineControlByFilterItem(o,true);if(this._checkForValues(D,o,g)){f.push(o);}}}return f.reverse();};d.prototype.getFilterDataAsString=function(e){var D=null;if(this._oFilterProvider){if(e){D=this._oFilterProvider.getFilterDataAsString();}else{D=this._oFilterProvider.getFilledFilterDataAsString(this._getVisibleFieldNames());}}return D;};d.prototype.setFilterData=function(j,r){if(this._oFilterProvider){this._oFilterProvider.setFilterData(j,r);}if(j&&(Object.keys(j).length===1)&&j._CUSTOM){return;}this.fireFilterChange({afterFilterDataUpdate:true});};d.prototype.setFilterDataAsString=function(j,r){if(j){this.setFilterData(JSON.parse(j),r);}};d.prototype.fireClear=function(){this._clearFilterFields();this.fireEvent("clear",arguments);};d.prototype._clearFilterFields=function(){if(this._oFilterProvider){this._oFilterProvider.clear();this._clearErroneusControlValues();}this.fireFilterChange({afterFilterDataUpdate:true});};d.prototype.fireReset=function(){this._resetFilterFields();this.fireEvent("reset",arguments);};d.prototype._resetFilterFields=function(){if(this._oFilterProvider){this._oFilterProvider.reset();this._clearErroneusControlValues();}this.fireFilterChange({afterFilterDataUpdate:true});};d.prototype.triggerSearch=function(D){if(this.getSuppressSelection()){return;}this._clearDelayedSearch();this._iDelayedSearchId=q.sap.delayedCall(D||0,this,"_search");};d.prototype.search=function(s){if(this.getSuppressSelection()){return;}var L=this.isLiveMode();if(s&&!L){return this._search();}else{this.triggerSearch(L?d.LIVE_MODE_INTERVAL:0);}return true;};d.prototype._search=function(){var p=[],o={},e=true,i=false,E;var I=this.verifySearchAllowed();if(I.hasOwnProperty("pending")){return;}else if(I.hasOwnProperty("error")){e=false;i=true;}else if(I.hasOwnProperty("mandatory")){e=false;}if(this.isPending()&&!this._bIsPendingChangeAttached){var h=function(f){if(f.getParameter("pendingValue")===false){this.detachPendingChange(h);this._bIsPendingChangeAttached=false;this._search();}}.bind(this);this._bIsPendingChangeAttached=true;this.attachPendingChange(h);return;}this._clearDelayedSearch();if(e){o.selectionSet=this._retrieveCurrentSelectionSet(false,true);p.push(o);this.fireSearch(p);}else{if(!this._oResourceBundle){this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");}if(!i){if(!this._sMandatoryErrorMessage){this._sMandatoryErrorMessage=this._oResourceBundle.getText("EMPTY_MANDATORY_MESSAGE");}E=this._sMandatoryErrorMessage;}else{if(!this._sValidationErrorMessage){this._sValidationErrorMessage=this._oResourceBundle.getText("VALIDATION_ERROR_MESSAGE");}E=this._sValidationErrorMessage;}if(this.getShowMessages()&&!this.getLiveMode()){try{this._activateMainContent();M.error(E,{styleClass:(this.$()&&this.$().closest(".sapUiSizeCompact").length)?"sapUiSizeCompact":"",onClose:this._setFocusOnFirstErroneousField.bind(this)});}catch(x){return;}}else{this._setFocusOnFirstErroneousField();q.sap.log.warning("search was not triggered. "+E);}if(this._bExpandAdvancedFilterArea&&this.rerenderFilters){this.rerenderFilters(true);}}return e;};d.prototype.validateMandatoryFields=function(){return this._validateMandatoryFields();};d.prototype.verifySearchAllowed=function(){delete this.bIsSearchPending;if(this._validateState()){if(this.validateMandatoryFields()){return{};}return{mandatory:true};}if(this.bIsSearchPending){return{pending:true};}return{error:true};};d.prototype._setFocusOnFirstErroneousField=function(){var f=null,L,o,i;f=this.getAllFilterItems(true);if(f){L=f.length;for(i=0;i<L;i++){o=this.determineControlByFilterItem(f[i],true);if(o&&o.getValueState&&o.getValueState()===sap.ui.core.ValueState.Error){q.sap.delayedCall(0,o,"focus");break;}}}};d.prototype.setLiveMode=function(f){if(!this._isPhone()){if(f){this.hideGoButton();}else{this.restoreGoButton();}}if(this._oSmartVariantManagement){if(f){if(this._bShowShareState===undefined){this._bShowShareState=this._oSmartVariantManagement.getShowExecuteOnSelection();}this._oSmartVariantManagement.setShowExecuteOnSelection(false);}else{if(this._bShowShareState!==undefined){this._oSmartVariantManagement.setShowExecuteOnSelection(this._bShowShareState);}}}this.setProperty("liveMode",f);return this;};d.prototype.isLiveMode=function(){if(this._isPhone()){return false;}return this.getLiveMode();};d.prototype._clearDelayedSearch=function(){if(this._iDelayedSearchId){q.sap.clearDelayedCall(this._iDelayedSearchId);this._iDelayedSearchId=null;}};d.prototype.isPending=function(){if(!this._oFilterProvider){return false;}return this._oFilterProvider.isPending();};d.prototype._validateMandatoryFields=function(){var f=true,e=this.determineMandatoryFilterItems(),o,D=this.getFilterData(),L=0,g;this._bExpandAdvancedFilterArea=false;if(e&&D){L=e.length;while(L--){o=e[L];g=this.determineControlByFilterItem(o,true);if(g&&g.setValueState){if(this._checkForValues(D,o,g)){if(g.data("__mandatoryEmpty")){g.data("__mandatoryEmpty",null);g.setValueState(sap.ui.core.ValueState.None);}}else{f=false;g.setValueState(sap.ui.core.ValueState.Error);g.data("__mandatoryEmpty",true);if(o.getGroupName){this._bExpandAdvancedFilterArea=true;}}}}}return f;};d.prototype._setSmartVariant=function(s){if(s){var o=sap.ui.getCore().byId(s);if(o){if(o instanceof S){if(this._oVariantManagement&&!this._oVariantManagement.isPageVariant()){this._replaceVariantManagement(o);this._oSmartVariantManagement=o;}}else{q.sap.log.error("Control with the id="+s+" not of expected type");}}else{q.sap.log.error("Control with the id="+s+" not found");}}};d.prototype.setSmartVariant=function(s){if(this.getAdvancedMode()){q.sap.log.error("not supported for the advanced mode");return;}this.setAssociation("smartVariant",s);this._setSmartVariant(s);return this;};d.prototype.getSmartVariant=function(){if(this.getAdvancedMode()){q.sap.log.error("not supported for the advanced mode");return null;}var s=this.getAssociation("smartVariant");if(s){return sap.ui.getCore().byId(s);}return this._oSmartVariantManagement;};d.prototype._createVariantManagement=function(){this._oSmartVariantManagement=null;if(this.getAdvancedMode()){return F.prototype._createVariantManagement.apply(this);}var s=this.getSmartVariant();this._setSmartVariant(s);if(!this._oSmartVariantManagement){this._oSmartVariantManagement=new S(this.getId()+"-variant",{showExecuteOnSelection:true,showShare:true});}return this._oSmartVariantManagement;};d.prototype._initializeVariantManagement=function(){if(!this.isRunningInValueHelpDialog&&this._oSmartVariantManagement&&this.getPersistencyKey()){var p=new P({type:"filterBar",keyName:"persistencyKey",dataSource:this.getEntitySet()||this.getEntityType()});p.setControl(this);this._oSmartVariantManagement.addPersonalizableControl(p);var v=this._checkHasValueData(this.data("executeStandardVariantOnSelect"));if(v){this._oSmartVariantManagement._executeOnSelectForStandardVariantByXML(v);}F.prototype._initializeVariantManagement.apply(this,arguments);}else{this.fireInitialise();this.fireInitialized();}};d.prototype.setConsiderSelectionvariants=function(v){this.setProperty("considerSelectionVariants",v);};d.prototype.fireInitialized=function(){if(!this.isRunningInValueHelpDialog&&this.getPersistencyKey()&&this.getConsiderSelectionVariants()&&this._oSmartVariantManagement&&this._oSmartVariantManagement.getEnabled()){try{if(!this._oSmartVariantManagement.isPageVariant()){this._prepareSelectionVarians();}}finally{}}F.prototype.fireInitialized.apply(this,arguments);};d.prototype._prepareSelectionVarians=function(){var s,v,D,k=d.SELECTION_VARIANT_KEY_PREFIX,n=false;s=this.getSelectionVariants();if(s){this._oSmartVariantManagement.registerSelectionVariantHandler({callback:this.getSelectionVariant,handler:this},k);sap.ui.require("sap.ui.comp.variants.VariantItem");s.forEach(function(o){if(o.qualifier){v=new sap.ui.comp.variants.VariantItem({key:k+o.qualifier,text:o.annotation.Text.String,global:true,executeOnSelection:false,lifecycleTransportId:"",lifecyclePackage:"",namespace:"",readOnly:true,labelReadOnly:true,author:""});this._oSmartVariantManagement.insertVariantItem(v,0);}else{n=this._defaultSelectionVariantHandling(o);}}.bind(this));if(!this._oSmartVariantManagement._getDefaultVariantKey()){if(this.getDefaultSelectionVariantName()){D=k+this.getDefaultSelectionVariantName();this._oSmartVariantManagement.setInitialSelectionKey(D);this._oSmartVariantManagement.fireSelect({key:D});}else if(n){this._oSmartVariantManagement.fireSelect({key:this._oSmartVariantManagement.STANDARDVARIANTKEY});}}}};d.prototype._defaultSelectionVariantHandling=function(s){var v=null;if(!this._oSmartVariantManagement){return false;}if(this._oSmartVariantManagement._sAppStandardVariantKey){return false;}if(s&&s.annotation){v=this.convertSelectionVariantToInternalVariant(s.annotation);if(v){if(!this._oSmartVariantManagement.isPageVariant()){v.version="V1";var f=JSON.parse(v.filterBarVariant);if(this._oSmartVariantManagement._oStandardVariant){var o=JSON.parse(this._oSmartVariantManagement._oStandardVariant.filterBarVariant);if(o._CUSTOM){f._CUSTOM=o._CUSTOM;v.filterBarVariant=JSON.stringify(f);}}this._oSmartVariantManagement._oStandardVariant=v;return true;}}}return false;};d.prototype._adaptFilterVisibilityProperties=function(f){var e,E=null,g=[];if(this._oSmartVariantManagement&&this._oSmartVariantManagement._oStandardVariant&&this._oSmartVariantManagement._oStandardVariant.filterbar){q.extend(true,g,this._oSmartVariantManagement._oStandardVariant.filterbar);}for(E in f){e=false;g.some(function(o){if(o.name===E){e=true;o.partOfCurrentVariant=true;}return e;});if(!e){g.push({group:this._determineGroupNameByName(E),name:E,partOfCurrentVariant:true,visibleInFilterBar:false,visible:true});}}return g;};d.prototype.getSelectionVariant=function(k,s){var v=null,o=null,K=k.substring(d.SELECTION_VARIANT_KEY_PREFIX.length);this.getSelectionVariants().some(function(i){if(i.qualifier===K){o=i;return true;}return false;});if(o){if(o.variantContent){v=o.variantContent;}else{v=this.convertSelectionVariantToInternalVariant(o.annotation);o.variantContent=v;}}return v;};d.prototype.convertSelectionVariantToInternalVariant=function(s){sap.ui.require("sap.ui.model.odata.AnnotationHelper");sap.ui.require("sap.ui.model.Context");sap.ui.require("sap.ui.comp.filterbar.VariantConverterFrom");var e=JSON.stringify(s),o=JSON.parse(e),v={},p={};var D=new sap.ui.model.Context(null,"/"),f=o.SelectOptions,g=o.Parameters,h;if(f){f.forEach(function(i){i.PropertyName=i.PropertyName.PropertyPath;i.Ranges.forEach(function(r){r.Sign=r.Sign.EnumMember.split("/")[1];r.Option=r.Option.EnumMember.split("/")[1];r.Low=r.Low&&sap.ui.model.odata.AnnotationHelper.format(D,r.Low)||null;r.High=r.High&&sap.ui.model.odata.AnnotationHelper.format(D,r.High)||null;});});}if(g){g.forEach(function(i){i.PropertyName=i.PropertyName.PropertyPath.split("/")[1]||i.PropertyName.PropertyPath;i.PropertyValue=sap.ui.model.odata.AnnotationHelper.format(D,i.PropertyValue)||null;});}h=new sap.ui.comp.filterbar.VariantConverterFrom();v=h.convert(JSON.stringify(o),this);p=JSON.parse(v.payload);if(this._oSmartVariantManagement.isPageVariant()){v[this.getPersistencyKey()]={"version":"V2","filterbar":this._adaptFilterVisibilityProperties(p),"filterBarVariant":JSON.stringify(p)};}else{v={"version":"V2","filterbar":this._adaptFilterVisibilityProperties(p),"filterBarVariant":JSON.stringify(p)};}return v;};d.prototype.getBasicSearchControl=function(){return sap.ui.getCore().byId(this.getBasicSearch());};d.prototype.addFieldToAdvancedArea=function(k){var f;f=this._getFilterItemByName(k);if(f&&f.setVisibleInAdvancedArea){f.setVisibleInAdvancedArea(true);}};d.prototype.getConditionTypeByKey=function(k){if(this._oFilterProvider._mConditionTypeFields[k]){return this._oFilterProvider._mConditionTypeFields[k].conditionType;}};d.prototype.isInitialised=function(){return!!this.bIsInitialised;};d.prototype.destroy=function(){this._clearDelayedSearch();if(this._oSmartVariantManagement&&this.getConsiderSelectionVariants()){this._oSmartVariantManagement.unregisterSelectionVariantHandler(this);}F.prototype.destroy.apply(this,arguments);sap.ui.getCore().getMessageManager().unregisterObject(this);if(this._oFilterProvider&&this._oFilterProvider.destroy){this._oFilterProvider.destroy();}this._oFilterProvider=null;this._aFilterBarViewMetadata=null;this._bExpandAdvancedFilterArea=null;this._oResourceBundle=null;this._sMandatoryErrorMessage=null;this._sValidationErrorMessage=null;this._oSmartVariantManagement=null;};return d;},true);
