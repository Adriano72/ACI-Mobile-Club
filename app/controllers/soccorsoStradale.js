var args = arguments[0] || {};

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
	abx.title = "Soccorso Stradale";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = "#003772";
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}

function chiamaSoccorso(){
	Titanium.Platform.openURL('tel:803116');
}


