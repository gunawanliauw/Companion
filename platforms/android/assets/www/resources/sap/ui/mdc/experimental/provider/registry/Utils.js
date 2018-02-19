/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Control","sap/m/library"],function(C,l){"use strict";var I=l.InputType;return{convertToInputType:function(a){if(a.password){return I.Password;}else if(a.eMail){return I.Email;}else if(a.phoneNumber){return I.Tel;}else if(a.url){return I.Url;}else{var u=a.ui5Type;switch(u){case"sap.ui.model.odata.type.Int16":case"sap.ui.model.odata.type.Int32":case"sap.ui.model.odata.type.Int64":case"sap.ui.model.odata.type.Decimal":case"sap.ui.model.odata.type.Double":return I.Number;case"sap.ui.model.odata.type.TimeOfDay":return I.Time;case"sap.ui.model.odata.type.DateTime":case"sap.ui.model.odata.type.DateTimeBase":return I.DateTime;case"sap.ui.model.odata.type.DateTimeOffset":case"sap.ui.model.odata.type.Date":return I.Date;default:return I.Text;}}}};});
