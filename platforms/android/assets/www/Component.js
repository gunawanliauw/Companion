jQuery.sap.declare("companion.Component");
jQuery.sap.require("companion.js.index");
sap.ui.core.UIComponent.extend("companion.Component", {
	createContent : function() {
		// create root view
		console.log("createContent");
		var App = new sap.m.App({initialPage:"idApp"});
		var page = sap.ui.view({
			id : "idApp",
			viewName : "companion.view.App",
			type : "XML",
			viewData : { component : this },
			dependencies : {
				libs : [
					// "sap.ui.table",
					"sap.m"
				]
			}
		});

		// set i18n model
		page.setModel(app.createi18nModel(), "i18n");

//		// Using OData model to connect against a real service
//		var url = "/proxy/http/<server>:<port>/sap/opu/odata/sap/ZGWSAMPLE_SRV/";
//		var oModel = new sap.ui.model.odata.ODataModel(url, true, "<user>", "<password>");
//		oView.setModel(oModel);

		// Using a local model for offline development
//		var oModel = new sap.ui.model.json.JSONModel("model/mock_cn.json");
//		oView.setModel(oModel);

		// set device model
		page.setModel(app.createDeviceModel(), "device");
		App.addPage(page);
		// document.addEventListener("deviceready", app.onDeviceReady(), true);
		// done
		return App;
	}
});