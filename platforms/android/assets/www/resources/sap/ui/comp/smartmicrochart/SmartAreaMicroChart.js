/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/library','sap/suite/ui/microchart/library','sap/ui/core/Control','sap/ui/comp/providers/ChartProvider','sap/m/ValueColor','sap/ui/core/CustomData','sap/ui/model/odata/CountMode','sap/ui/comp/smartmicrochart/SmartMicroChartCommons','sap/ui/core/format/DateFormat'],function(q,C,M,a,b,V,c,d,S,D){"use strict";var e=a.extend("sap.ui.comp.smartmicrochart.SmartAreaMicroChart",{metadata:{library:"sap.ui.comp",designTime:true,properties:{entitySet:{type:"string",group:"Misc",defaultValue:null},showLabel:{type:"boolean",group:"Appearance",defaultValue:true},chartType:{type:"string",group:"Misc",defaultValue:null},enableAutoBinding:{type:"boolean",group:"Misc",defaultValue:true},chartBindingPath:{type:"string",group:"Misc",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"164px"},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"74px"},isResponsive:{type:"boolean",group:"Appearance",defaultValue:false}},defaultAggregation:"_chart",aggregations:{_chart:{type:"sap.suite.ui.microchart.AreaMicroChart",multiple:false,visibility:"hidden"},_chartTexts:{type:"sap.m.ListBase",multiple:false,visibility:"hidden"}},associations:{chartTitle:{type:"sap.m.Label",group:"Misc",multiple:false},chartDescription:{type:"sap.m.Label",group:"Misc",multiple:false},unitOfMeasure:{type:"sap.m.Label",group:"Misc",multiple:false}},events:{initialize:{}}}});e._CHART_TYPE=["Area","Line"];e.prototype.init=function(){this._bIsInitialized=false;this._bMetaModelLoadAttached=false;this.setProperty("chartType","Area",true);this.setAggregation("_chart",new M.AreaMicroChart(),true);};e.prototype.onBeforeRendering=function(){var o=this.getAggregation("_chart");o.setProperty("width",this.getWidth(),true);o.setProperty("height",this.getHeight(),true);o.setProperty("isResponsive",this.getIsResponsive(),true);M._passParentContextToChild(this,o);};e.prototype.destroy=function(){S._cleanup.call(this);a.prototype.destroy.apply(this,arguments);};e.prototype.setEntitySet=function(E){if(this.getProperty("entitySet")!==E){this.setProperty("entitySet",E,true);S._initializeMetadata.call(this);}return this;};e.prototype.setShowLabel=function(s){if(this.getShowLabel()!==s){this.setProperty("showLabel",s,true);this.getAggregation("_chart").setProperty("showLabel",s,true);this.invalidate();}return this;};e.prototype.setEnableAutoBinding=function(){return this.setProperty("enableAutoBinding",true,true);};e.prototype.setChartType=function(){return this;};e.prototype.propagateProperties=function(){if(a.prototype.propagateProperties){a.prototype.propagateProperties.apply(this,arguments);}S._initializeMetadata.call(this);};e.prototype._getBindingPath=function(){if(this.getChartBindingPath()){return this.getChartBindingPath();}else if(this.getEntitySet()){return'/'+this.getEntitySet();}else{return"";}};e.prototype.bindElement=function(){return this;};e.prototype._createAndBindInnerChart=function(){this._createChartLabels();this._createChartItem("chart",this._oDataPointAnnotations.Value.Path);this._createChartItem("target",this._oDataPointAnnotations.TargetValue.Path);this._buildThreshold();};e.prototype._buildThreshold=function(){var o=this._oDataPointAnnotations.CriticalityCalculation;if(S._hasMember(o,"ImprovementDirection.EnumMember")){switch(o.ImprovementDirection.EnumMember){case S._MINIMIZE:this._createChartItem("minThreshold",o.ToleranceRangeHighValue.Path,V.Good);this._createChartItem("maxThreshold",o.DeviationRangeHighValue.Path,V.Error);break;case S._MAXIMIZE:this._createChartItem("minThreshold",o.DeviationRangeLowValue.Path,V.Error);this._createChartItem("maxThreshold",o.ToleranceRangeLowValue.Path,V.Good);break;case S._TARGET:this._createChartItem("minThreshold",o.DeviationRangeLowValue.Path,V.Error);this._createChartItem("maxThreshold",o.DeviationRangeHighValue.Path,V.Error);this._createChartItem("innerMinThreshold",o.ToleranceRangeLowValue.Path,V.Good);this._createChartItem("innerMaxThreshold",o.ToleranceRangeHighValue.Path,V.Good);break;default:break;}}};e.prototype._createChartLabels=function(){var l,m=this._getLabelsMap();for(var k in m){l=new M.AreaMicroChartLabel();this.getAggregation("_chart").setAggregation(m[k],l,true);}};e.prototype._formatDimension=function(v){if(typeof v==="string"){var A=S._getPropertyAnnotation.call(this,this._oChartViewMetadata.dimensionFields[0]),p=S._getSemanticsPattern.call(this,A);if(p){v=D.getInstance({pattern:p}).parse(v);}}if(v instanceof Date){return parseFloat(v.getTime());}else if(!isNaN(v)){return parseFloat(v);}else{this.getAggregation("_chart").enableXIndexing(true);return 0;}};e.prototype._createChartItem=function(f,p,g){var P,i;P=new M.AreaMicroChartPoint({x:{path:this._oChartViewMetadata.dimensionFields[0],formatter:this._formatDimension.bind(this)},y:{path:p,type:"sap.ui.model.odata.type.Decimal"}});i=new M.AreaMicroChartItem({points:{path:this._getBindingPath(),template:P,parameters:{countMode:d.None},events:{change:this._onBindingDataChange.bind(this)}},color:g});this.getAggregation("_chart").setAggregation(f,i,true);};e.prototype._onBindingDataChange=function(){var p=this.getAggregation("_chart").getAggregation("chart").getBinding("points");this._updateAssociations(p);this._updateChartLabels(p);};e.prototype._updateAssociations=function(p){var o=p.getContexts(0,1)[0],f=o&&o.getObject();S._updateAssociations.call(this,f);};e.prototype._updateChartLabels=function(p){var o,l,f,L,F,g;o=p.getContexts();l=o.length;if(l>0){f=o[0];L=o[l-1];F=f&&f.getObject();g=L&&L.getObject();S._updateChartLabels.call(this,F,"first");S._updateChartLabels.call(this,g,"last");}};e.prototype._getSupportedChartTypes=function(){return e._CHART_TYPE;};e.prototype._getLabelsMap=function(){return{"leftTop":"firstYLabel","rightTop":"lastYLabel","leftBottom":"firstXLabel","rightBottom":"lastXLabel"};};return e;});
