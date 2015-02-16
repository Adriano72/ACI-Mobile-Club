var args = arguments[0] || {};

var user = require('user');


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
	abx.title = "Scegli un'opzione";
	abx.titleFont = "ACI Type Regular.otf";
	abx.titleColor = Alloy.Globals.palette.blu;
	_.defer(init2);
}

function init2() {
	$.win.activity.invalidateOptionsMenu();
}



if (user.isLogged) {

    open('showTessera', user.getCurrentUser());
    _.defer(function() {
        Alloy.Globals.navMenu.closeWindow($.win);
    });
}



function accedi() {
    var w = open('loginWindow');
    //se torno indietro e mi sono loggato, non viglio vedere questa finestra
    w.addEventListener('close', function() {
        if (user.isLogged) {
            Alloy.Globals.navMenu.closeWindow($.win);
        }
    })
  
}


function registrati() {
    Ti.Platform.openURL(Alloy.CFG.Register_Url);
}

function associati() {

    open('Tessere_List');

}




function open(name, params) {
    var w = Alloy.createController(name, params).getView();
    Alloy.Globals.navMenu.openWindow(w);
    return w;
}