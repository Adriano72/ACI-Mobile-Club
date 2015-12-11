var user = require("user");

function validateAccess() {
	Alloy.Globals.loading.show(L('login_loading'), false);
	user.login($.textUser.value.trim(), $.textPass.value.trim(), $.switchRemenber.value, {
		error : function(e) {// e contiene il codice di stato
			Alloy.Globals.loading.hide();
			Ti.API.info("aaa " + JSON.stringify(e));
			if (e.resultCode == 500) {// utente non autorizzato
				var dialog = Titanium.UI.createAlertDialog({
					message : L("login_alert"),
					buttonNames : ["OK"]
				});
				dialog.addEventListener('click', function() {
					onArrowClick();
				});
				dialog.addEventListener('androidback', function() {
					onArrowClick();
				});
				dialog.show();
			} else {// qualsiasi altro errore
				var dialog = Titanium.UI.createAlertDialog({
					message : L("rete_alert"),
					buttonNames : ["OK"]
				});
				dialog.addEventListener('click', function() {
					onArrowClick();
				});
				dialog.addEventListener('androidback', function() {
					onArrowClick();
				});
				dialog.show();
			}
		},
		success : function() {// login corretta
			var Alloy = require('alloy');
			Alloy.Globals.loading.hide();
			Alloy.createController('listCar').getView().open();
			$.index.close();
		}
	});
}// validateAccess

function loadPreference() {
	var preference = user.getUserCredentials();
	if (preference.value) {
		$.textUser.value = preference.username;
		$.textPass.value = preference.password;
		$.switchRemenber.value = true;
	}
}// loadPreference


$.index.open();
