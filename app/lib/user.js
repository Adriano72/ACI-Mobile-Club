/**
 * Raccolta di metodi per gestire gli utenti
 */




/**
 * Azioni da intraprendere quando un utente si logga
 * @param  {object} userData dati dell'utente
 * @param  {boolean} remember se devo ricordare il login al prossimo avvio dell'app
 */
exports.onLogin = function(userData, remember) {
    Ti.App.Properties.setObject("utenteLastLogin", new Date());
    Ti.App.Properties.setBool("utenteRemeberMe", remember);
    Ti.App.Properties.setBool("utenteAutenticato", true);
    Ti.App.Properties.setObject("datiUtente", userData);
};

/**
 * Azioni da intraprendere quando un utente esce
 * [onLogout description]
 */
exports.onLogout = function() {
    Ti.App.Properties.setObject("utenteLastLogin", undefined);
    Ti.App.Properties.setBool("utenteRemeberMe", false);
    Ti.App.Properties.setBool("utenteAutenticato", false);
    Ti.App.Properties.setObject("datiUtente", undefined);
    Ti.App.Properties.setObject("utenteCredenziali", undefined);

};

/**
 * Property
 * Ci dice se l'utente è loggato o meno
 * @return {Boolean}
 */
Object.defineProperty(exports, 'isLogged', {
    get: function() {
        return Ti.App.Properties.getBool("utenteAutenticato");
    }
});


/**
 * Property
 * Ci dice se l'utente è loggato o meno
 * @return {Boolean}
 */
Object.defineProperty(exports, 'hasTessera', {
    get: function() {
        var data = exports.getCurrentUser();
        return Boolean(data['userInfo.tessera']);
    }
});


/**
 * Ritorna i dati dell'utente attuale, se presente
 * @return {object} hash set con i dati utente
 */
exports.getCurrentUser = function() {

    var u;

    if (exports.isLogged) {
        try {
            u = Ti.App.Properties.getObject("datiUtente");
        } catch (err) {
            Ti.API.error('user.getCurrentUser');
        }
    }
    return u;
};



//qui gestisco il logout
// essendo i moduli dei singleton in titanium, al primo accesso 
// se remember=false -> logout
if (!Ti.App.Properties.getBool("utenteRemeberMe")) {
    console.log("lib/user.js LOGOUT UTENTE ALL'AVVIO");
    exports.onLogout();
}



exports.doLogin = function(username, password, rememberMe, cb) {
    var net = require('network');

    net.getSSOID(username, password, function(ssoid) {

        net.getUserInfo(ssoid, function(user_data) {

            //porcata: mi salvo le credenziali per replicare il login in automatico
            Ti.App.Properties.setObject("utenteCredenziali", [username, password, rememberMe]);


            //il modulo user.js gestisce la persistenza dei dati dell'utente
            exports.onLogin(user_data.data, rememberMe);
            Ti.App.fireEvent("loggedInUser", {
                loggedUser: true
            });


            cb && cb(null, user_data);


        });

    });
};

exports.refreshData = function(cb) {

    try {
        var credentials = Ti.App.Properties.getObject("utenteCredenziali");
        var lastLogin = Ti.App.Properties.getObject("utenteLastLogin");
        if (OS_ANDROID) lastLogin = new Date(lastLogin);
    } catch (e) {
        var credentials = undefined;
        var lastLogin = undefined;
    }
    var now = new Date();

    console.log('credentials', credentials);

    if (Ti.Network.networkType != Ti.Network.NETWORK_NONE && credentials && lastLogin && now.getDate() != lastLogin.getDate()) {
        //if (Ti.Network.networkType != Ti.Network.NETWORK_NONE, credentials && lastLogin ){
        //alert('refresh!');
        exports.doLogin.apply(this, credentials, true, cb);
    }

};