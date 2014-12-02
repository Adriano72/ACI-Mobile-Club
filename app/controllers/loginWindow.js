var args = arguments[0] || {};

var net = require('network');

if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function doopen(evt) {
	if (OS_ANDROID) {

		init1();

	} else {
		//$.windowtitle.text = winTitle;
	}

	//updateScreen();
}

function init1() {
	abx.displayHomeAsUp = true;
	abx.title = "La tua tessera";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = "#003772";
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}


$.ricordami.getView().addEventListener('change', function(e) {
	
	Alloy.Globals.rememberMe = e.value;
	//Ti.API.info("Alloy.Globals.rememberMe: "+Alloy.Globals.rememberMe);
});

function doLogin() {

	if ($.username.value !== "" && $.password.value !== "") {
		
		Alloy.Globals.loading.show('Caricamento dati...', false);

		net.getSSOID($.username.value, $.password.value, function(ssoid) {

			net.getUserInfo(ssoid, function(user_data) {
				
				//Ti.API.info("CHECKBOX VALUE "+$.ricordami.getView().value);
				
				if ($.ricordami.getView().value) {
					
					Ti.App.Properties.setBool("utenteAutenticato", true);
					Ti.App.Properties.setObject("datiUtente", user_data.data);
					Ti.App.fireEvent("loggedInUser", {loggedUser:true});

				};
				Alloy.Globals.loading.hide();
				Ti.API.info("USER DATA: " + JSON.stringify(user_data));
				var winTessera = Alloy.createController('showTessera', user_data.data).getView();
				Alloy.Globals.navMenu.openWindow(winTessera);

			});

		});
	} else {
		alert("Inserire nome utente e password!");
	}

}

