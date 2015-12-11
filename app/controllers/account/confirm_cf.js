/**
 *
 */

var utility = require('utility');
var user = require('user');
var commons = require('commons');
var navigation = require('navigation');
var tiACI = require('ti.aci');


var onConfirm;


function stepChange(e) {
    console.log('stepChange', e);
    $.btSecondary.getView().visible = e.currentPage > 0;


}


function next() {
    $.wizard.next();
}

function prev() {
    $.wizard.prev();
}

/**
 * confirmExit
 * @return {[type]} [description]
 */
function confirmExit(done, abort) {

    //apro un dialog per scegliere cosa fare
    var dialog = Titanium.UI.createAlertDialog({
        title: 'Conferma uscita',
        message: 'Vuoi abbandonare la procedura? I dati finora salvati andranno persi.',
        buttonNames: ['Annulla', 'Abbandona'],
        cancel: 0
    });

    dialog.addEventListener('click', function(e) {
        console.log('dialog e', e);
        switch (e.index) {
            case e.source.cancel:
                console.log('dialog cancel');
                abort();

                $.win.close();

                break;
            case 1: //chiama
                console.log('dialog 1');
                done();
                break;
        }
    });

    dialog.show();

}

function confirmBack(done, abort) {

    //apro un dialog per scegliere cosa fare
    var dialog = Titanium.UI.createAlertDialog({
        title: 'Torna indietro',
        message: 'Vuoi tornare alla schermata precedente? I dati finora salvati andranno persi.',
        buttonNames: ['Annulla', 'Torna indietro'],
        cancel: 0
    });

    dialog.addEventListener('click', function(e) {
        console.log('dialog e', e);
        switch (e.index) {
            case e.source.cancel:
                console.log('dialog cancel');
                abort();

                break;
            case 1: //chiama
                console.log('dialog 1');
                done();
                break;
        }
    });

    dialog.show();

}


function goLanding() {
    // var landing = Alloy.createController('account/confirm_cf_complete').getView();
    // landing.open();

    navigation.open('account/confirm_cf_complete');

    _.defer(function() {
        $.win.close();
    });
}

function goReturnUrl() {
    if (onConfirm) {
        onConfirm();
    }
    _.defer(function() {
        $.win.close();
    });

}

/**
 * ### submit
 * Funzione da richiamare per salvare i dati della form. I `data` sono nella forma `fieldId: value`.
 * @param {object} data dati della form
 * @param {Function} cb callback nella forma (err, success)
 */
function submit(data, cb) {
    Alloy.Globals.loading.show('Salvataggio dati');
    require('user').doSignup(data, function(err, result) {

        console.log('doSignup ', err, result);

        Alloy.Globals.loading.hide();


        require('navigation').openSignupComplete();

        _.defer(function() {
            $.win.close();
        });
    });
}

/**
 * ### initForm
 */
function initWizard() {
    //variabile di appoggio per i dati ricavati dal codice fiscale
    var reversedData;

    //step 0: pagina iniziale
    var step_iniziale = {
        id: 'step_iniziale',
        view: Alloy.createController('account/confirm_cf_step_iniziale').getView(),
        prev: confirmExit,
        next: 'step_cf'
    };

    //step 1: form inserimento cf
    var form_cf = Alloy.createWidget('it.aci.informatica.ti.widgets.form', {
        fields: [{
            fieldId: 'cf',
            hintText: 'Codice Fiscale',
            required: true,
            format: /^[a-z]{6}\d{2}[abcdehlmprst]\d{2}[a-z]\d{3}[a-z]$/i,
            value: user.getCurrentUser()['userInfo.codiceFiscale']
        }],
        onSubmit: function() {
            $.wizard.next();
        }
    });
    var step_cf = {
        id: 'step_cf',
        view: form_cf.getView(),
        prev: confirmBack,
        next: function(done, abort) {
            //1. validazione
            form_cf.validate(function(isValid) {
                //2. Se è valido
                if (isValid) {
                    //2.1. salvataggio cf su sso
                    var form_data = form_cf.read();
                    var cf = form_data.cf;
                    var user_data = user.getCurrentUser();
                    var nome = user_data['userInfo.name'];
                    var cognome = user_data['userInfo.surname'];
                    tiACI.Services.SSO.reverseCodiceFiscale(cf, nome, cognome, function(err, res) {
                        console.log('reverseCodiceFiscale', err, res);

                        if (err || res.resultCode == 500) {
                            alert('error');
                        } else {
                            //2.2. passo i dato a step_dati_anagrafici
                            reversedData = res.data.infos;
                            form_dati_anagrafici.setData({
                                nome: nome,
                                cognome: cognome,
                                sesso: reversedData.gender,
                                datanascita: [reversedData.birthDateDay, reversedData.birthDateMonth, '19' + reversedData.birthDateYear].join('/'),
                                luogo: reversedData.city || reversedData.country
                            });
                            //2.3. vado avanti
                            done('step_dati_anagrafici');
                        }
                    });



                }
                //3. Se non è valido
                else {
                    abort();
                }
            })
        }
    };

    //step 2: dati anagrafici
    var form_dati_anagrafici = Alloy.createController('account/confirm_cf_step_dati_anagrafici');
    var step_dati_anagrafici = {
        id: 'step_dati_anagrafici',
        view: form_dati_anagrafici.getView(),
        next: function(done, abort) {
            //salvataggio dati codice fiscale
            var cf = form_cf.read().cf;
            var userData = form_dati_anagrafici.getData();

            console.log('step_dati_anagrafici');
            console.log('cf', cf);
            console.log('userData', userData);
            tiACI.Services.SSO.changeCodiceFiscale(cf, {
                gender: reversedData.gender,
                birthDate: userData.datanascita,
                city: reversedData.city,
                country: reversedData.country,
                district: reversedData.district
            }, function(err, res) {
                if (err) {
                    abort();
                } else {

                    var isCellulareConfermato = user.hasCellulare;
                    if (isCellulareConfermato) {
                        goReturnUrl();
                    } else {
                        done('step_cellulare');
                    }


                }
            });
            //

        }
    };

    //step 3: cellulare
    var form_cellulare = Alloy.createWidget('it.aci.informatica.ti.widgets.form', {
        fields: [{
            fieldId: 'cellulare',
            hintText: 'Cellulare',
            required: true,
            keyboardType: Ti.UI.KEYBOARD_PHONE_PAD,
            format: /^[0-9]{10}$/,
            value: user.getCurrentUser()['userInfo.mobileTemp']
        }],
        onSubmit: function() {
            $.wizard.next();
        }
    });
    var step_cellulare = {
        id: 'step_cellulare',
        view: form_cellulare.getView(),
        next: function(done, abort) {
            //1. validazione
            form_cellulare.validate(function(isValid) {
                //2. Se è valido
                if (isValid) {
                    //2.1. salvataggio cf su sso
                    var form_data = form_cellulare.read();
                    var num = form_data.cellulare;

                    tiACI.Services.SSO.changeMobile(num, function(err, res) {
                        console.log('changeMobile', err, res);
                        if (err) {
                            alert('error');
                        } else {
                            goLanding();
                        }
                    });


                }
                //3. Se non è valido
                else {
                    abort();
                }
            })
        }
    };

    $.wizard.addSteps([step_iniziale, step_cf, step_dati_anagrafici, step_cellulare]);
}

/**
 * ### constructor
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
(function(args) {

    //inizializzazioni comuni della Window
    commons.initWindow($.win, 'Conferma Codice Fiscale', null, []);

    //inizializzo la form
    initWizard();

    $.btSecondary.getView().visible = false;

    onConfirm = args.onConfirm;
})(arguments[0] || {});