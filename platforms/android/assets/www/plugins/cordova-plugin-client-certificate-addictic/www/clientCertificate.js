cordova.define("cordova-plugin-client-certificate-addictic.clientCertificate", function(require, exports, module) {
/*global cordova, module*/

module.exports = {
    register: function (certificatePath, certificatePassword, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "ClientCertificate", "register", [certificatePath, certificatePassword]);
    }
};
});
