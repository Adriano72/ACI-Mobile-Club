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
    var rememberMe = $.ricordami.getView().value;

    console.log("u/p", username, password);

    if (username !== "" && password !== "") {

        Alloy.Globals.loading.show('Caricamento dati...', false);

        user.doLogin(username, password, rememberMe, function(err, user_data) {
            require('network').registerForPush();
            Alloy.Globals.loading.hide();

            if (!err) {

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

            } else {
                alert('Errore durante il login');
            }

        });



    } else {
        alert("Inserire nome utente e password!");
    }

}