var args = arguments[0] || {};

var net = require('network');
var user = require('user');

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
    abx.titleColor = Alloy.Globals.palette.blu;
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();
}


$.ricordami.getView().addEventListener('change', function(e) {

    Alloy.Globals.rememberMe = e.value;
    //Ti.API.info("Alloy.Globals.rememberMe: "+Alloy.Globals.rememberMe);
});

function doSignup() {
    console.log("Alloy.CFG.Register_Url", Alloy.CFG.Register_Url);
    Ti.Platform.openURL(Alloy.CFG.Register_Url); 
}


function doResetPwd() {
    console.log("Alloy.CFG.ResetPwd_Url", Alloy.CFG.ResetPwd_Url);
    Ti.Platform.openURL(Alloy.CFG.ResetPwd_Url); 
}
function doLogin() {

    //fix: faccio il trim
    var username = $.username.value.trim();
    var password = $.password.value.trim();

    console.log("u/p", username, password);

    if (username !== "" && password !== "") {

        Alloy.Globals.loading.show('Caricamento dati...', false);

        net.getSSOID(username, password, function(ssoid) {

            net.getUserInfo(ssoid, function(user_data) {

                //Ti.API.info("CHECKBOX VALUE "+$.ricordami.getView().value);

                /* cambio la gestione della login
				if ($.ricordami.getView().value) {
					
					Ti.App.Properties.setBool("utenteAutenticato", true);
					Ti.App.Properties.setObject("datiUtente", user_data.data);
					Ti.App.fireEvent("loggedInUser", {loggedUser:true});

				}; 
				*/

                //il modulo user.js gestisce la persistenza dei dati dell'utente
                user.onLogin(user_data.data, $.ricordami.getView().value);
                Ti.App.fireEvent("loggedInUser", {
                    loggedUser: true
                });

                Alloy.Globals.loading.hide();
                Ti.API.info("USER DATA: " + JSON.stringify(user_data));
                var winTessera = Alloy.createController('showTessera', user_data.data).getView();
                Alloy.Globals.navMenu.openWindow(winTessera);

                //questo hack serve per far si che, se premo back da winTessera, torno direttamente alla home page
                _.defer(function() {
                    Alloy.Globals.navMenu.closeWindow($.win);
                });

            });

        });
    } else {
        alert("Inserire nome utente e password!");
    }

}