/**
 * # Login
 * Schermata per la login utente
 */


var net = require('network');
var user = require('user');
var commons = require('commons');
var navigation = require('navigation');




/**
 * ### onLogin
 * Callback da eseguire al completamento della login. Viene passata come argomento nel costruttore
 */
var onLogin;


/**
 * ### doSignup
 * Passa alla schermata di registrazione
 */
function doSignup() {
    navigation.openSignup();
}

/**
 * ### doResetPwd
 * Apre la pagina di reset della password
 */
function doResetPwd() {
    navigation.openResetPassword();
}

/**
 * ### doLogin
 * Effettua la login.
 */
function doLogin() {

    //recupero dei valori dalla form
    var username = $.username.value.trim();
    var password = $.password.value.trim();
    var rememberMe = $.ricordami.getView().value;

    console.log('doLogin rememberMe', rememberMe);

    // validazione
    if (username === "" && password === "") {
        alert("Inserire nome utente e password!");
        return;
    }

    //login
    else {

        //mostra il loader    
        Alloy.Globals.loading.show('Caricamento dati...', false);

        //chiamo il servizio di autenticazione
        user.doLogin(username, password, rememberMe, function(err, user_data) {

            //aggiorno la registrazione di questo device sul servizio acigeo
            require('network').registerForPush();

            //nasconde il loader
            Alloy.Globals.loading.hide();

            //gestisco eventuali errori
            if (err) {
                console.log('account doLogin error', err);

                var msg = (function(err){
                    if(Array.isArray(err.data)){
                        return err.data[0];
                    } else if(_.isString(err.data)) {
                        return err.data;
                    } else {
                        return 'Si è verificato un errore';
                    }
                })(err); 
                
                alert(msg);

            }

            //eseguo le operazioni di conferma della login
            else {

                //operazioni conclusive
                //uso il defer, così in caso di errore non viene considerato un errore della chiamata http (con il defer creo un nuovo stack)
                _.defer(function() {

                    //chiudo la schermata di login, uso il defer per dar tempo ad eventuali altre schermate di visualizzarsi
                    _.defer(function() {
                        Alloy.Globals.navMenu.closeWindow($.win);
                    });

                    //chiamo la callback di avvenuta login, se presente
                    onLogin && onLogin();


                })



            }
        });
    }

}


/**
 * ### constructor
 * @param {object} args
 */
(function constructor(args) {
    console.log('login args', args);

    //setup window
    commons.initWindow($.win, "La tua tessera", "/images/ic_action_home_tessera_blu.png");

    //
    onLogin = args.onLogin;

})(arguments[0] || {});