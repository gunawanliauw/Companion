jQuery.sap.declare("companion.js.index");
var app = {
	xmlHttpSaml: new XMLHttpRequest(),
    accessToken: '',
    respCookie: '',
    refreshToken: undefined,
    
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
	successHandler: function(data)
	{
		console.log("pushNotification.register Success: " + data);
	},
	errorHandler: function(errMsg)
	{
		console.log("pushNotification.register Error: " + errMsg);
	},
	tokenHandler: function(data)
	{
		console.log("pushNotification.register TokenHandler:  " + data);
	},
	onDeviceReady : function(){
		navigator.splashscreen.show();
		console.log("Device Ready");
		if (jQuery.device.is.phone) {
			app.registerCert();
			app.registerPush();
		}
	},
    
	registerPush: function(){
    	// register for push
		this.pushNotification = window.plugins.pushNotification;
		var pushNotification = this.pushNotification;
		var that = this;
		var device = jQuery.device;
		
		$("#app-status-ul").append('<li>registering ' + device.platform + '</li>');
		if ( device.is.android_phone){
		    pushNotification.register(
		    function(data){that.successHandler(data);},
		    function(data){that.errorHandler(data);},
		    {
		        "senderID":"930997916617",
		        "ecb":"app.onNotification"
		    });
		} else if ( device.is.iphone) {
		    pushNotification.register(
		    function(data){that.tokenHandler(data);},
		    function(data){that.errorHandler(data);},
		    {
		        "badge":"true",
		        "sound":"true",
		        "alert":"true",
		        "ecb":"app.onNotificationAPN"
		    });
		}
	},
	// Android and Amazon Fire OS 
	onNotification : function(e) {
	    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
	 
	    switch( e.event )
	    {
		    case 'registered':
		        if ( e.regid.length > 0 )
		        {
		            $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
		            // Your GCM push server needs to know the regID before it can push to this device 
		            // here is where you might want to send it the regID for later use. 
		            console.log("regID = " + e.regid);
		            //TODO Save RegID
		        }
		    break;
		 
		    case 'message':
		        // if this flag is set, this notification happened while we were in the foreground. 
		        // you might want to play a sound to get the user's attention, throw up a dialog, etc. 
		        if ( e.foreground )
		        {
		            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
		 
		            // on Android soundname is outside the payload. 
		            // On Amazon FireOS all custom attributes are contained within payload 
		            var soundfile = e.soundname || e.payload.sound;
		            // if the notification contains a soundname, play it. 
		            var my_media = new Media("/android_asset/www/"+ soundfile);
		            my_media.play();
		            alert(e.payload.message);
		        }
		        else
		        {  // otherwise we were launched because the user touched a notification in the notification tray. 
		            if ( e.coldstart )
		            {
		                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
		            }
		            else
		            {
		                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
		            }
		        }
		 
		       $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
		           //Only works for GCM 
		       $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
		       //Only works on Amazon Fire OS 
		       //$status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
		    break;
		 
		    case 'error':
		        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
		    break;
		 
		    default:
		        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
		    break;
		  }
	},
	// handle APNS notifications for iOS
    onNotificationAPN : function (e) {
    	var pushNotification = this.pushNotification;
		var that = this;
        if (e.alert) {
             $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
             // showing an alert also requires the org.apache.cordova.dialogs plugin
             navigator.notification.alert(e.alert);
        }
            
        if (e.sound) {
            // playing a sound also requires the org.apache.cordova.media plugin
            var snd = new Media(e.sound);
            snd.play();
        }
        
        if (e.badge) {
            pushNotification.setApplicationIconBadgeNumber(
			    function(data){that.successHandler(data);}, e.badge);
        }
    },
    
    createi18nModel: function(){
		return new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/i18n.properties"
		});
    },
    
    createDeviceModel: function(){
		var deviceModel = new sap.ui.model.json.JSONModel({
			isPhone : jQuery.device.is.phone,
			listMode : (jQuery.device.is.phone) ? "None" : "SingleSelectMaster",
			listItemType : (jQuery.device.is.phone) ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		return deviceModel;
    },
        /* Register Certificate for certificate authentication*/
    registerCert: function() {
       // debugger;
       // window.location.href = 'loginHome.html';
       // window.open("loginHome.html");
//        var successCB = this.regCertSuccess,
//           errorCB = this.regCertFailure;
//          clientCertificate.registerAuthenticationCertificate("certificate/cert.cer", "kpmg1234", $.proxy(successCB, this), $.proxy(errorCB, this));
//    
        
        
        //Added by Ajit for android:
        
        console.log("He please come here 2");
       // alert("He please come here 2");
       // alert("He please come here 3");
        //Added my Codes:::::
        // var cerAuthFlag  = false;
        var certAutomate = 'retainmobile.pfx';
        var certFolder = 'certificates/';
        //var authTokenService = this.oAuth2_getRefreshToken;
        var appDir = cordova.file.applicationDirectory + 'www/';
        //var datDir = cordova.file.dataDirectory;
        var datDir = cordova.file.externalApplicationStorageDirectory;
       //   alert("The Value of datDir "+datDir);
    	var certificateRegistred = function(message) {
    		console.log(message); 
            
         //   alert ("Please have a Talk");
            // cerAuthFlag =true;
          //   alert("Check the Flag:"+cerAuthFlag);
            //authTokenService;
            //app.oAuth2_getRefreshToken();
             // this.checkRefreshToken();
              app.checkRefreshToken();
        };
        var onFailure = function(message){
         //   alert("rror ajits:"+message);
            console.log('Error ajits: ', message);
        };
        var onSuccess = function(message){
         //   alert("Success ajit :"+message);
            console.log('Success ajit : ', message);
             var p12path1 = datDir.substring(7) + certFolder + certAutomate;
                        var p12path = cordova.file.externalApplicationStorageDirectory + certFolder + certAutomate;
                        var finalPath = p12path.replace("file://", "").trim();

                     //   alert("He please check the path of file jai 1"+p12path1);
                      //  alert("He please check the path of file jai 2"+finalPath);
                        //var p12pass = 'kpmgpwd1';
                          var p12pass = 'kpmgpwd1';
                        //var p12path1 = '/storage/emulated/0/Android/data/com.kpmg.globalTime/files/'+certAutomate;
                           clientCertificate.register(finalPath, p12pass, certificateRegistred, onFailure);
                          // window.HelloWorld.register(p12path, p12pass, onSuccess, onFailure);

        };
        var certAuthenticate = function() {
            // Full path to the cert
            var p12path1 = datDir.substring(7) + certFolder + certAutomate;
            var p12path = cordova.file.externalApplicationStorageDirectory + certFolder + certAutomate;
            var finalPath = p12path.replace("file://", "").trim();
        
         //   alert("He please check the path of file jai 1"+p12path1);
          //  alert("He please check the path of file jai 2"+finalPath);
            //var p12pass = 'kpmgpwd1';
              var p12pass = 'kpmgpwd1';
            //var p12path1 = '/storage/emulated/0/Android/data/com.kpmg.globalTime/files/'+certAutomate;
               clientCertificate.register(finalPath, p12pass, certificateRegistred, onFailure);
              // window.HelloWorld.register(p12path, p12pass, onSuccess, onFailure);
            
            
        };
        var copyCertificateAutomate = function(DirectoryEntry){
            //var path = cordova.file.applicationDirectory + "www/cert.p12";
      
          //  alert("The Value of Directory 2"+DirectoryEntry);
            window.resolveLocalFileSystemURL(appDir + certFolder + certAutomate, function(FileEntry){
            //    alert("The Value of FileEntry 1"+FileEntry);
                window.resolveLocalFileSystemURL(datDir + certFolder + certAutomate, certAuthenticate, function(){
                    // Copy the file to the r/w folder if not exists
                //    alert("The Value of Directory 3"+DirectoryEntry);
                    FileEntry.copyTo(DirectoryEntry, certAutomate, onSuccess, onFailure);
                });
            }, certAuthenticate);
        };
        window.resolveLocalFileSystemURL(datDir, function(DirectoryEntry){
            // Create certFolder if doesn't exists in a r/w location (dataDirectory)
        //    alert("The Value of Directory 1 "+DirectoryEntry);
            DirectoryEntry.getDirectory(certFolder, {create: true, exclusive: false}, copyCertificateAutomate, onFailure);
        }, onFailure);
      //  alert("come inside the Flag:"+cerAuthFlag);
    },
    regCertSuccess: function(){
       // alert("coming regCertSuccess method");
         this.checkRefreshToken();
    },
    regCertFailure: function(error){
        //TODO : See if we can provide a better way to show this message and also exit the app once user clicks ok.
      //  alert("Certificate evaluation failure:" + error);
    },
    /* End of Register Certificate flow */
    
    /* Check and read Refresh Token Flow */
    checkRefreshToken: function(){
      //  alert("coming checkRefreshToken method");
        var successCB = this.checkRefreshToken_succ ,
            errorCB = this.checkRefreshToken_error;
        var keyChain = new Keychain();
//        if(this.keyChain == undefined)
//        {
//            this.authCheck();
//        }
//        {
        keyChain.getForKey(jQuery.proxy(successCB,this),jQuery.proxy(errorCB,this),"refresh_token", "serviceName");
        //}
    },
    checkRefreshToken_succ: function(value){
     //   alert("coming checkRefreshToken_succ method" +value);
        this.refreshToken = value;
        this.authCheck();
    },
    checkRefreshToken_error: function(){
        this.refreshToken = undefined;
        this.authCheck();
    },
    /* End of Check and read Refresh Token Flow */

    /*Auth Check */
    authCheck: function(){
      //  alert("coming authCheck method");
        if (!this.refreshToken){
         //    alert("coming authCheck method if clause");
            this.oauthLogin();
        }
        else{
         //   alert("coming authCheck method else clause");
            this.oAuth2_getAccessToken();
        }
    },
    /*End Auth Check*/
    
    /*OAuth Login Begin*/
    oauthLogin: function(){
        
        navigator.splashscreen.hide();
       document.getElementById('loginmodal').style.visibility = 'visible';
        //TODO: show login screen 
        //this.oAuth2_getRefreshToken();
    },
    
    oAuth2Login_onOK: function(){
        //debugger;
        // get user id and password and set in 
        // this.userName and this.password
        this.oAuth2_getRefreshToken();
    },
        
    oAuth2_getRefreshToken: function(){
        
        //var userName= encodeURIComponent("kmusunuri");
        //var passWrd= encodeURIComponent("Password1");
        //document.getElementById('username').value
        
       
        
        var userName= encodeURIComponent(document.getElementById('username').value);
        var passWrd= encodeURIComponent(document.getElementById('pword').value);
        
      //   alert("please check :::::the userName "+userName);
      //  alert("please check :::::the passWrd "+passWrd);
       
        //For Dev
        
        //var oAuthAuthorizeEP = 'https://gsso.dev.kpmg.com/auth/oauth/v2/token';
        //For QA
      //   var oAuthAuthorizeEP = 'https://gsso.qa.kpmg.com/auth/oauth/v2/token';
        //For ASPAC
        //var oAuthAuthorizeEP = 'https://nwg20rqa.goqaazure1.kpmg.com/auth/oauth/v2/token' ;
        //For ASPAC STG
        var oAuthAuthorizeEP = 'https://gsso.aspac.kpmg.com/auth/oauth/v2/token';
        
        this.xmlHttpSaml = new XMLHttpRequest();
        this.xmlHttpSaml.open("POST",oAuthAuthorizeEP,true);
        this.xmlHttpSaml.onload= jQuery.proxy(this.oAuth2_getRefreshToken_Succ,this);
        this.xmlHttpSaml.addEventListener("progress", this.updateProgress);
        this.xmlHttpSaml.addEventListener("load", this.transferComplete);
        this.xmlHttpSaml.addEventListener("error", this.transferFailed);
        this.xmlHttpSaml.addEventListener("abort", this.transferCanceled);
        //For Dev
//        var postData = "client_id=" + encodeURIComponent("4b1544b4-0235-4250-ac2d-79b362a4c759") + 
//                       "&client_secret=" + encodeURIComponent("7a2c8b32-0e24-41b4-90ff-19ff9b93f6f3") + 
//                       "&username=" + userName +
//                       "&password=" + passWrd +
//                       "&grant_type=password&scope=scope_test";
        //For QA
//        var postData = "client_id=" + encodeURIComponent("e4e80746-f724-43b1-a893-5232ce8475c8") +
//        "&client_secret=" + encodeURIComponent("6a495fed-d976-4475-958e-c9ac07a7a461") +
//        "&username=" + userName +
//        "&password=" + passWrd +
//        "&grant_type=password&scope=QA240";
        // For aspac staging
        var postData = "client_id=" + encodeURIComponent("cd2a2dec-1fc6-4273-b1e0-8e43924c310d") +
        "&client_secret=" + encodeURIComponent("0c467f56-3cc5-4613-a87a-d94629180089") +
        "&username=" + userName +
        "&password=" + passWrd +
        "&grant_type=password&scope=fioriapps.stg.aspac.kpmg.com";
        
        //ASPAC PROD
        // var postData = "client_id=" + encodeURIComponent("771b72dd-aa05-4d02-afeb-a1bd6d57059e") +
        // "&client_secret=" + encodeURIComponent("29008934-983e-4868-bb5c-3c427afa1657") +
        // "&username=" + userName +
        // "&password=" + passWrd +
        // "&grant_type=password&scope=fioriapps.aspac.kpmg.com";
        // For ASPAC
//        var postData = "client_id=" + encodeURIComponent("e0cd1ef6-100f-4cce-94df-8e9513da8f4f") +
//        "&client_secret=" + encodeURIComponent("2dadf2e2-0c96-4888-a1fb-993709ca63d3") +
//        "&username=" + userName +
//        "&password=" + passWrd +
//        "&grant_type=password&scope=fiorappsaspac.qa.kpmg.com";
        
        // For EMA
//        var postData = "client_id=" + encodeURIComponent("349ae1b3-64b6-4cd9-9895-6cd139443b97") +
//        "&client_secret=" + encodeURIComponent("4860a602-d630-4147-b4a2-f68e0a9bafdc") +
//        "&username=" + userName +
//        "&password=" + passWrd +
//        "&grant_type=password&scope=fiorappsaema.qa.kpmg.com";

         this.xmlHttpSaml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
         this.xmlHttpSaml.send(postData);
    },
    oAuth2_getRefreshToken_Succ: function(response){
      //  alert("please check :::::the rspones"+response);
     //   alert("please check :::::the rspones 2"+this.xmlHttpSaml.responseText);
        if(this.xmlHttpSaml.status == 200){
            var response = JSON.parse(this.xmlHttpSaml.responseText);
            //AAded by Ajit
            var successCB = this.setRefreshToken_succ ,
            errorCB = this.setRefreshToken_error;
            this.accessToken = response.access_token;
            //var storage = window.localStorage;
            //Added by Ajit
            var keyChain =new Keychain();
			keyChain.setForKey(jQuery.proxy(successCB,this),jQuery.proxy(errorCB,this), "refresh_token", "serviceName", response.refresh_token);
        
           // storage.setItem("refresh_token",response.refresh_token);
            navigator.splashscreen.hide();
            this.l7LoginComplete();
        }else{
            oauthLogin();
            //Show login failed screen with response message.
        }
    },
    setRefreshToken_succ: function(){
        console.log('key set succeeded');
    },
    setRefreshToken_error: function(error){
    this.refreshToken = undefined;
     //   alert("Setting of Refresh Token is failed"+error);
    //this.authCheck();
    },
    l7LoginComplete: function(){
        this.loginToSAP();
    },
    oAuth2_getAccessToken: function(){
        var refresh_token = this.refreshToken;
        
        jQuery.oauth2_getAccess_token({
        //auth_url: 'https://gsso.dev.kpmg.com/auth/oauth/v2/authorize',           // required
      //  auth_url: 'https://gsso.qa.kpmg.com/auth/oauth/v2/authorize',        //FoR qa
       // auth_url: 'https://nwg20rqa.goqaazure1.kpmg.com/auth/oauth/v2/authorize', //ASPAC QA
        auth_url: 'https://gsso.aspac.kpmg.com/auth/oauth/v2/authorize', //ASPAC STAGING
                                      
        //  ioriappsaspac.qa.kpmg.com
        response_type: 'code',      // required - "code"/"token"
        //token_url: 'https://gsso.dev.kpmg.com/auth/oauth/v2/token',          // required if response_type = 'code'
       // token_url: 'https://gsso.qa.kpmg.com/auth/oauth/v2/token',    //For QA
        //token_url: 'https://fioriapps.qa.kpmg.com/auth/oauth/v2/token', //For ASPAC
        token_url: 'https://gsso.aspac.kpmg.com/auth/oauth/v2/token',   //For ASPAC STAGING
        logout_url: '',         // recommended if available
        //client_id: '4b1544b4-0235-4250-ac2d-79b362a4c759',          // required
        //client_id: 'e4e80746-f724-43b1-a893-5232ce8475c8',         //For QA
      //  client_id: 'e0cd1ef6-100f-4cce-94df-8e9513da8f4f',  //For ASPAC
        client_id: 'cd2a2dec-1fc6-4273-b1e0-8e43924c310d',         //For aspac staging
        // client_id: '771b72dd-aa05-4d02-afeb-a1bd6d57059e',         //For aspac Production
       // client_id: '349ae1b3-64b6-4cd9-9895-6cd139443b97',  //For EMA QA
       // client_secret: '7a2c8b32-0e24-41b4-90ff-19ff9b93f6f3',      // required if response_type = 'code'
       //client_secret: '6a495fed-d976-4475-958e-c9ac07a7a461',    //For QA
      // client_secret:'2dadf2e2-0c96-4888-a1fb-993709ca63d3', //for ASPAC
      client_secret: '0c467f56-3cc5-4613-a87a-d94629180089',    //For aspac STAGING
      //client_secret: '29008934-983e-4868-bb5c-3c427afa1657',    //For aspac Production
        //client_secret:'4860a602-d630-4147-b4a2-f68e0a9bafdc', //for EMA QA
        redirect_uri: 'http://localhost:55483/Home/Exchange',       // required - some dummy url
        //redirect_uri: 'http://localhost:55483/Home/Exchange',
        refresh_token: refresh_token,
       // other_params: {scope: "scope_test"}        // optional params object for scope, state, display...
       // other_params: {scope: "QA240"}      //For QA
    //    other_params: {scope: "fioriappsaspac.qa.kpmg.com"}    //For ASPAC
        //other_params: {scope: "fiorappsaema.qa.kpmg.com"}    //For EMA
        other_params: {scope: "fioriapps.stg.aspac.kpmg.com"}      //For aspac STAGING
        // other_params: {scope: "fioriapps.aspac.kpmg.com"}      //For aspac Production
        }, $.proxy(this.oAuth2_getAccessToken_Succ,this), $.proxy(this.oAuth2_getAccessToken_Error,this));
        
        
        
//        access_token: "61c52259-b7de-4d54-a527-3f1623f0cf42", token_type: "Bearer", expires_in: 300, refresh_token: "8eece2da-8f7a-4876-94f7-1f2abb9c57dd", scope: "scope_test"} = $2

    },
        
    oAuth2_getAccessToken_Succ: function(token, response){
            //ToDo: save refresh_token  // No need to wait to complete the save before proceeding. If save fails only show info message to user
            //var storage = window.localStorage;
            //storage.setItem("refresh_token",response.refresh_token);
            this.refreshToken = response.refresh_token;
            this.accessToken = response.access_token;
            navigator.splashscreen.hide();
            app.l7LoginComplete();
    },
    oAuth2_getAccessToken_Error: function(error, response){

        console.log("Error : " + error);
        console.log("Response :" + response);
        //ToDo: clear refresh_token again // No need to wait to complete the save before proceeding. If save fails only show info message to user
        var successCB = this.removeRefreshToken_succ ,
        errorCB = this.removeRefreshToken_error;
        var keyChain =new Keychain();
        keyChain.removeForKey(jQuery.proxy(successCB,this),jQuery.proxy(errorCB,this),"refresh_token", "serviceName");
        //var storage = window.localStorage;
        //storage.removeItem("refresh_token");
        
        this.refreshToken = undefined;
        this.accessToken = undefined;
        this.oauthLogin();
    },
    
	removeRefreshToken_succ: function(){
	    console.log('key removed successfully');
	},
	removeRefreshToken_error: function(error){
	    //this.refreshToken = undefined;
	  //  alert("removing of Refresh Token is failed"+error);
	    //this.authCheck();
	},
    /*End OAuth Login*/
        
    /*Login to SAP*/
    loginToSAP: function(){
  //var serviceUrl = "https://fiorimobileapps.dev.kpmg.com/sap/opu/odata/kgo/HCM_TIME_MAN_SRV/$metadata?sap-client=340";
        //var serviceUrl = "https://fiorimobileapps.dev.kpmg.com/sap/opu/odata/kgo/exp_paoc_trv_srv/$metadata?sap-client=340";
        debugger;
        //For QA
    //  var serviceUrl = "https://fioriappsaspac.qa.kpmg.com/sap/opu/odata/kgo/HCM_TIME_MAN_SRV/$metadata?sap-client=350";
     // var serviceUrl = "https://fioriappsema.qa.kpmg.com/sap/opu/odata/kgo/HCM_TIME_MAN_SRV/$metadata?sap-client=360";
        
     //var serviceUrl = "https://fioriapps.qa.kpmg.com/sap/opu/odata/kgo/exp_paoc_trv_srv/$metadata?sap-client=240";
       //ASPAC STAGING
        var serviceUrl = "https://fioriapps.stg.aspac.kpmg.com/sap/opu/odata/kgo/HCM_TIME_MAN_SRV/$metadata?sap-client=440";
        //ASPAC Production
     //var serviceUrl = "https://fioriapps.aspac.kpmg.com/sap/opu/odata/kgo/HCM_TIME_MAN_SRV/$metadata?sap-client=440";
        
        //For ASPAC
       // var serviceUrl = "https://fioriapps.qa.kpmg.com/sap/opu/odata/kgo/exp_paoc_trv_srv/$metadata?sap-client=240";        //this.xmlHttpSaml.onreadystatechange = this.readyStateCallBack;
        //this.xmlHttpSaml.open()
        this.xmlHttpSaml.open("GET",serviceUrl,true);
        this.xmlHttpSaml.onload = jQuery.proxy(this.loginToSAP_Success,this);
        this.xmlHttpSaml.setRequestHeader("authorization", "Bearer " + this.accessToken);
        this.xmlHttpSaml.setRequestHeader("x-kpmg-devicetype","mobile");
        //this.xmlHttpSaml.setRequestHeader("authorization", "Bearer " + this.accessToken);
        this.xmlHttpSaml.addEventListener("progress", this.updateProgress);
        this.xmlHttpSaml.addEventListener("load", this.transferComplete);
        this.xmlHttpSaml.addEventListener("error", this.transferFailed);
        this.xmlHttpSaml.addEventListener("abort", this.transferCanceled);
        this.xmlHttpSaml.send();
        
    },

    loginToSAP_Success: function(response){
        if ( this.xmlHttpSaml.status >= 200 && this.xmlHttpSaml.status < 300){
            //Login to SAP is successful now we can initialize the application and release...
            initXHRSendOverwrite();
            initializeUI5app(); 
        }
        else{
            // Login to SAP Failed .. need to report an error, clear the refreshToken from the app and the local storage abd keep the use on the login screen.   
        }
    },    
    /*End login to SAP*/    
        
    /*XHR general methods */
        
    readyStateCallBack: function(){
        console.log("readyStateCallBack");
    },
    updateProgress: function(e){
        console.log("updateProgress");
    },
    transferComplete: function(e){
        console.log("transferComplete");
    },
    transferFailed: function(e){
        console.log("transferFailed");
    },
    transferCanceled: function(e){
        console.log("transferCanceled");
    }
};

// app.initialize();

//var keyChain = new Keychain();
/* Additional custom Functions */

function initializeUI5app(){
    startApp();
   // 			sap.ui.getCore().attachInit(function () {
			// 	sap.ui.require([
			// 					"sap/m/Shell",
			// 					"sap/ui/core/ComponentContainer"
			// 					],
							   
			// 		function (Shell, ComponentContainer) {
			// 			//mockserver.init();
			// 			new Shell({
			// 						app: new ComponentContainer({
			// 								name: "hcm.mytimesheet",
			// 								height: "100%"
			// 							})
			// 				}).placeAt("content");
			// 		});
			// });
}

/*(function() {
    var origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(arguments) {
        if(app.accessToken){
        //this.setRequestHeader("access_token", app.accessToken)
            this.setRequestHeader("authorization", "Bearer " + app.accessToken);
        }
        origSend.call(this, arguments);e
    };
})();*/

function initXHRSendOverwrite() {
    var origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(arguments) {
        if(app.accessToken){
        //this.setRequestHeader("access_token", app.accessToken)
            this.setRequestHeader("authorization", "Bearer " + app.accessToken);
            this.setRequestHeader("x-kpmg-devicetype","mobile");

        }
        /*if(app.respCookie){
            this.setRequestHeader("Cookie",app.respCookie);
        }*/
        origSend.call(this, arguments);
    };
}