var thisWin = $.index;
var winTitle = 'ACI Mobile Club';
var ViewScrollr = require("ViewScrollr");
//var menuTop = (OS_ANDROID)?PixelsToDPUnits((Titanium.Platform.displayCaps.platformHeight/2))-40:(Titanium.Platform.displayCaps.platformHeight/2)-15;
var menuTop = (OS_ANDROID)?Alloy.Globals.deviceHeightHalf-40:Alloy.Globals.deviceHeightHalf+10;
$.menuView.top = menuTop;

function doopen(evt) {
	if (OS_ANDROID) {
		var actionBarHelper = require('actionbarhelper')(thisWin);
		actionBarHelper.setTitle(winTitle);
	} else {
		$.windowtitle.text = winTitle;
	}
	//updateScreen();
}

var view1 = Ti.UI.createView({
	backgroundImage: "/images/banner1.png"
});

var view2 = Ti.UI.createView({
	backgroundImage: "/images/beach.jpg"
});

var view3 = Ti.UI.createView({
	backgroundImage: "/images/lizard.jpg"
});

var Banner = ViewScrollr.create({
    width: "98%",
	height: (OS_ANDROID)?"48.5%":"53%",
	top: 3,
    auto: true,
    delay: 3000,
    navigation : {
        selectedColor   : "#fff",
        color           : "#000",
        backgroundColor : "#fff"
    },
    panels : [
        { view : view1 },
        { view : view2 },
        { view : view3 }
    ]
});

function triggerScroll(){
	Ti.API.info("**** FIRE EVENT *****");
	if (OS_ANDROID) Ti.App.fireEvent('initialScrollHack');
}

$.index.add(Banner);





function swipeAction(e) {
	if (e.direction == "up") {
		$.menuView.animate({
			top: (OS_ANDROID)?0:45
		});
	}
	
	if (e.direction == "down") {
		$.menuView.animate({
			top: menuTop
		});
	}
	
};

$.index.open();
