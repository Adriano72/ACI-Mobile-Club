var ViewScrollr = require("ViewScrollr");
var settingsMenu = require('settingsMenu');

if (OS_ANDROID)
	var abx = require('com.alcoapps.actionbarextras');
//var menuTop = (OS_ANDROID)?PixelsToDPUnits((Titanium.Platform.displayCaps.platformHeight/2))-40:(Titanium.Platform.displayCaps.platformHeight/2)-15;
var menuTop = (OS_ANDROID) ? Alloy.Globals.deviceHeightHalf - 40 : Alloy.Globals.deviceHeightHalf - 30;
$.menuView.top = menuTop;

function doopen(evt) {

	Alloy.Globals.navMenu = $.navWin;
	if (OS_ANDROID) {
		abx.title = "ACI Mobile Club";
		abx.titleFont = "ACI Type Regular.otf";
		abx.titleColor = "#4A678C";

		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}
	//updateScreen();
}

var view1 = Ti.UI.createView({
	backgroundImage : "/images/banner1.png"
});

var view2 = Ti.UI.createView({
	backgroundImage : "/images/beach.jpg"
});

var view3 = Ti.UI.createView({
	backgroundImage : "/images/lizard.jpg"
});

var Banner = ViewScrollr.create({
	width : "98%",
	height : (OS_ANDROID) ? "48.5%" : "50%",
	top : (OS_ANDROID) ? 3 : 2,
	auto : true,
	delay : 3000,
	navigation : {
		selectedColor : "#fff",
		color : "#000",
		backgroundColor : "#fff"
	},
	panels : [{
		view : view1
	}, {
		view : view2
	}, {
		view : view3
	}]
});

var scrollHack = _.once(triggerScroll);

function triggerScroll() {
	//Ti.API.info("**** FIRE EVENT *****");
	if (OS_ANDROID) {
		Ti.App.fireEvent('initialScrollHack');
	};
}

$.index.add(Banner);

function closeSideMenu() {
	settingsMenu.hideMenu(rightSettingsMenu);
}

var rightSettingsMenu = settingsMenu.openSideMenu();

$.index.add(rightSettingsMenu);

function toggleSideMenu() {

	settingsMenu.toggleMenu(rightSettingsMenu);
}

function tessera() {

	if (Ti.App.Properties.getBool("utenteAutenticato")) {
		
		var winTessera = Alloy.createController('showTessera', Ti.App.Properties.getObject("datiUtente")).getView();
		Alloy.Globals.navMenu.openWindow(winTessera);
		
	} else {
		
		var winLogin = Alloy.createController('loginWindow').getView();
		Alloy.Globals.navMenu.openWindow(winLogin);
		
	}

	require("utility").getTesseraImage();

}

function swipeAction(e) {// NON USATA AL MOMENTO
	if (e.direction == "up") {
		$.menuView.animate({
			top : (OS_ANDROID) ? 0 : 45
		});
	}

	if (e.direction == "down") {
		$.menuView.animate({
			top : menuTop
		});
	}

};

function doPhoneCall(e) {
	e.cancelBubble = true;
	Titanium.Platform.openURL('tel:803116');
};

function openPuntiACI() {
	var winPAci = Alloy.createController('PuntiAciMain').getView();
	Alloy.Globals.navMenu.openWindow(winPAci);

}

function openVantaggiSoci() {
	var winVantaggiSoci = Alloy.createController('VantaggiSociMain').getView();
	Alloy.Globals.navMenu.openWindow(winVantaggiSoci);

}

$.navWin.open();

