var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');


//inizializzazioni comuni della Window
commons.initWindow($.win, 'Registrazione', null, []);

//descrittori di campi e validazione
var formSchema = {
    fields: [
        [{
            fieldId: 'tessera',
            hintText: 'Numero tessera ACI',
            required: false,
            format: /^([A-Za-z]{2}[0-9]{9})|([0-9]{10}[A-Za-z]{1})$/
        }, {
            fieldId: 'nome',
            hintText: 'Nome',
            required: true
        }, {
            fieldId: 'cognome',
            hintText: 'Cognome',
            required: true
        }],

        [{
            fieldId: 'email',
            hintText: 'E-mail',
            required: true,
            format: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        }, {
            fieldId: 'cellulare',
            hintText: 'Numero di cellulare',
            prefix: '(+39)',
            required: true
        }],
        [{
            fieldId: 'username',
            hintText: 'Username',
            required: true,
            format: /^[A-Za-z0-9\.]{5,32}$/
        }, {
            fieldId: 'password',
            hintText: 'Password',
            required: true,
            format: /^[A-Za-z0-9%,@#$()*+-:=\.]{8,32}$/
        }]


    ],
    onSubmit: function(data, cb) {

    }
};

$.formWizard.init(formSchema);