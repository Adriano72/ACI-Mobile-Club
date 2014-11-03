var thisWin = $.index;
var winTitle = 'ACI Mobile Club';
//var menuTop = (OS_ANDROID)?PixelsToDPUnits((Titanium.Platform.displayCaps.platformHeight/2))-40:(Titanium.Platform.displayCaps.platformHeight/2)-15;
var menuTop = Alloy.Globals.deviceHeightHalf+10;
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

var ar = $.scrollableView.getViews();
var t = 0;

setInterval(function(e) {
	if (t >= ar.length) {
		t = 0;
	}
	$.scrollableView.scrollToView(t);
	t++;

}, 3000);

function swipeAction(e) {
	if (e.direction == "up") {
		$.menuView.animate({
			top: 45
		});
	}
	
	if (e.direction == "down") {
		$.menuView.animate({
			top: menuTop
		});
	}
	
};

$.index.open();
