/**
 *
 */

var utility = require('utility');
var commons = require('commons');


function stepChange(e) {
    console.log('stepChange', e);
    $.btSecondary.getView().visible = e.currentPage > 0;


}


function next() {
    $.formWizard.next();
}

function prev() {
    $.formWizard.prev();
}


/**
 * ### submit
 * Funzione da richiamare per salvare i dati della form. I `data` sono nella forma `fieldId: value`.
 * @param {object} data dati della form
 * @param {Function} cb callback nella forma (err, success)
 */
function submit(data, cb) {
    Alloy.Globals.loading.show('Salvataggio dati');
    require('ti.aci').Services.SSO.signup(data, function(err, result) {

        console.log('doSignup ', err, result);

        if (!err) {
            Alloy.Globals.loading.hide();


            require('navigation').openSignupComplete();

            _.defer(function() {
                $.win.close();
            });
        } else {
            console.error('errore salvataggio', err);
            alert('Si è verificato un errore nella registrazione');
        }
    });
}

/**
 * ### initForm
 */
function initForm() {
    //descrittori di campi e validazione
    var formSchema = {
        fields: [
            //step1
            [{
                fieldId: 'aciCard',
                hintText: 'Numero tessera ACI (opzionale)',
                required: false,
                format: /^([A-Za-z]{2}[0-9]{9})|([0-9]{10}[A-Za-z]{1})$/
            }, {
                fieldId: 'name',
                hintText: 'Nome',
                required: true
            }, {
                fieldId: 'surname',
                hintText: 'Cognome',
                required: true
            }],
            //step 2
            [{
                fieldId: 'email',
                hintText: 'E-mail',
                required: true,
                keyboardType: Ti.UI.KEYBOARD_EMAIL,
                format: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
            }, {
                fieldId: 'username',
                hintText: 'Username',
                required: true,
                range: [5, 32],
                format: [/^[A-Za-z0-9\.]+$/, 'solo lettere, cifre e punti'],

            }, {
                fieldId: 'password',
                hintText: 'Password',
                passwordMask: true,
                required: true,
                range: [8, 32],
                format: [/^[A-Za-z0-9%,@#$()*+-:=\.]+$/, 'contiene caratteri non consentiti']
            }]

        ],
        onSubmit: submit
    };

    $.formWizard.init(formSchema);
}

/**
 * ### constructor
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
(function(args) {

    //inizializzazioni comuni della Window
    commons.initWindow($.win, 'Registrazione', null, []);

    //inizializzo la form
    initForm();

    $.btSecondary.getView().visible = false;
})(arguments[0] || {});