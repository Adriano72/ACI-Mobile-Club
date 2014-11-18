var args = arguments[0] || {};

var modelGot = args.data.attributes;


modelGot.formattedAddress = modelGot.address.formatted;
modelGot.telefono = modelGot.contacts.tel[0];
modelGot.fax = modelGot.contacts.fax[0];
modelGot.web = modelGot.contacts.web[0];



$.delegazione.set(modelGot);

Ti.API.info("MODELLO: "+JSON.stringify(args.data.attributes));

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
	abx.title = "Delegazioni";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = "#003772";
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}



