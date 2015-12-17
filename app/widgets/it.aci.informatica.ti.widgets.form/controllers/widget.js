/**
 * Form Widget
 * Widget che genera una form a partire da uno schema dati.
 */



var formSchema;
var currentFocus;



//
// UI Builders
//


/**
 * ### createPageView
 * factory method per le pagine del wizard
 * @return {[type]} [description]
 */
function createPageView() {
    var v = Ti.UI.createView();

    var style = $.createStyle({
        classes: ['step'],
        apiName: 'View'
    });
    v.applyProperties(style);
    return v;
}

/**
 * ### createFieldGroupView
 * factory method per le pagine del wizard
 * @return {[type]} [description]
 */
function createFieldGroupView() {
    var v = Ti.UI.createView();

    var style = $.createStyle({
        classes: ['fieldGroup'],
        apiName: 'View'
    });
    v.applyProperties(style);
    return v;
}


$.applyProperties = function(props) {
    $.wrapper.applyProperties(props);
};

/**
 * ### createFieldController
 * factory method per il singolo campo
 * @param {object} field hash di parametri che definiscono il campo
 * @return {widget}
 */
function createFieldController(field) {
    
    //specifica il tipo di controllo da renderizzare
    var type = field.type || 'text';

   
    var ctrl;
    switch(type){
        case 'text':
            var params = _(field).pick('hintText', 'prefix', 'postfix', 'keyboardType', 'passwordMask', 'value');
            ctrl = Alloy.createWidget('it.aci.informatica.ti.widgets.form_textfield', params);
        break;
        case 'iconselector':
            var params = _(field).pick('items', 'selected');
            ctrl = Alloy.createWidget('it.aci.informatica.ti.widgets.form_iconselector', params);
        break;
    }

 
      

    //gestisco la visualizzazione degli errori al focus e al blur
    ctrl.on('focus', function() {
        currentFocus = field.controller;
        showError(field);
    });
    ctrl.on('blur', function() {
        currentFocus = null;
        hideError();
    });


    return ctrl;
}



//
// ## Validation
//




/**
 * ### validateField
 * valida il singolo controllo secondo le regole definite nello schema
 * @param {object} field descrittore del campo da validare. Rispetto alla validazione, si aspetta i seguenti paramentri:
 *                       * required _Boolean|String_ campo obbligatorio o no. Se è una stringa, è il messaggio di errore da visualizzare. Altrimenti, se è booleano, il messaggio di errore sarà "obbligatorio"
 *                       * format _Regex_ regex sulla quale validare il campo
 *                       * range _array_ coppia (min,max) che definisce il range di lunghezza del campo
 *                       * validate _Function_ funzione per la validazione custom del campo. La signature è (value, cb).
 * @param  {Function} cb callback di validazione nel formato (valid, errors)
 */
function validateField(field, cb) {

    //valore del campo
    var value =(field.controller.value || '').trim();

    //array degli errori riscrontrati
    var errors = [];

    //snippet che formatta la risposta, ovvero la chiamata della callback
    function response() {
        var controller = field.controller;
        var valid = errors.length == 0;


        controller.isValid = valid;

        field.errors = errors;
        console.log('validateField', field.fieldId, valid, errors);
        cb && cb(valid, errors);
    }



    //obbligatorietà
    if (field.required && !value) {

        errors.push(_.isString(field.required) ? field.required : 'obbligatorio');
    }

    //formato
    if (field.format && value) {
        var rx = _.isArray(field.format) ? field.format[0] : field.format;
        var msg = _.isArray(field.format) ? field.format[1] : 'formato non valido'
        if (!rx.test(value)) {
            errors.push(msg);
        }
    }

    //range
    if (value && field.range) {
        var a = field.range[0];
        var z = field.range[1];
        if (value.length < a || value.length > z) {
            errors.push('la lunghezza deve essere compresa tra ' + a + ' e ' + z + ' caratteri');
        }
    }

    //custom validation
    if (field.validate) {
        console.log('custom validate');
        field.validate(value, function(v, m) {
            if (!v && m) {
                console.log('custom validate r', v, m);
                errors = errors.concat(m);
            }

            response();
        });
    } else {
        response();
    }


}


//
// ## Runtime functions
//

/**
 * ### showError
 * Mostra l'errore di un campo selezionato
 * @param {object} field descrittore del campo per il quale mostrare l'errore
 */
function showError(field) {
    console.log('showError', field);
    if (field.errors && field.errors.length) {
        $.error.text = field.errors[0];

        $.errorWrapper.visible = true;
    }
}

/**
 * ### hideError
 * Nasconde l'errore attualmente visualizzato
 */
function hideError() {
    console.log('hideError');
    $.error.text = '';
    $.errorWrapper.visible = false;
}






/**
 * ### nextFieldHack
 * Hack per la gstione del next da tastiera sui campi, per una compilazione veloce
 * @return {[type]} [description]
 */
function nextFieldHack() {


    _(formSchema.fields).each(function(field, fieldIndex) {

        var onReturn = function(fieldIndex, pageIndex) {
            var isLastField = fieldIndex == formSchema.fields.length - 1;

            if (isLastField) {
                $.submit();
            } else {
                var nextField = formSchema.fields[fieldIndex + 1];
                nextField.controller.focus();
            }
        }

        field.controller.on('return', _(onReturn).partial(fieldIndex));
    });
};


function createForm(fields) {
    var pageView = createPageView();
    var fgView = createFieldGroupView();

    _(fields).each(function(field) {
        console.log(field);
        var fieldController = createFieldController(field);
        fgView.add(fieldController.getView());
        console.log('fieldController view', fieldController.getView());
        field.controller = fieldController;
    });

    //  console.log('formSchema.fields', formSchema.fields);

    pageView.add(fgView);

    $.formWizard.add(pageView);

}




/**
 * ## PUBLIC API
 */

/**
 * ### init
 * @param {object} schema hash che definisce la form da renderizzare.
 *                        * fields _array_ array dei campi da inserire nella form. In realtà si tratta di un _array di array_, in quanto i campi sono divisi in pagine. Per la definizione del singolo campo, fare riferimento alla funzione `createFieldController`. Per la validazione del singolo campo, fare riferimento a `validateField`.
 *                        * onSubmit _Function_ funzione nella forma (data, cb) che viene chiamata al completamento della form. Nell'istanza della form, è qui che si inserisce la funzione di salvataggio dati.
 */
$.init = function(schema) {

    formSchema = schema;


    createForm(formSchema.fields);

    //questo hack serve a spostarsi automatichamente da un campo all'altro
    _(nextFieldHack).defer();
};


$.validate = function(cb) {
    if (formSchema.fields) {
        //flag di validazione della pagina, false se almeno uno dei campi non è valido
        var valid = true;

        //wrapper della callback di risposta, debounce per il numero di campi da validare (aspetta che tutti abbiano tornato un valore)
        var response = _.after(formSchema.fields.length, function() {
            console.log('validatePage response');
            cb && cb(valid);
        });

        //per ogni campo, esegue la validazione, aggiorna il flag di pagina e chiama la funzione response
        _(formSchema.fields).each(function(field) {
            validateField(field, function(v) {
                valid &= v;
                console.log('validatePage ', field.fieldId, v, valid);

                response();
            });
        });



    } else {
        //boh
    }

};

$.read = function() {
    var data = _(formSchema.fields).chain()
        .map(function(field) {
            var o = {};
            o[field.fieldId] = field.controller.value;
            return o;
        })
        .reduce(function(memo, e) {
            return _.extend({}, memo, e);
        })
        .value();

    console.log('read', data);

    return data;
};


$.submit = function() {
    $.validate(function(valid) {
        if (valid) {
            var data = $.read();
            formSchema.onSubmit(data);
        }
    });
};



/**
 * ### constructor
 * @param {object} args parametri del widget
 */
(function constructor(args) {
    $.init(args);
})(arguments[0] || {});