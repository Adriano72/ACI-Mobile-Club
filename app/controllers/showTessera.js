var args = arguments[0] || {};

Ti.API.info("ARGS: " + JSON.stringify(args));

if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

var immagineTessera = require("utility").getTesseraImage(args["userInfo.categoriaTessera"]);

function doopen(evt) {
	if (OS_ANDROID) {

		$.win.activity.actionBar.hide();

	} else {
		//$.windowtitle.text = winTitle;
	}

	//updateScreen();
}

$.tessera.backgroundImage = immagineTessera;

Ti.API.info("TESSERA: " + immagineTessera);

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

$.titolare.text = args["userInfo.name"] + " " + args["userInfo.surname"];
$.numTessera.text = args["userInfo.numeroTessera"];


var pieces = args["userInfo.dataScadenza"].split('/');


//Ti.API.info("SPLITTED: "+pieces);
pieces.reverse();
var reversed = pieces.join('/');
//Ti.API.info("SPLITTED: "+reversed);

$.validita.text = "FINO AL " + reversed;


$.rotatedContainer.transform = Ti.UI.create2DMatrix().rotate(-90);

if (OS_ANDROID) {
	$.rotatedContainer.setBottom("20%");
	$.rotatedContainer.setLeft("40%");
} else {
	$.rotatedContainer.setBottom("29%");
	$.rotatedContainer.setLeft("25%");
}

var flag = false;

function checkSize(e) {

	e.cancelBubble = true;
	$.tessera.backgroundImage = immagineTessera;
	Ti.API.info("WIDTH: " + e.source.toImage().width);
	Ti.API.info("HEIGHT: " + e.source.toImage().height);

	var imgWidth = PixelsToDPUnits(e.source.toImage().width);
	var imgHeight = PixelsToDPUnits(e.source.toImage().height);

	Ti.API.info("WIDTH IN DP: " + $.titolare.height);

	if (flag == false) {
		flag = true;
		//$.titolare.bottom = (imgHeight * 0.0385) + 45;
		//$.titolare.left = (imgWidth * 0.771);

	};

}

function showSYC() {
	var winVantaggiSoci = Alloy.createController('VantaggiSociMain').getView();
	Alloy.Globals.navMenu.openWindow(winVantaggiSoci);

};

//$.tessera.transform = Ti.UI.create2DMatrix().rotate(-90);

function PixelsToDPUnits(ThePixels) {
	if (Titanium.Platform.displayCaps.dpi > 160) {
		if (Ti.Platform.displayCaps.density == 'high' && Ti.Platform.osname == 'iphone') {//retina iPhone
			return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160)) * 2;
		}
		return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160));
	} else {
		if (Ti.Platform.displayCaps.density == 'low') {
			return (ThePixels * (160 / Titanium.Platform.displayCaps.dpi));
		}
		return ThePixels;
	}
}

function DPUnitsToPixles(theDPs) {
	if (Titanium.Platform.displayCaps.dpi > 160) {
		if (Ti.Platform.displayCaps.density == 'high' && Ti.Platform.osname == 'iphone') {//retina iPhone
			return (theDPs * (Titanium.Platform.displayCaps.dpi / 160)) / 2;
		}
		return (theDPs * (Titanium.Platform.displayCaps.dpi / 160));
	} else {
		if (Ti.Platform.displayCaps.density == 'low') {
			return (theDPs / (160 / Titanium.Platform.displayCaps.dpi));
		}
		return theDPs;
	}
}