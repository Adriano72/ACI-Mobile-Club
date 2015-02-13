var args = arguments[0] || {};

//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
if (OS_ANDROID) {
	var abx = require('com.alcoapps.actionbarextras');
};

function loadData() {
	//Alloy.Collections.automobileClub.fetch();
	if (OS_ANDROID) {
		
		init1();
		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}

}

function init1() {
	abx.displayHomeAsUp = true;
	abx.title = "Informativa sulla privacy";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = Alloy.Globals.palette.blu;
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}


Ti.App.addEventListener('openURL', function(e){
    Ti.Platform.openURL(e.url);
});