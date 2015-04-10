var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');


//descrittori di campi e validazione
var formSchema = {
    fields: [
        [{
            fieldId: 'tessera',
            required: false,
            format: /^([A-Za-z]{2}[0-9]{9})|([0-9]{10}[A-Za-z]{1})$/,
            controller: $.tessera
        }, {
            fieldId: 'nome',
            required: true,
            controller: $.nome
        }, {
            fieldId: 'cognome',
            required: true,
            controller: $.cognome
        }],

        [{
            fieldId: 'email',
            required: true,
            format: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
            controller: $.email
        }, {
            fieldId: 'cellulare',
            required: true,
            controller: $.cellulare
        }],
        [{
            fieldId: 'username',
            required: true,
            format: /^[A-Za-z0-9\.]{5,32}$/,
            controller: $.username
        }, {
            fieldId: 'password',
            required: true,
            format: /^[A-Za-z0-9%,@#$()*+-:=\.]{8,32}$/,
            controller: $.password
        }]


    ],
    onSubmit: function(data, cb) {

    }
};


function validatePage(index, cb) {
    var page = formSchema.fields[index];
    if (page) {
        //flag di validazione della pagina, false se almeno uno dei campi non è valido
        var valid = true;

        //wrapper della callback di risposta, debounce per il numero di campi da validare (aspetta che tutti abbiano tornato un valore)
        var response = _(function() {
            cb && cb(valid);
        }).debounce(page.length);

        //per ogni campo, esegue la validazione, aggiorna il flag di pagina e chiama la funzione response
        _(page).each(function(field) {
            validateField(field, function(v) {
                valid &= v;
                response();
            });
        });



    } else {
        //boh
    }
}

function validateField(field, cb) {
    function onError(msg) {
        console.log('validateField', field.fieldId, msg);
    }

    function response(valid){
        var controller = field.controller;
        if(valid){
            //resetta il controller
            //
            controller.color = "transparent";
            controller.borderWidth = 0;
        } else {
            controller.borderColor = "red";
            controller.borderWidth = 1;
        }

        cb && cb(valid);
    }

    var value = field.controller.value.trim();
    var valid = true;

    if (field.required && !value) {
        onError('obbligatorio');
        valid = false;
    }

    if (field.format && value && !field.format.test(value)) {
        onError('formato non valido');
        valid = false;
    }

    if (field.validate) {
        field.validate(response);
    } else {
        response(valid);
    }


}

function validate(cb) {}

/**
 * Legge i dati dalla form e li inserisce in un oggetto
 * @return {[type]} [description]
 */
function read() {
    return _(formSchema.fields)
        .chain()
        .reduce(function(memo, e) {
            return memo.concat(e);
        }, [])
        .reduce(function(memo, e) {
            return memo[e.fieldId] = e.controller.value;
        }, {})
        .value();

}

function save(cb) {}

function cancel() {}





/** ___________________________________ */



//inizializzazioni comuni della Window
commons.initWindow($.win, 'Registrazione', null, []);

var currentPage = 0;
var pageNumber = 3;

function render() {
    $.secondaryButton.visible = currentPage > 0;
    $.primaryButton.text = currentPage == 2 ? 'Fine' : 'Continua';

}

function primaryAction(e) {

    nextPage();

}

function secondaryAction(e) {
    var next = currentPage - 1;

    if (next >= 0) {
        $.formWizard.scrollToView(next);
    }
}

function nextPage() {
    var next = currentPage + 1;

    validatePage(currentPage, function(valid) {
        if (valid) {
            if (next < pageNumber) {
                $.formWizard.scrollToView(next);
            } else {
                //finalizza form
            }
        } else {
            alert('non valido');
        }
    });
}

function onScroll(e) {
    currentPage = e.currentPage;
    render();

}

//questo hack serve a spostarsi automatichamente da un campo all'altro
(function nextFieldHack() {



    for (var pageIndex = 0; pageIndex < formSchema.fields.length; pageIndex++) {
        var page = formSchema.fields[pageIndex];

        for (var fieldIndex = 0; fieldIndex < page.length; fieldIndex++) {
            console.log('fieldIndex', fieldIndex);
            var field = page[fieldIndex];
            console.log('field ', field);

            var onReturn = function(fieldIndex, pageIndex) {
                var isLastField = fieldIndex == formSchema.fields[pageIndex].length - 1;
                var isLastPage = pageIndex == formSchema.fields.length - 1;

                console.log('return');
                console.log(fieldIndex, pageIndex, isLastField, isLastPage);

                if (isLastField) {
                    if (!isLastPage) {
                        nextPage();

                    }
                } else {
                    var nextField = formSchema.fields[pageIndex][fieldIndex + 1];
                    nextField.controller.focus();
                }
            }

            field.controller.addEventListener('return', _(onReturn).partial(fieldIndex, pageIndex));


        };
    };
})();


render();