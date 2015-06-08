var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');


//inizializzazioni comuni della Window
commons.initWindow($.win, 'Registrazione', null, []);

//descrittori di campi e validazione
var formSchema = {
    fields: [
        [{
            fieldId: 'aciCard',
            hintText: 'Numero tessera ACI',
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

        /*[ {
            fieldId: 'mobile',
            hintText: 'Numero di cellulare',
            prefix: '(+39)',
            // keyboardType: Ti.UI.KEYBOARD_PHONE_PAD,
            required: true,
            format: /^[0-9]{9,10}$/
        } ],*/
        [{
            fieldId: 'email',
            hintText: 'E-mail',
            required: true,
            keyboardType: Ti.UI.KEYBOARD_EMAIL,
            format: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        },{
            fieldId: 'username',
            hintText: 'Username',
            required: true,
            range: [5, 32],
            format: [/^[A-Za-z0-9\.]+$/, 'solo lettere, cifre e punti'],
            /*  validate: function(value, cb) {
                Alloy.Globals.loading.show('Controllo dati');
                console.log('username validate' + value);
                require('network').userCheckUsername(value, function(res) {
                    Alloy.Globals.loading.hide();
                    console.log('username validate res', res);
                    if (res && res.result == "success") {

                        if (res.data.userexist) {
                            cb && cb(false, ['username già in uso']);
                        } else {
                            cb && cb(true);
                        }

                    } else {
                        console.log('username validate else', res);
                        cb && cb(false, [res.data]);
                    }
                });
            }*/
        }, {
            fieldId: 'password',
            hintText: 'Password',
            passwordMask: true,
            required: true,
            range: [8, 32],
            format: [/^[A-Za-z0-9%,@#$()*+-:=\.]+$/, 'contiene caratteri non consentiti']
        }]


    ],
    onSubmit: function(data, cb) {
        Alloy.Globals.loading.show('Salvataggio dati');
        require('network').userSignUp(data, function(e) {
            Alloy.Globals.loading.hide();

            console.log('cb ', e);

            var w = Alloy.createController('signup_complete').getView();
            Alloy.Globals.navMenu.openWindow(w);
            _.defer(function() {
                $.win.close();
            });
        });
    }
};

$.formWizard.init(formSchema);