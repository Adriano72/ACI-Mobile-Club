var ViewScrollr = require("ViewScrollr");
if (OS_ANDROID)
	var abx = require('com.alcoapps.actionbarextras');
//var menuTop = (OS_ANDROID)?PixelsToDPUnits((Titanium.Platform.displayCaps.platformHeight/2))-40:(Titanium.Platform.displayCaps.platformHeight/2)-15;
var menuTop = (OS_ANDROID) ? Alloy.Globals.deviceHeightHalf - 40 : Alloy.Globals.deviceHeightHalf - 30;
$.menuView.top = menuTop;

function doopen(evt) {
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

function openPuntiACI() {
	var winPAci = Alloy.createController('PuntiAciMain').getView();
	$.navWin.openWindow(winPAci);
	Alloy.Globals.navMenu = $.navWin;
}

function openVantaggiSoci() {
	var winVantaggiSoci = Alloy.createController('VantaggiSociMain').getView();
	$.navWin.openWindow(winVantaggiSoci);
	Alloy.Globals.navMenu = $.navWin;
}

$.navWin.open();

