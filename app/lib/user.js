/**
 * Raccolta di metodi per gestire gli utenti
 */




/**
 * Azioni da intraprendere quando un utente si logga
 * @param  {object} userData dati dell'utente
 * @param  {boolean} remember se devo ricordare il login al prossimo avvio dell'app
 */
exports.onLogin = function(userData, remember) {
    Ti.App.Properties.setBool("utenteRemeberMe", remember);
    Ti.App.Properties.setBool("utenteAutenticato", true);
    Ti.App.Properties.setObject("datiUtente", userData);
};

/**
 * Azioni da intraprendere quando un utente esce
 * [onLogout description]
 */
exports.onLogout = function() {
    Ti.App.Properties.setBool("utenteRemeberMe", false);
    Ti.App.Properties.setBool("utenteAutenticato", false);
    Ti.App.Properties.setObject("datiUtente", undefined);
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
 * Ritorna i dati dell'utente attuale, se presente
 * @return {object} hash set con i dati utente
 */
exports.getCurrentUser = function() {
    return Ti.App.Properties.getObject("datiUtente");
};



//qui gestisco il logout
// essendo i moduli dei singleton in titanium, al primo accesso 
// se remember=false -> logout
if (!Ti.App.Properties.getBool("utenteRemeberMe")) {
    console.log("lib/user.js LOGOUT UTENTE ALL'AVVIO");
    exports.onLogout();
}