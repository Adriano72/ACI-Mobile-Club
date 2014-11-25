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

function doLogin(){
	Ti.API.info("CIAO");
	if($.username.value !== "" && $.password.value !== ""){
		Ti.API.info("CIAO");
		net.getSSOID($.username.value, $.password.value);
	}else{
		alert("Inserire nome utente e password!");
	}
}

