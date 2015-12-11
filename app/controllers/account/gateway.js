/**
 * # Gateway
 * Schermata che permette all'utente non lioggato di scegliere se registrarsi, loggarsi o scorrere il catalogo tessere
 */


var navigation = require('navigation');

/**
 * ### onLogin
 * Callback da eseguire in caso di login, utile per redirect
 */
var onLogin;

/**
 * ### openLogin
 * Handler del click sul pulsante btLogin
 */
var openLogin = function() {
    navigation.openLogin(onLogin);
};

/**
 * ### openSignup
 * Handler del click sul pulsante btSignup
 */
var openSignup = function() {
    navigation.openSignup();
};

/**
 * ### openTessere
 * Handler del click sul pulsante btTessere
 */
var openTessere = function() {
    navigation.openTessereMain();
};


/**
 * ### constructor
 * @param {object} args parametri di costruzione del controller
 */
(function constructor(args) {

    //setup window
    require('commons').initWindow($.win, 'Scegli un\'opzione', null);

    //inizializzo la callback da utilizzare in caso di login. 
    //la pagina gateway deve essere _trasparente_, nel senso che è intermedia alla pagina di login nel caso si scelga l'opzione di autenticarsi
    onLogin = function() {
        //args.onLogin è l'azione passata al gateway
        args.onLogin && args.onLogin();
        //chiudo la finestra corrente
        $.win.close();
    };

})(arguments[0] || {});