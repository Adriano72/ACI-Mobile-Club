/**
 * Raccolta di metodi per gestire gli utenti
 */

var tiACI = require('ti.aci');


//inizializzo il modulo SSO passando l'endpoint SSO dell'ambiente corretto
tiACI.Services.SSO.setConfig({
    'base_url': Alloy.CFG.SSO_baseurl,
    'profilo': Alloy.CFG.SSO_profilo,
    'keypass': Alloy.CFG.SSO_keypass,
});



var authToken;


//
// ## PUBLIC API
//


/**
 * ### onLogin
 * Azioni da intraprendere quando un utente si logga
 * @param  {object} userData dati dell'utente
 * @param  {boolean} remember se devo ricordare il login al prossimo avvio dell'app
 */
exports.onLogin = function(userData, remember) {
    Ti.App.Properties.setObject("utenteLastLogin", new Date());
    //Ti.App.Properties.setBool("utenteRemeberMe", remember);
    exports.rememberMe = remember;
    Ti.App.Properties.setBool("utenteAutenticato", true);
    Ti.App.Properties.setObject("datiUtente", userData);

    console.log('utente', userData);
};

/**
 * ### onLogin
 * Azioni da intraprendere quando un utente esce
 * [onLogout description]
 */
exports.onLogout = function() {
    Ti.App.Properties.setObject("utenteLastLogin", undefined);
    // Ti.App.Properties.setBool("utenteRemeberMe", false);
    exports.rememberMe = false;
    Ti.App.Properties.setBool("utenteAutenticato", false);
    Ti.App.Properties.setObject("datiUtente", undefined);
    Ti.App.Properties.setObject("utenteCredenziali", undefined);

};

/**
 * ### isLogged
 * Ci dice se l'utente è loggato o meno
 * @return {Boolean}
 */
Object.defineProperty(exports, 'isLogged', {
    get: function() {
        return tiACI.Services.SSO.isLogged;
    }
});

/**
 * ### hasCF
 * Ci dice se l'utente ha o meno un codice fiscale confermato
 * @return {Boolean}
 */
Object.defineProperty(exports, 'hasCF', {
    get: function() {
        var u = tiACI.Services.SSO.getCurrentUser();
        console.log('user hasCF', u);
        return u && u['userInfo.codiceFiscale'];
    }
});

/*
 * ### hasCellulare
 * Ci dice se l'utente ha o meno un cellulare confermato
 * @return {Boolean}
 */
Object.defineProperty(exports, 'hasCellulare', {
    get: function() {
        var u = tiACI.Services.SSO.getCurrentUser();
        console.log('user hasCellulare', u);
        return u && u['userInfo.mobile'] && u['userInfo.mobile'] == u['userInfo.mobileTemp'];
    }
});

/**
 * ### rememberMe
 * Property readonly che dice se l'utente ha selezionato l'opzione _remember me_
 * @return {Boolean}
 */
Object.defineProperty(exports, 'rememberMe', {
    get: function() {
        var v = Ti.App.Properties.getBool("utenteRemeberMe");
        console.log('get rememberMe', v);
        return !!v;
    },
    set: function(v) {
        console.log('set rememberMe', v);

        Ti.App.Properties.setBool("utenteRemeberMe", v);

    }
});

/**
 * ### authToken
 * Propery readonly che espone il token di autorizzazione
 * @return {string} auth token, se presente
 */
Object.defineProperty(exports, 'authToken', {
    get: function() {
        return tiACI.Services.SSO.authToken;
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
 * ### getCurrentUser
 * Ritorna i dati dell'utente attuale, se presente
 * @return {object} hash set con i dati utente
 */
exports.getCurrentUser = function() {
    return tiACI.Services.SSO.getCurrentUser();
};




/**
 * ### doLogin
 * @param {string} username   [description]
 * @param {string} password   [description]
 * @param {Boolean} rememberMe [description]
 * @param {Function} cb         callback in formato (err, userData)
 */
exports.doLogin = function(username, password, rememberMe, cb) {
    console.log('user doLogin', username, password, rememberMe);
    tiACI.Services.SSO.login(username, password, function(err, userData) {
        if (err) {
            console.log('user doLogin err', err);
            cb && cb(err);
        } else {
            console.log('user doLogin success', username, password, err, userData);
            //porcata: mi salvo le credenziali per replicare il login in automatico
            Ti.App.Properties.setObject("utenteCredenziali", [username, password, rememberMe]);


            exports.onLogin(userData, rememberMe);

            Ti.App.fireEvent("loggedInUser", {
                loggedUser: true
            });


            cb && cb(null, userData);
        }
    });
};

/**
 * ### doLogout
 * Esegue il logout dal servizio SSO
 */
exports.doLogout = function() {
    tiACI.Services.SSO.logout(exports.onLogout);
};


/**
 * ### doSignup
 * @param {object} regData dati di registrazione dell'utente, provenienti dalla form
 * @param {Function} cb callback di registrazione, nella forma (err, result)
 */
exports.doSignup = function(regData, cb) {
    tiACI.Services.SSO.signup(regData, cb);
};


/**
 * ### refreshData
 * @param {Function} cb [description]
 */
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
    console.log('lastLogin', lastLogin);

    //console.log('refresh?', Ti.Network.networkType != Ti.Network.NETWORK_NONE, credentials, lastLogin, now.getDate() != new Date(lastLogin).getDate());
    //console.log('refresh? 2', now.getDate(), new Date(lastLogin).getDate());

    var isConnected = Ti.Network.networkType != Ti.Network.NETWORK_NONE
    var hasCredentials = !!credentials;
    var hasLoggedOnce = !!lastLogin;
    var isSameDay = now.getDate() != new Date(lastLogin).getDate();
    if (isConnected && hasCredentials && hasLoggedOnce) {
        //if (Ti.Network.networkType != Ti.Network.NETWORK_NONE, credentials && lastLogin ){
        exports.doLogin(credentials[0], credentials[1], credentials[2], cb);
        console.log('refresh');
    }

};



//qui gestisco il logout
// essendo i moduli dei singleton in titanium, al primo accesso 
// se remember=false -> logout
if (!exports.rememberMe) {
    console.log("lib/user.js LOGOUT UTENTE ALL'AVVIO");
    exports.onLogout();
}