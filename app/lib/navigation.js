/**
 * # Navigation
 * Funzioni per la navigazione tra le schermate dell'app
 */





/**
 * ### open
 * Funzione generica per aprire una finestra
 * @param {string} ctrl nome del controller
 * @param {hash} args (opzionale) argomenti da passare al controller in creazione
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
function open(ctrl, args) {
    console.log('navigation open ', ctrl, args);
    var win = Alloy.createController(ctrl, args || {}).getView();
   
    exports.Nav.openWindow(win);
    return win;
}


/**
 * ### requireLogin
 * Wrapper di una qualsiasi funzione di navigazione. Implementa la logica per cui una funzione viene eseguita solo se l'utente è loggato, altiimenti apre la finestra di login.
 * Questo wrapper funziona tramite closure: se ho una funzione `myFunc`, posso proteggerla generando una nuova funzione `myProtectedFunc = requireLogin(myFunc)`
 * @param {Function} fn funzione da proteggere
 * @return {Function} wrapper della funzione da proteggere, che implementa il meccanismo di login
 */
function requireLogin(fn) {
    return function() {
        if (Alloy.Globals.isLogged) {
            return fn && fn();
        } else {
            return exports.openAccountGateway(fn);
        }
    }
}

/**
 * ### requireCF
 * Wrapper di una qualsiasi funzione di navigazione. Implementa la logica per cui una funzione viene eseguita solo se l'utente ha un codice fiscale confermato, altiimenti apre la finestra di conferma codice fiscale.
 * Questo wrapper funziona tramite closure: se ho una funzione `myFunc`, posso proteggerla generando una nuova funzione `myProtectedFunc = requireLogin(myFunc)`
 * @param {Function} fn funzione da proteggere
 * @return {Function} wrapper della funzione da proteggere, che implementa il meccanismo
 */
function requireCF(fn) {
    return function() {
        var user = require('user');
        //devo avere sia un codice fiscale, sia un cellulare convalidato
        if (user.hasCF && user.hasCellulare) {
            return fn && fn();
        } else {
            return exports.openConfirmCF(fn);
        }
    }
}


//
// ## PUBLIC API
//


exports.open = open;

// ### Nav
// Riferimento alla NavigationWindow globale 
Object.defineProperty(exports, "Nav", {
    get: function() {
        return Alloy.Globals.navMenu;
    },
    set: function(v) {
        Alloy.Globals.navMenu = v;
    }
});


/**
 * ### openAccountGateway
 * Apre la schermata `AccountGateway` in cui l'utente sceglie se loggarsi o registrarsi
 * @param {Function} onLogin (opzionale) funzione da eseguire al completamento della login. Solitamente è una funzione di reindirizzamento, verrà eventualmente passata alla schermata di login.
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openAccountGateway = function(onLogin) {
    console.log('openAccountGateway');
    return open('account/gateway', {
        onLogin: onLogin
    });
};

/**
 * ### openLogin
 * @param {Function} onLogin funzione da eseguire al completamento della login. Solitamente è una funzione di reindirizzamento.
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openLogin = function(onLogin) {
    return open('account/login', {
        onLogin: onLogin
    });
};

/**
 * ### openSignup
 * Apre la schermata di registrazione
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openSignup = function() {
    if (Alloy.CFG.Register_OpenWebsite) {
        Ti.Platform.openURL(Alloy.CFG.Register_Url);
    } else {
        open('account/signup');
    }
};

/**
 * ### openSignupComplete
 * Apre la schermata di fince registrazione
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openSignupComplete = function() {
    open('account/signup_complete');
};

/**
 * ### openSignupComplete
 * Apre la schermata di fince registrazione
 * @param {Function} onLogin funzione da eseguire al completamento della login. Solitamente è una funzione di reindirizzamento.
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openConfirmCF = function(onConfirm) {
    open('account/confirm_cf', {
        onConfirm: onConfirm
    });
};

/**
 * ### openResetPassword
 * Apre la schermata di reset della password
 */
exports.openResetPassword = function() {
    Ti.Platform.openURL(Alloy.CFG.ResetPwd_Url);
};

/**
 * ### openPuntiAciMain
 * Apre la schermata principale della sezione `Punti Aci`
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openPuntiAciMain = _(open).partial('PuntiAciMain');


/**
 * ### openPuntiAciList_ServiziGIC
 * Apre la lista dei punti aci trovati in base al servizio passato
 * @param {string} service servizio appartenente alla categoria GIC
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openPuntiAciList_ServiziGIC =  function(service){
    return open('PuntiAci_List', {
        id_code: 'ric',
        data: {
            fuoriGIC: false,
            gic: service
        }
    });
};

/**
 * ### openPuntiAciList_ServiziNoGIC
 * Apre la lista dei punti aci trovati in base al servizio passato
 * @param {string} service servizio appartenente alla categoria NO-GIC
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openPuntiAciList_ServiziNoGIC =  function(service){
    return open('PuntiAci_List', {
        id_code: 'ric',
        data: {
            fuoriGIC: true,
            gic: service
        }
    });
};

/**
 * ### openSycMain
 * Apre la schermata principale della sezione `Syc` (VantaggiSoci)
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openSycMain = function() {
    return open('VantaggiSociMain');
};

/**
 * ### openAssistenzaStradaleMain
 * Apre la schermata principale della sezione `Assistenza Stradale`
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openAssistenzaStradaleMain = function() {
    return open('SoccorsoStradaleMain');
};


/**
 * ### openTessera
 * Apre la schermata con la tessera per l'utente corrente
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openTessera = requireLogin(_(open).partial('tessera/my'));


/**
 * ### openInfoTargaMain
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */
exports.openInfoTargaMain = requireLogin(requireCF(_(open).partial('infoTarga/main')));



/**
 * ### openMyCarMain
 * @return {Ti.UI.Window} istanza della Window creata e aperta
 */

exports.openMyCarMain = requireLogin(requireCF(function(args) {
    console.log('navigation openMyCarMain');
    open('myCar/listCar', args || {});
}));