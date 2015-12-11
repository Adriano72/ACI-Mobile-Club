/**
 * @author Antonio Polifemi
 */


var tiACI = require('ti.aci');
var commons = require('commons');
var navigation = require('navigation');



function onActivityOpen() {
	var aciPoint = require('puntiAci');
	aciPoint.getPoint({
		downloadInformation : function() {
			Alloy.Globals.loading.show(L('poi_loading'), false);
		},
		success : function(point) {
			var Alloy = require('alloy');
			for (var p in point) {
				$.aciPointScrool.add(Alloy.createController('viewPointService', point[p]).getView());
			}
			Alloy.Globals.loading.hide();
		},
		error : function(e) {
			Alloy.Globals.loading.hide();
			Titanium.UI.createNotification({
				duration : Titanium.UI.NOTIFICATION_DURATION_LONG,
				message : L("rete_alert")
			}).show();
		},
		serviceError : function() {
			Alloy.Globals.loading.hide();
			Titanium.UI.createNotification({
				duration : Titanium.UI.NOTIFICATION_DURATION_LONG,
				message : L("servicegps_alert")
			}).show();
		},
		getLocation : function() {
			Alloy.Globals.loading.show(L('getlocation_loading'), false);
		},
		locationError : function() {
			Alloy.Globals.loading.hide();
			Titanium.UI.createNotification({
				duration : Titanium.UI.NOTIFICATION_DURATION_LONG,
				message : L("loaction_alert")
			}).show();
		}
	}, Alloy.Globals.user.getUser().authToken);
}
function onArrowClick(){
	$.listPointService.close();
}


(function constructor(args){
    commons.initWindow($.win, L("intro_cardetail_text"), null, []);
    
  
})(arguments[0] || {});
