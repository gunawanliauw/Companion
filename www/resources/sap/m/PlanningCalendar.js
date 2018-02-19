/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/LocaleData','./PlanningCalendarRow','./library','sap/ui/unified/library','sap/ui/unified/calendar/CalendarUtils','sap/ui/unified/calendar/CalendarDate','sap/ui/unified/DateRange','sap/ui/unified/CalendarDateInterval','sap/ui/unified/CalendarWeekInterval','sap/ui/unified/CalendarOneMonthInterval'],function(q,C,L,P,l,u,a,b,D,c,d,e){"use strict";var f=C.extend("sap.m.PlanningCalendar",{metadata:{library:"sap.m",properties:{startDate:{type:"object",group:"Data"},viewKey:{type:"string",group:"Appearance",defaultValue:sap.ui.unified.CalendarIntervalType.Hour},singleSelection:{type:"boolean",group:"Misc",defaultValue:true},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},showIntervalHeaders:{type:"boolean",group:"Appearance",defaultValue:true},showEmptyIntervalHeaders:{type:"boolean",group:"Appearance",defaultValue:true},showRowHeaders:{type:"boolean",group:"Appearance",defaultValue:true},noDataText:{type:"string",group:"Misc",defaultValue:null},groupAppointmentsMode:{type:"sap.ui.unified.GroupAppointmentsMode",group:"Appearance",defaultValue:sap.ui.unified.GroupAppointmentsMode.Collapsed},appointmentsReducedHeight:{type:"boolean",group:"Appearance",defaultValue:false},appointmentsVisualization:{type:"sap.ui.unified.CalendarAppointmentVisualization",group:"Appearance",defaultValue:sap.ui.unified.CalendarAppointmentVisualization.Standard},minDate:{type:"object",group:"Misc",defaultValue:null},maxDate:{type:"object",group:"Misc",defaultValue:null}},aggregations:{rows:{type:"sap.m.PlanningCalendarRow",multiple:true,singularName:"row"},views:{type:"sap.m.PlanningCalendarView",multiple:true,singularName:"view"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},toolbarContent:{type:"sap.ui.core.Control",multiple:true,singularName:"toolbarContent"},table:{type:"sap.m.Table",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{appointmentSelect:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},appointments:{type:"sap.ui.unified.CalendarAppointment[]"},multiSelect:{type:"boolean"}}},intervalSelect:{parameters:{startDate:{type:"object"},endDate:{type:"object"},subInterval:{type:"boolean"},row:{type:"sap.m.PlanningCalendarRow"}}},rowSelectionChange:{parameters:{rows:{type:"sap.m.PlanningCalendarRow[]"}}},startDateChange:{},viewChange:{},rowHeaderClick:{row:{type:"sap.m.PlanningCalendarRow"}}}}});var I=["_oTimeInterval","_oDateInterval","_oMonthInterval","_oWeekInterval","_oOneMonthInterval"],g={};g[sap.ui.unified.CalendarIntervalType.Day]={sInstanceName:"_oDateInterval",sIdSuffix:"-DateInt",oClass:c};g[sap.ui.unified.CalendarIntervalType.Week]={sInstanceName:"_oWeekInterval",sIdSuffix:"-WeekInt",oClass:d};g[sap.ui.unified.CalendarIntervalType.OneMonth]={sInstanceName:"_oOneMonthInterval",sIdSuffix:"-OneMonthInt",oClass:e};var A=sap.m.ScreenSize.Desktop;var h=C.extend("CalendarHeader",{metadata:{aggregations:{"toolbar":{type:"sap.m.Toolbar",multiple:false},"allCheckBox":{type:"sap.m.CheckBox",multiple:false}}},renderer:function(R,H){R.write("<div");R.writeControlData(H);R.addClass("sapMPlanCalHead");R.writeClasses();R.write(">");var T=H.getToolbar();if(T){R.renderControl(T);}var i=H.getAllCheckBox();if(i){R.renderControl(i);}R.write("</div>");}});f.prototype.init=function(){this._iBreakPointTablet=sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0];this._iBreakPointDesktop=sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[1];this._iBreakPointLargeDesktop=sap.ui.Device.media._predefinedRangeSets[sap.ui.Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[2];if(sap.ui.Device.system.phone||q('html').hasClass("sapUiMedia-Std-Phone")){this._iSize=0;this._iSizeScreen=0;}else if(sap.ui.Device.system.tablet||q('html').hasClass("sapUiMedia-Std-Tablet")){this._iSize=1;this._iSizeScreen=1;}else{this._iSize=2;this._iSizeScreen=2;}this._oRB=sap.ui.getCore().getLibraryResourceBundle("sap.m");var i=this.getId();this._oIntervalTypeSelect=new sap.m.Select(i+"-IntType",{maxWidth:"15rem",ariaLabelledBy:i+"-SelDescr"});this._oIntervalTypeSelect.attachEvent("change",_,this);this._oTodayButton=new sap.m.Button(i+"-Today",{text:this._oRB.getText("PLANNINGCALENDAR_TODAY"),type:sap.m.ButtonType.Transparent});this._oTodayButton.attachEvent("press",this._handleTodayPress,this);this._oHeaderToolbar=new sap.m.Toolbar(i+"-HeaderToolbar",{design:sap.m.ToolbarDesign.Transparent,content:[this._oIntervalTypeSelect,this._oTodayButton]});this._oCalendarHeader=new h(i+"-CalHead",{toolbar:this._oHeaderToolbar});this._oInfoToolbar=new sap.m.Toolbar(i+"-InfoToolbar",{height:"auto",design:sap.m.ToolbarDesign.Transparent,content:[this._oCalendarHeader,this._oTimeInterval]});var T=new sap.m.Table(i+"-Table",{infoToolbar:this._oInfoToolbar,mode:sap.m.ListMode.SingleSelectMaster,columns:[new sap.m.Column({styleClass:"sapMPlanCalRowHead"}),new sap.m.Column({width:"80%",styleClass:"sapMPlanCalAppRow",minScreenWidth:A,demandPopin:true})],ariaLabelledBy:i+"-Descr"});T.attachEvent("selectionChange",o,this);T.addDelegate({onBeforeRendering:function(){if(this._rowHeaderClickEvent){this._rowHeaderClickEvent.off();}},onAfterRendering:function(){this._rowHeaderClickEvent=T.$().find(".sapMPlanCalRowHead > div.sapMLIB").click(function(j){var R=q(j.currentTarget).control(0),G=sap.ui.getCore().byId(R.getAssociation("parentRow"));this.fireRowHeaderClick({row:G});}.bind(this));}},false,this);this.setAggregation("table",T,true);this.setStartDate(new Date());this._resizeProxy=q.proxy(m,this);};f.prototype.exit=function(){if(this._sResizeListener){sap.ui.core.ResizeHandler.deregister(this._sResizeListener);this._sResizeListener=undefined;}if(this._sUpdateCurrentTime){q.sap.clearDelayedCall(this._sUpdateCurrentTime);this._sUpdateCurrentTime=undefined;}var T=this.getAggregation("table");T.removeAllItems();I.forEach(function(j){if(this[j]){this[j]._oPlanningCalendar=undefined;this[j].destroy();this[j]=undefined;}},this);if(this._aViews){for(var i=0;i<this._aViews.length;i++){this._aViews[i].destroy();}}if(this._oSelectAllCheckBox){this._oSelectAllCheckBox.destroy();}if(this.getToolbarContent().length==0&&this._oToolbar){this._oToolbar.destroy();this._oToolbar=undefined;}if(this._rowHeaderClickEvent){this._rowHeaderClickEvent.off();this._rowHeaderClickEvent=null;}};f.prototype.onBeforeRendering=function(){this._bBeforeRendering=true;if((!this._oTimeInterval&&!this._oDateInterval&&!this._oMonthInterval&&!this._oWeekInterval&&!this._oOneMonthInterval)||this._bCheckView){this.setViewKey(this.getViewKey());this._bCheckView=undefined;}v.call(this);if(this._sUpdateCurrentTime){q.sap.clearDelayedCall(this._sUpdateCurrentTime);this._sUpdateCurrentTime=undefined;}this._updateTodayButtonState();this._bBeforeRendering=undefined;};f.prototype._updateTodayButtonState=function(){if(this._oTodayButton){this._oTodayButton.setEnabled(!this._dateMatchesVisibleRange(new Date(),this.getViewKey()));}};f.prototype._dateMatchesVisibleRange=function(i,V){var j=this._getView(V,!this._bBeforeRendering);if(!j){return false;}var G=j.getIntervalType(),H=g[G],J=H?this[H.sInstanceName]:null,R=false;if(J&&J._dateMatchesVisibleRange){R=J._dateMatchesVisibleRange(i);}return R;};f.prototype.onAfterRendering=function(i){i.size={width:this.getDomRef().offsetWidth};m.call(this,i,true);if(!this._sResizeListener){this._sResizeListener=sap.ui.core.ResizeHandler.register(this,this._resizeProxy);}this._updateCurrentTimeVisualization(false);};f.prototype.setStartDate=function(S){var i,j;if(!S){S=new Date();}else{a._checkJSDateObject(S);}if(this.getViewKey()===sap.ui.unified.CalendarIntervalType.Week){i=a.getFirstDateOfWeek(a._createUniversalUTCDate(S,undefined,true));S.setTime(a._createLocalDate(i,true).getTime());}if(this.getViewKey()===sap.ui.unified.CalendarIntervalType.OneMonth){j=a.getFirstDateOfMonth(a._createUniversalUTCDate(S,undefined,true));S.setTime(a._createLocalDate(j,true).getTime());}if(q.sap.equal(S,this.getStartDate())){this._updateTodayButtonState();return this;}var Y=S.getFullYear();a._checkYearInValidRange(Y);var M=this.getMinDate();if(M&&M.getTime()>S.getTime()){q.sap.log.warning("StartDate < minDate -> StartDate set to minDate",this);S=new Date(M.getTime());}else{var G=this.getMaxDate();if(G&&G.getTime()<S.getTime()){q.sap.log.warning("StartDate > maxDate -> StartDate set to minDate",this);if(M){S=new Date(M.getTime());}else{S=new Date(1,0,1);S.setFullYear(1);}}}this.setProperty("startDate",S,true);I.forEach(function(H){if(this[H]){this[H].setStartDate(new Date(S.getTime()));}},this);this._setRowsStartDate(new Date(S.getTime()));if(this.getViewKey()===sap.ui.unified.CalendarIntervalType.Week||this.getViewKey()===sap.ui.unified.CalendarIntervalType.OneMonth){this._updateTodayButtonState();}if(this.getDomRef()){this._updateCurrentTimeVisualization(false);}return this;};f.prototype.setMinDate=function(i){if(q.sap.equal(i,this.getMinDate())){return this;}var M=this.getMaxDate();if(i){a._checkJSDateObject(i);var Y=i.getFullYear();a._checkYearInValidRange(Y);this.setProperty("minDate",i,true);this._bNoStartDateChange=true;I.forEach(function(j){if(this[j]){this[j].setMinDate(new Date(i.getTime()));}},this);if(M&&M.getTime()<i.getTime()){q.sap.log.warning("minDate > maxDate -> maxDate set to end of the month",this);M=new Date(i.getTime());M.setMonth(M.getMonth()+1,0);M.setHours(23);M.setMinutes(59);M.setSeconds(59);M.setMilliseconds(0);this.setMaxDate(M);}this._bNoStartDateChange=undefined;var S=this.getStartDate();if(S&&S.getTime()<i.getTime()){q.sap.log.warning("StartDate < minDate -> StartDate set to minDate",this);S=new Date(i.getTime());this.setStartDate(S);}}else{this.setProperty("minDate",undefined,true);I.forEach(function(j){if(this[j]){this[j].setMinDate();}},this);}var T=new Date();if(i&&T.getTime()<i.getTime()){this._oTodayButton.setVisible(false);}else if(!M||T.getTime()<M.getTime()){this._oTodayButton.setVisible(true);}return this;};f.prototype.setMaxDate=function(i){if(q.sap.equal(i,this.getMaxDate())){return this;}var M=this.getMinDate();if(i){a._checkJSDateObject(i);var Y=i.getFullYear();a._checkYearInValidRange(Y);this.setProperty("maxDate",i,true);this._bNoStartDateChange=true;I.forEach(function(j){if(this[j]){this[j].setMaxDate(new Date(i.getTime()));}},this);if(M&&M.getTime()>i.getTime()){q.sap.log.warning("maxDate < minDate -> maxDate set to begin of the month",this);M=new Date(i.getTime());M.setDate(1);M.setHours(0);M.setMinutes(0);M.setSeconds(0);M.setMilliseconds(0);this.setMinDate(M);}this._bNoStartDateChange=undefined;var S=this.getStartDate();if(S&&S.getTime()>i.getTime()){q.sap.log.warning("StartDate > maxDate -> StartDate set to minDate",this);if(M){S=new Date(M.getTime());}else{S=new Date(1,0,1);S.setFullYear(1);}this.setStartDate(S);}}else{this.setProperty("maxDate",undefined,true);I.forEach(function(j){if(this[j]){this[j].setMaxDate();}},this);}var T=new Date();if(i&&T.getTime()>i.getTime()){this._oTodayButton.setVisible(false);}else if(!M||T.getTime()>M.getTime()){this._oTodayButton.setVisible(true);}return this;};f.prototype.setViewKey=function(K){var j,O,G,H=this.getViewKey(),S;this.setProperty("viewKey",K,true);this._oIntervalTypeSelect.setSelectedKey(K);if(this._oInfoToolbar.getContent().length>1){this._oInfoToolbar.removeContent(1);}if(K===sap.ui.unified.CalendarIntervalType.Week||K===sap.ui.unified.CalendarIntervalType.OneMonth){O=this.getStartDate();this.setStartDate(new Date(O.getTime()));if(O.getTime()!==this.getStartDate().getTime()){this.fireStartDateChange();}}var J=this.getStartDate();var M=this.getMinDate();var N=this.getMaxDate();var V=this._getView(K,!this._bBeforeRendering);if(!V){this._bCheckView=true;this.invalidate();}else{var Q=V.getIntervalType();var R=this._getIntervals(V);this._bCheckView=false;switch(Q){case sap.ui.unified.CalendarIntervalType.Hour:if(!this._oTimeInterval){this._oTimeInterval=new sap.ui.unified.CalendarTimeInterval(this.getId()+"-TimeInt",{startDate:new Date(J.getTime()),items:R,pickerPopup:true});this._oTimeInterval.attachEvent("startDateChange",this._handleStartDateChange,this);this._oTimeInterval.attachEvent("select",this._handleCalendarSelect,this);this._oTimeInterval._oPlanningCalendar=this;this._oTimeInterval.getSpecialDates=function(){return this._oPlanningCalendar.getSpecialDates();};if(M){this._oTimeInterval.setMinDate(new Date(M.getTime()));}if(N){this._oTimeInterval.setMaxDate(new Date(N.getTime()));}}else if(this._oTimeInterval.getItems()!=R){this._oTimeInterval.setItems(R);}this._oInfoToolbar.addContent(this._oTimeInterval);break;case sap.ui.unified.CalendarIntervalType.Day:case sap.ui.unified.CalendarIntervalType.Week:case sap.ui.unified.CalendarIntervalType.OneMonth:G=g[Q];j=this[G.sInstanceName];if(!j){j=new G.oClass(this.getId()+G.sIdSuffix,{startDate:new Date(J.getTime()),days:R,showDayNamesLine:false,pickerPopup:true});j.attachEvent("startDateChange",this._handleStartDateChange,this);j.attachEvent("select",this._handleCalendarSelect,this);if(K===sap.ui.unified.CalendarIntervalType.OneMonth){j._setRowsStartDate=this._setRowsStartDate.bind(this);}j._oPlanningCalendar=this;j.getSpecialDates=function(){return this._oPlanningCalendar.getSpecialDates();};if(M){j.setMinDate(new Date(M.getTime()));}if(N){j.setMaxDate(new Date(N.getTime()));}}else if(j.getDays()!==R){j.setDays(R);}this._oInfoToolbar.addContent(j);this[G.sInstanceName]=j;break;case sap.ui.unified.CalendarIntervalType.Month:if(!this._oMonthInterval){this._oMonthInterval=new sap.ui.unified.CalendarMonthInterval(this.getId()+"-MonthInt",{startDate:new Date(J.getTime()),months:R,pickerPopup:true});this._oMonthInterval.attachEvent("startDateChange",this._handleStartDateChange,this);this._oMonthInterval.attachEvent("select",this._handleCalendarSelect,this);this._oMonthInterval._oPlanningCalendar=this;this._oMonthInterval.getSpecialDates=function(){return this._oPlanningCalendar.getSpecialDates();};if(M){this._oMonthInterval.setMinDate(new Date(M.getTime()));}if(N){this._oMonthInterval.setMaxDate(new Date(N.getTime()));}}else if(this._oMonthInterval.setMonths()!=R){this._oMonthInterval.setMonths(R);}this._oInfoToolbar.addContent(this._oMonthInterval);break;default:throw new Error("Unknown IntervalType: "+Q+"; "+this);}var T=this.getRows();for(var i=0;i<T.length;i++){var U=T[i];var W=U.getCalendarRow();W.setIntervalType(Q);W.setIntervals(R);W.setShowSubIntervals(V.getShowSubIntervals());}if(this.getDomRef()){this._updateCurrentTimeVisualization(false);}}if(this._oOneMonthInterval&&K===sap.ui.unified.CalendarIntervalType.OneMonth){this._oOneMonthInterval._setDisplayMode(this._iSize);this._oOneMonthInterval._adjustSelectedDate(b.fromLocalJSDate(O));if(this._iSize<2){this._setRowsStartDate(O);}}else if(this._oOneMonthInterval&&H===sap.ui.unified.CalendarIntervalType.OneMonth&&this._oOneMonthInterval.getSelectedDates().length){S=this._oOneMonthInterval.getSelectedDates()[0].getStartDate();if(S){this.setStartDate(S);}}this._updateTodayButtonState();return this;};f.prototype.setShowIntervalHeaders=function(S){this.setProperty("showIntervalHeaders",S,true);var R=this.getRows();for(var i=0;i<R.length;i++){var j=R[i];j.getCalendarRow().setShowIntervalHeaders(S);}return this;};f.prototype.setShowEmptyIntervalHeaders=function(S){this.setProperty("showEmptyIntervalHeaders",S,true);var R=this.getRows();for(var i=0;i<R.length;i++){var j=R[i];j.getCalendarRow().setShowEmptyIntervalHeaders(S);}return this;};f.prototype.setGroupAppointmentsMode=function(G){this.setProperty("groupAppointmentsMode",G,true);var R=this.getRows();for(var i=0;i<R.length;i++){var j=R[i];j.getCalendarRow().setGroupAppointmentsMode(G);}return this;};f.prototype.setAppointmentsReducedHeight=function(j){this.setProperty("appointmentsReducedHeight",j,true);var R=this.getRows();for(var i=0;i<R.length;i++){var G=R[i];G.getCalendarRow().setAppointmentsReducedHeight(j);}return this;};f.prototype.setAppointmentsVisualization=function(j){this.setProperty("appointmentsVisualization",j,true);var R=this.getRows();for(var i=0;i<R.length;i++){var G=R[i];G.getCalendarRow().setAppointmentsVisualization(j);}return this;};f.prototype.setShowRowHeaders=function(S){this.setProperty("showRowHeaders",S,true);var T=this.getAggregation("table");T.getColumns()[0].setVisible(S);this._toggleAppointmentsColumnPopinState(S);this.$().toggleClass("sapMPlanCalNoHead",!S);z.call(this);E.call(this);return this;};f.prototype.addRow=function(R){this.addAggregation("rows",R,true);R.attachEvent("_change",B,this);var T=this.getAggregation("table");T.addItem(R.getColumnListItem());var i=R.getCalendarRow();i.setStartDate(this.getStartDate());i.setShowIntervalHeaders(this.getShowIntervalHeaders());i.setShowEmptyIntervalHeaders(this.getShowEmptyIntervalHeaders());i.setGroupAppointmentsMode(this.getGroupAppointmentsMode());i.setAppointmentsReducedHeight(this.getAppointmentsReducedHeight());i.setLegend(this.getLegend());i.setAppointmentsVisualization(this.getAppointmentsVisualization());i.attachEvent("select",n,this);i.attachEvent("startDateChange",this._handleStartDateChange,this);i.attachEvent("leaveRow",x,this);i.attachEvent("intervalSelect",k,this);y.call(this);if(F.call(this)){var K=this.getViewKey();var V=this._getView(K);var j=V.getIntervalType();var G=this._getIntervals(V);i.setIntervalType(j);i.setIntervals(G);i.setShowSubIntervals(V.getShowSubIntervals());}E.call(this);return this;};f.prototype.insertRow=function(R,i){this.insertAggregation("rows",R,i);R.attachEvent("_change",B,this);var T=this.getAggregation("table");T.insertItem(R.getColumnListItem(),i,true);var j=R.getCalendarRow();j.setStartDate(this.getStartDate());j.setShowIntervalHeaders(this.getShowIntervalHeaders());j.setShowEmptyIntervalHeaders(this.getShowEmptyIntervalHeaders());j.setGroupAppointmentsMode(this.getGroupAppointmentsMode());j.setAppointmentsReducedHeight(this.getAppointmentsReducedHeight());j.setLegend(this.getLegend());j.setAppointmentsVisualization(this.getAppointmentsVisualization());j.attachEvent("select",n,this);j.attachEvent("startDateChange",this._handleStartDateChange,this);j.attachEvent("leaveRow",x,this);j.attachEvent("intervalSelect",k,this);y.call(this);if(F.call(this)){var K=this.getViewKey();var V=this._getView(K);var G=V.getIntervalType();var H=this._getIntervals(V);j.setIntervalType(G);j.setIntervals(H);j.setShowSubIntervals(V.getShowSubIntervals());}E.call(this);return this;};f.prototype.removeRow=function(O){var R=this.removeAggregation("rows",O,true);R.detachEvent("_change",B,this);var T=this.getAggregation("table");T.removeItem(R.getColumnListItem(),true);var i=R.getCalendarRow();i.detachEvent("select",n,this);i.detachEvent("startDateChange",this._handleStartDateChange,this);i.detachEvent("leaveRow",x,this);i.detachEvent("intervalSelect",k,this);y.call(this);E.call(this);return R;};f.prototype.removeAllRows=function(){var R=this.removeAllAggregation("rows",true);var T=this.getAggregation("table");T.removeAllItems(true);for(var i=0;i<R.length;i++){var j=R[i];j.detachEvent("_change",B,this);var G=j.getCalendarRow();G.detachEvent("select",n,this);G.detachEvent("startDateChange",this._handleStartDateChange,this);G.detachEvent("leaveRow",x,this);G.detachEvent("intervalSelect",k,this);}y.call(this);E.call(this);return R;};f.prototype.destroyRows=function(){var i=this.destroyAggregation("rows",true);var T=this.getAggregation("table");T.destroyItems(true);y.call(this);E.call(this);return i;};f.prototype.addToolbarContent=function(i){this.addAggregation("toolbarContent",i,true);p.call(this);return this;};f.prototype.insertToolbarContent=function(i,j){this.insertAggregation("toolbarContent",i,j);p.call(this);return this;};f.prototype.removeToolbarContent=function(O){var R=this.removeAggregation("toolbarContent",O,true);p.call(this);return R;};f.prototype.removeAllToolbarContent=function(){var R=this.removeAllAggregation("toolbarContent",true);p.call(this);return R;};f.prototype.destroyToolbarContent=function(){var i=this.destroyAggregation("toolbarContent",true);p.call(this);return i;};f.prototype.indexOfContent=function(i){return this.indexOfToolbarContent(i);};f.prototype.setSingleSelection=function(S){this.setProperty("singleSelection",S,true);z.call(this);E.call(this);if(S){this.selectAllRows(false);}else{y.call(this);}this.$().toggleClass("sapMPlanCalMultiSel",!S);return this;};f.prototype.setNoDataText=function(N){this.setProperty("noDataText",N,true);var T=this.getAggregation("table");T.setNoDataText(N);return this;};f.prototype.setLegend=function(j){this.setAssociation("legend",j,true);var R=this.getRows();for(var i=0;i<R.length;i++){var G=R[i];G.getCalendarRow().setLegend(j);}return this;};f.prototype.addAriaLabelledBy=function(i){this.addAssociation("ariaLabelledBy",i,true);var T=this.getAggregation("table");T.addAriaLabelledBy(i);return this;};f.prototype.removeAriaLabelledBy=function(O){this.removeAssociation("ariaLabelledBy",O,true);var T=this.getAggregation("table");T.removeAriaLabelledBy(O);return this;};f.prototype.removeAllAriaLabelledBy=function(){this.removeAllAssociation("ariaLabelledBy",true);var T=this.getAggregation("table");T.removeAllAriaLabelledBy();T.addAriaLabelledBy(this.getId()+"-Descr");return this;};f.prototype.invalidate=function(O){if(this._bDateRangeChanged||(O&&O instanceof D)){if(this.getDomRef()){var K=this.getViewKey();var V=this._getView(K);var i=V.getIntervalType();switch(i){case sap.ui.unified.CalendarIntervalType.Hour:if(this._oTimeInterval){this._oTimeInterval.invalidate(arguments);}break;case sap.ui.unified.CalendarIntervalType.Day:if(this._oDateInterval){this._oDateInterval.invalidate(arguments);}break;case sap.ui.unified.CalendarIntervalType.Month:if(this._oMonthInterval){this._oMonthInterval.invalidate(arguments);}break;case sap.ui.unified.CalendarIntervalType.OneMonth:if(this._oOneMonthInterval){this._oOneMonthInterval.invalidate(arguments);}break;case sap.ui.unified.CalendarIntervalType.Week:if(this._oWeekInterval){this._oWeekInterval.invalidate(arguments);}break;default:throw new Error("Unknown IntervalType: "+i+"; "+this);}}this._bDateRangeChanged=undefined;}else{if(O&&O instanceof sap.m.PlanningCalendarView){this._bCheckView=true;}C.prototype.invalidate.apply(this,arguments);}};f.prototype.addSpecialDate=function(S){this._bDateRangeChanged=true;if(S.getType()===sap.ui.unified.CalendarDayType.NonWorking){this.getAggregation("rows").forEach(function(R){R.addAggregation("_nonWorkingDates",this._buildPCRowDateRange(S));},this);}return C.prototype.addAggregation.call(this,"specialDates",S);};f.prototype.insertSpecialDate=function(S,i){this._bDateRangeChanged=true;if(S.getType()===sap.ui.unified.CalendarDayType.NonWorking){this.getAggregation("rows").forEach(function(R){R.insertAggregation("_nonWorkingDates",this._buildPCRowDateRange(S),i);},this);}return C.prototype.insertAggregation.call(this,"specialDates",S,i);};f.prototype.removeSpecialDate=function(S){var R;if(typeof S==="string"){S=sap.ui.getCore().byId(S);}this._bDateRangeChanged=true;if(S&&S.getType()===sap.ui.unified.CalendarDayType.NonWorking){this.getAggregation("rows").forEach(function(i){if(i.getAggregation("_nonWorkingDates")){R=i.getAggregation("_nonWorkingDates").filter(function(N){return N.data(P.PC_FOREIGN_KEY_NAME)===S.getId();});if(R.length){i.removeAggregation("_nonWorkingDates",R[0]);}}});}return C.prototype.removeAggregation.call(this,"specialDates",S);};f.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;if(this.getAggregation("rows")){this.getAggregation("rows").forEach(function(R){R.removeAllAggregation("_nonWorkingDates");});}return this.removeAllAggregation("specialDates");};f.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;this.getAggregation("rows").forEach(function(R){R.destroyAggregation("_nonWorkingDates");});return this.destroyAggregation("specialDates");};f.prototype.removeAllViews=function(){this._bCheckView=true;var R=this.removeAllAggregation("views");return R;};f.prototype.destroyViews=function(){this._bCheckView=true;var i=this.destroyAggregation("views");return i;};f.prototype.getSelectedRows=function(){return this.getRows().filter(function(R){return R.getSelected();});};f.prototype.selectAllRows=function(S){var R=this.getRows();if(!(S&&this.getSingleSelection())){for(var i=0;i<R.length;i++){var j=R[i];j.setSelected(S);}if(this._oSelectAllCheckBox){this._oSelectAllCheckBox.setSelected(S);}}return this;};f.prototype.onsaphomemodifiers=function(i){if((i.metaKey||i.ctrlKey)&&!i.altKey&&!i.shiftKey){var R=this.getRows();var j=R[0];var N=new q.Event("saphome");N._bPlanningCalendar=true;j.getCalendarRow().onsaphome(N);i.preventDefault();i.stopPropagation();}};f.prototype.onsapendmodifiers=function(i){if((i.metaKey||i.ctrlKey)&&!i.altKey&&!i.shiftKey){var R=this.getRows();var j=R[R.length-1];var N=new q.Event("sapend");N._bPlanningCalendar=true;j.getCalendarRow().onsapend(N);i.preventDefault();i.stopPropagation();}};f.prototype._getIntervals=function(V){var i=0;switch(this._iSize){case 0:i=V.getIntervalsS();break;case 1:i=V.getIntervalsM();break;default:i=V.getIntervalsL();break;}return i;};f.prototype._getView=function(K,N){var V=s.call(this);var j;for(var i=0;i<V.length;i++){j=V[i];if(j.getKey()!=K){j=undefined;}else{break;}}if(!j&&!N){throw new Error("PlanningCalendarView with key "+K+"not assigned "+this);}return j;};f.prototype._changeStartDate=function(S){if(this._bNoStartDateChange){return;}this.setStartDate(new Date(S.getTime()));this.fireStartDateChange();};f.prototype._updateCurrentTimeVisualization=function(U){if(this._sUpdateCurrentTime){q.sap.clearDelayedCall(this._sUpdateCurrentTime);this._sUpdateCurrentTime=undefined;}if(U){var R=this.getRows();for(var i=0;i<R.length;i++){var j=R[i];j.getCalendarRow().updateCurrentTimeVisualization();}}var N=new Date();var S=this.getStartDate();var K=this.getViewKey();var V=this._getView(K);var G=V.getIntervalType();var H=this._getIntervals(V);var T=0;var J=0;var M=0;switch(G){case sap.ui.unified.CalendarIntervalType.Hour:T=60000;J=S.getTime()-3600000;M=S.getTime()+H*3600000;break;case sap.ui.unified.CalendarIntervalType.Day:case sap.ui.unified.CalendarIntervalType.Week:case sap.ui.unified.CalendarIntervalType.OneMonth:T=1800000;J=S.getTime()-3600000;M=S.getTime()+H*86400000;break;default:T=-1;break;}if(N.getTime()<=M&&N.getTime()>=J&&T>0){this._sUpdateCurrentTime=q.sap.delayedCall(T,this,'_updateCurrentTimeVisualization',[true]);}};function _(i){this.setViewKey(i.getParameter("selectedItem").getKey());this.fireViewChange();}f.prototype._handleTodayPress=function(i){var j=new Date(),S,V=this.getViewKey();if(V===sap.ui.unified.CalendarIntervalType.OneMonth){S=a.getFirstDateOfMonth(a._createUniversalUTCDate(j,undefined,true));this._oOneMonthInterval._adjustSelectedDate(b.fromLocalJSDate(j),false);j=a._createLocalDate(S,true);}if(V===sap.ui.unified.CalendarIntervalType.Week){S=this.getStartDate();j.setHours(S.getHours());j.setMinutes(S.getMinutes());j.setSeconds(S.getSeconds());}this.setStartDate(j);this.fireStartDateChange();};f.prototype._handleStartDateChange=function(i){var S=i.oSource.getStartDate();this._changeStartDate(S);};f.prototype._handleCalendarSelect=function(i){var S=i.oSource.getSelectedDates();var j=new Date(S[0].getStartDate());var G=a._createUniversalUTCDate(j,undefined,true);var K=this.getViewKey();var V=this._getView(K);var H=V.getIntervalType();if(H!==sap.ui.unified.CalendarIntervalType.OneMonth||this._iSize>1){S[0].setStartDate();}switch(H){case sap.ui.unified.CalendarIntervalType.Hour:G.setUTCHours(G.getUTCHours()+1);break;case sap.ui.unified.CalendarIntervalType.Day:case sap.ui.unified.CalendarIntervalType.Week:G.setUTCDate(G.getUTCDate()+1);break;case sap.ui.unified.CalendarIntervalType.OneMonth:if(this._iSize<2){var J=new Date(j.getTime());if(a.monthsDiffer(this.getStartDate(),j)){this.setStartDate(j);}this._setRowsStartDate(J);this._oOneMonthInterval.getAggregation('month')[0]._focusDate(b.fromLocalJSDate(J),true);}else if(a._isNextMonth(j,this.getStartDate())){this._oOneMonthInterval._handleNext();return;}G.setUTCDate(G.getUTCDate()+1);break;case sap.ui.unified.CalendarIntervalType.Month:G.setUTCMonth(G.getUTCMonth()+1);break;default:throw new Error("Unknown IntervalType: "+H+"; "+this);}G.setUTCMilliseconds(G.getUTCMilliseconds()-1);G=a._createLocalDate(G,true);this.fireIntervalSelect({startDate:j,endDate:G,subInterval:false,row:undefined});};f.prototype._buildPCRowDateRange=function(S){var R=new D();if(S.getStartDate()){R.setStartDate(new Date(S.getStartDate().getTime()));}if(S.getEndDate()){R.setEndDate(new Date(S.getEndDate().getTime()));}R.data(P.PC_FOREIGN_KEY_NAME,S.getId());return R;};function k(i){var S=i.getParameter("startDate");var K=this.getViewKey();var V=this._getView(K);var j=V.getIntervalType();if(j===sap.ui.unified.CalendarIntervalType.OneMonth&&a._isNextMonth(S,this.getStartDate())){this._oOneMonthInterval._handleNext();return;}var G=i.getParameter("endDate");var H=i.getParameter("subInterval");var R=i.oSource._oPlanningCalendarRow;this.fireIntervalSelect({startDate:S,endDate:G,subInterval:H,row:R});}f.prototype._applyContextualSettings=function(){return C.prototype._applyContextualSettings.call(this,{contextualWidth:this.$().width()});};function m(j,N){this._applyContextualSettings();if(j.size.width<=0){return;}var R=this.getRows();var G;var i=0;var O=this._iSize;r.call(this,j.size.width);if(O!=this._iSize){t.call(this,this._iSize);var K=this.getViewKey();var V=this._getView(K);var H=V.getIntervalType();var J=this._getIntervals(V);for(i=0;i<R.length;i++){G=R[i];var M=G.getCalendarRow();if(J!=M.getIntervals()){M.setIntervals(J);}else{M.handleResize();}}switch(H){case sap.ui.unified.CalendarIntervalType.Hour:if(this._oTimeInterval&&this._oTimeInterval.getItems()!=J){this._oTimeInterval.setItems(J);}break;case sap.ui.unified.CalendarIntervalType.Day:if(this._oDateInterval&&this._oDateInterval.getDays()!=J){this._oDateInterval.setDays(J);}break;case sap.ui.unified.CalendarIntervalType.Month:if(this._oMonthInterval&&this._oMonthInterval.getMonths()!=J){this._oMonthInterval.setMonths(J);}break;case sap.ui.unified.CalendarIntervalType.Week:if(this._oWeekInterval&&this._oWeekInterval.getDays()!=J){this._oWeekInterval.setDays(J);}break;case sap.ui.unified.CalendarIntervalType.OneMonth:if(this._oOneMonthInterval&&this._oOneMonthInterval.getDays()!=J){this._oOneMonthInterval.setDays(J);if(this._iSize>1){this._setRowsStartDate(new Date(this.getStartDate().getTime()));}}break;default:throw new Error("Unknown IntervalType: "+H+"; "+this);}z.call(this);}else if(!N){for(i=0;i<R.length;i++){G=R[i];G.getCalendarRow().handleResize();}}if(this._oOneMonthInterval){this._oOneMonthInterval._setDisplayMode(this._iSize);}}function n(G){var H=G.getParameter("appointment");var M=G.getParameter("multiSelect");var J=G.getParameter("appointments");if(!M){var R=this.getRows();for(var i=0;i<R.length;i++){var K=R[i];var N=K.getCalendarRow();if(G.oSource!=N){var O=K.getAppointments();for(var j=0;j<O.length;j++){var Q=O[j];Q.setSelected(false);}}}}this.fireAppointmentSelect({appointment:H,appointments:J,multiSelect:M});}f.prototype._setRowsStartDate=function(j){var R=this.getRows(),G,i;for(i=0;i<R.length;i++){G=R[i];G.getCalendarRow().setStartDate(j);}};f.prototype._toggleAppointmentsColumnPopinState=function(i){var T=this.getAggregation("table"),j=T.getColumns()[1];j.setDemandPopin(i);j.setMinScreenWidth(i?A:"");};function o(j){var G=[];var R=this.getRows();for(var i=0;i<R.length;i++){var H=R[i];var J=H.getColumnListItem();var S=J.getSelected();if(H.getSelected()!=S){H.setProperty("selected",S,true);G.push(H);}}if(!this.getSingleSelection()){y.call(this);}if(G.length>0){this.fireRowSelectionChange({rows:G});}}function p(){var T=this.getAggregation("table");if(this.getToolbarContent().length>0){if(!this._oToolbar){this._oToolbar=new sap.m.OverflowToolbar(this.getId()+"-Toolbar",{design:sap.m.ToolbarDesign.Transpaent});this._oToolbar._oPlanningCalendar=this;this._oToolbar.getContent=function(){return this._oPlanningCalendar.getToolbarContent();};}if(!T.getHeaderToolbar()){T.setHeaderToolbar(this._oToolbar);}}else if(T.getHeaderToolbar()){T.setHeaderToolbar();}this._oToolbar.invalidate();}function r(W){if(W<this._iBreakPointTablet){this._iSize=0;}else if(W<this._iBreakPointDesktop){this._iSize=1;}else{this._iSize=2;}if(q('html').hasClass("sapUiMedia-Std-Phone")){this._iSizeScreen=0;}else if(q('html').hasClass("sapUiMedia-Std-Tablet")){this._iSizeScreen=1;}else{this._iSizeScreen=2;}}function t(S){var j='sapMSize'+S,R=this.$(),i,G;if(R){for(i=0;i<3;i++){G='sapMSize'+i;if(G===j){R.addClass(G);}else{R.removeClass(G);}}}}function s(){var V=this.getViews();if(V.length==0){if(!this._aViews){this._aViews=[];var i=new sap.m.PlanningCalendarView(this.getId()+"-HourView",{key:sap.ui.unified.CalendarIntervalType.Hour,intervalType:sap.ui.unified.CalendarIntervalType.Hour,description:this._oRB.getText("PLANNINGCALENDAR_HOURS"),intervalsS:6,intervalsM:6,intervalsL:12});this._aViews.push(i);var j=new sap.m.PlanningCalendarView(this.getId()+"-DayView",{key:sap.ui.unified.CalendarIntervalType.Day,intervalType:sap.ui.unified.CalendarIntervalType.Day,description:this._oRB.getText("PLANNINGCALENDAR_DAYS"),intervalsS:7,intervalsM:7,intervalsL:14});this._aViews.push(j);var G=new sap.m.PlanningCalendarView(this.getId()+"-MonthView",{key:sap.ui.unified.CalendarIntervalType.Month,intervalType:sap.ui.unified.CalendarIntervalType.Month,description:this._oRB.getText("PLANNINGCALENDAR_MONTHS"),intervalsS:3,intervalsM:6,intervalsL:12});this._aViews.push(G);var H=new sap.m.PlanningCalendarView(this.getId()+"-WeekView",{key:sap.ui.unified.CalendarIntervalType.Week,intervalType:sap.ui.unified.CalendarIntervalType.Week,description:this._oRB.getText("PLANNINGCALENDAR_WEEK"),intervalsS:7,intervalsM:7,intervalsL:7});this._aViews.push(H);var J=new sap.m.PlanningCalendarView(this.getId()+"-OneMonthView",{key:sap.ui.unified.CalendarIntervalType.OneMonth,intervalType:sap.ui.unified.CalendarIntervalType.OneMonth,description:this._oRB.getText("PLANNINGCALENDAR_ONE_MONTH"),intervalsS:1,intervalsM:1,intervalsL:31});this._aViews.push(J);}V=this._aViews;}return V;}function v(){var V=s.call(this);var j=this._oIntervalTypeSelect.getItems();var i=0;var G;if(V.length<j.length){for(i=V.length;i<j.length;i++){G=j[i];this._oIntervalTypeSelect.removeItem(G);G.destroy();}}for(i=0;i<V.length;i++){var H=V[i];G=j[i];if(G){if(G.getKey()!=H.getKey()||G.getText()!=H.getDescription()){G.setKey(H.getKey());G.setText(H.getDescription());G.setTooltip(H.getTooltip());}}else{G=new sap.ui.core.Item(this.getId()+"-"+i,{key:H.getKey(),text:H.getDescription(),tooltip:H.getTooltip()});this._oIntervalTypeSelect.addItem(G);}}this._oIntervalTypeSelect.setVisible(!(V.length===1));}function w(i){var j=i.getParameter("selected");var R=this.getRows();if(j){R=this.getRows().filter(function(G){return!G.getSelected();});}this.selectAllRows(j);this.fireRowSelectionChange({rows:R});}function x(j){var G=j.oSource;var T=j.getParameter("type");var R=this.getRows();var H;var N;var J;var K;var i=0;var M=0;var O;for(i=0;i<R.length;i++){H=R[i];if(H.getCalendarRow()==G){M=i;break;}}switch(T){case"sapup":J=G.getFocusedAppointment();K=J.getStartDate();if(M>0){M--;}N=R[M];N.getCalendarRow().focusNearestAppointment(K);break;case"sapdown":J=G.getFocusedAppointment();K=J.getStartDate();if(M<R.length-1){M++;}N=R[M];N.getCalendarRow().focusNearestAppointment(K);break;case"saphome":if(M>0){N=R[0];O=new q.Event(T);O._bPlanningCalendar=true;N.getCalendarRow().onsaphome(O);}break;case"sapend":if(M<R.length-1){N=R[R.length-1];O=new q.Event(T);O._bPlanningCalendar=true;N.getCalendarRow().onsapend(O);}break;default:break;}}function y(){if(this._oSelectAllCheckBox){var R=this.getRows();var S=this.getSelectedRows();if(R.length==S.length&&S.length>0){this._oSelectAllCheckBox.setSelected(true);}else{this._oSelectAllCheckBox.setSelected(false);}}}function z(){if(this.getSingleSelection()){if(this._oCalendarHeader.getAllCheckBox()){this._oCalendarHeader.setAllCheckBox();}else if(this._oInfoToolbar.getContent().length>2){this._oInfoToolbar.removeContent(this._oSelectAllCheckBox);}}else{if(!this._oSelectAllCheckBox){this._oSelectAllCheckBox=new sap.m.CheckBox(this.getId()+"-All",{text:this._oRB.getText("COLUMNSPANEL_SELECT_ALL")});this._oSelectAllCheckBox.attachEvent("select",w,this);}if(this._iSizeScreen<2||!this.getShowRowHeaders()){var i=this._oInfoToolbar.indexOfContent(this._oSelectAllCheckBox);if(this._iSizeScreen<2){if(i<this._oInfoToolbar.getContent().length-1){this._oInfoToolbar.addContent(this._oSelectAllCheckBox);}}else if(i<0||i>1){if(i>1){this._oInfoToolbar.removeContent(this._oSelectAllCheckBox);}this._oInfoToolbar.insertContent(this._oSelectAllCheckBox,1);}}else{this._oCalendarHeader.setAllCheckBox(this._oSelectAllCheckBox);}}}function B(i){if(i.getParameter("name")=="selected"){y.call(this);}}function E(){var T=this.getAggregation("table");var M=T.getMode();var i;if(this.getSingleSelection()){if(!this.getShowRowHeaders()&&this.getRows().length==1){i=sap.m.ListMode.None;}else{i=sap.m.ListMode.SingleSelectMaster;}}else{i=sap.m.ListMode.MultiSelect;}if(M!=i){T.setMode(i);}}function F(){return this._oTimeInterval||this._oDateInterval||this._oMonthInterval||this._oWeekInterval||this._oOneMonthInterval;}return f;},true);
