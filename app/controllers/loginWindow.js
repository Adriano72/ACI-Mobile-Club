var args = arguments[0] || {};

var net = require('network');
var user = require('user');
var commons = require('commons');


commons.initWindow($.win, "La tua tessera", "/images/ic_action_home_tessera_blu.png");




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

                var w;

                if (user_data.data['userInfo.tessera']) {
                    w = Alloy.createController('showTessera', user_data.data).getView();
                } else {
                     w = Alloy.createController('userOptions').getView();

                }

                Alloy.Globals.navMenu.openWindow(w);

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