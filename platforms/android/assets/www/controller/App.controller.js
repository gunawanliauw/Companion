sap.ui.controller("companion.controller.App", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf companion.view.App
	 */
	onInit: function() {
		sap.ui.getCore().sService = "https://fioriapps.stg.aspac.kpmg.com/sap/opu/odata/kgo/HCM_TIME_MAN_SRV/";
	},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf companion.view.App
	 */
	//	onBeforeRendering: function() {
	//
	//	},
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf companion.view.App
	 */
	//	onAfterRendering: function() {
	//
	//	},
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf companion.view.App
	 */
	//	onExit: function() {
	//
	//	}
	handleDashboard: function(oEvt) {
		console.log("Dashboard pressed");
	},
	handleCEAC: function(oEvt) {
		console.log("CEAC pressed");
	},
	handleSearch: function(oEvt) {
		console.log("Search pressed");
	},
	handleExpense: function(oEvt) {
		console.log("Expense pressed");
		window.plugins.launcher.canLaunch({
			packageName: "com.kpmg.ibs20.aspac.stg.expense"
		}, function(data) {
			window.plugins.launcher.launch({
				packageName: "com.kpmg.ibs20.aspac.stg.expense"
			}, function(data) {
				console.log("Success!");
			}, function(errMsg) {
				console.log("Error! " + errMsg);
			});
		}, function(errMsg) {
			console.log("Error! " + errMsg);
			alert("No Expense App installed.");
		});
	},
	handleTimesheet: function(oEvt) {
		console.log("Timesheet pressed");
		window.plugins.launcher.canLaunch({
			packageName: "com.kpmg.ibs20.aspac.stg.time"
		}, function(data) {
			window.plugins.launcher.launch({
				packageName: "com.kpmg.ibs20.aspac.stg.time"
			}, function(data) {
				console.log("Success!");
			}, function(errMsg) {
				console.log("Error! " + errMsg);
			});
		}, function(errMsg) {
			console.log("Error! " + errMsg);
			alert("No Timesheet App installed.");
		});
	},
	/**
	 *@memberOf companion.controller.App
	 */
	handleCall: function() {
		console.log("Call pressed");
		//This code was generated by the layout editor.
		sap.m.URLHelper.triggerTel( "18001234" );
	},
	/**
	 *@memberOf companion.controller.App
	 */
	handeEmail: function() {
		console.log("Email pressed");
		//This code was generated by the layout editor.
		sap.m.URLHelper.triggerEmail( "support@ibs.companion.com", "Support Required", "Hi IBS Companion Support,\n", null, null );
	}
});