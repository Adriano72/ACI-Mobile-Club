var args = arguments[0] || {};


var formSchema;
var currentPage;
var pageNumber;
var currentFocus;

/**
 * INTERFACCIA PUBBLICA
 */

$.init = function(schema) {

    formSchema = schema;

    //render
    for (var i = 0; i < schema.fields.length; i++) {
        var page = schema.fields[i];
        console.log('page');
        var pageView = createPageView();
        var fgView = createFieldGroupView();

        for (var j = 0; j < page.length; j++) {
            console.log('field');
            var field = page[j];
            var fieldController = createFieldController(field);
            fgView.add(fieldController.getView());
            console.log('fieldController view', fieldController.getView());
            schema.fields[i][j].controller = fieldController;
        };

        pageView.add(fgView);

        $.formWizard.addView(pageView);
    };


    currentPage = 0;
    pageNumber = formSchema.fields.length;

    render();

    //questo hack serve a spostarsi automatichamente da un campo all'altro
    _(nextFieldHack).defer();
};


/**
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



/**
 * factory method per il singolo campo
 * @param  {[type]} field [description]
 * @return {[type]}       [description]
 */
function createFieldController(field) {
    var params = _(field).pick('hintText', 'prefix', 'postfix', 'keyboardType', 'passwordMask');
    console.log('params', params);

    var ctrl = Alloy.createController('form_field_text', params);

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



/**
 * Valida tutti i controlli dela pagina i-esima
 * @param  {[type]}   index [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
function validatePage(index, cb) {
    var page = formSchema.fields[index];
    if (page) {
        //flag di validazione della pagina, false se almeno uno dei campi non è valido
        var valid = true;

        //wrapper della callback di risposta, debounce per il numero di campi da validare (aspetta che tutti abbiano tornato un valore)
        var response = _.after(page.length, function() {
            console.log('validatePage response');
            cb && cb(valid);
        });

        //per ogni campo, esegue la validazione, aggiorna il flag di pagina e chiama la funzione response
        _(page).each(function(field) {
            validateField(field, function(v) {
                valid &= v;
                console.log('validatePage ', field.fieldId, v, valid);

                response();
            });
        });



    } else {
        //boh
    }
}


/**
 * valida il singolo controllo secondo le regole definite nello schema
 * @param  {[type]}   field [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
function validateField(field, cb) {


    function response() {
        var controller = field.controller;
        var valid = errors.length == 0;


        controller.isValid = valid;

        field.errors = errors;
        console.log('validateField', field.fieldId, valid, errors);
        cb && cb(valid, errors);
    }

    var value = field.controller.value.trim();
    var errors = [];

    if (field.required && !value) {
        errors.push('obbligatorio');
    }

    /**
     * validazione formato
     */
    if (field.format && value) {
        var rx = _.isArray(field.format) ? field.format[0] : field.format;
        var msg = _.isArray(field.format) ? field.format[1] : 'formato non valido'
        if (!rx.test(value)) {
            errors.push(msg);
        }
    }

    /**
     * validazione range
     */
    if (value && field.range) {
        var a = field.range[0];
        var z = field.range[1];
        if (value.length < a || value.length > z) {
            errors.push('la lunghezza deve essere compresa tra ' + a + ' e ' + z + ' caratteri');
        }
    }



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


function showError(field) {
    console.log('showError', field);
    if (field.errors && field.errors.length) {
        $.error.text = field.errors[0];

        $.errorWrapper.visible = true;
    }
}

function hideError() {
    console.log('hideError');
    $.error.text = '';
    $.errorWrapper.visible = false;
}


function validate(cb) {}

/**
 * Legge i dati dalla form e li inserisce in un oggetto
 * @return {[type]} [description]
 */
function read() {
    var o = {};

    for (var i = 0; i < formSchema.fields.length; i++) {
        var page = formSchema.fields[i];
        for (var j = 0; j < page.length; j++) {
            var field = page[j];
            o[field.fieldId] = field.controller.value;
        };
    };

    console.log('read', o);

    return o;
    /*
    return _(formSchema.fields)
        .chain()
        .reduce(function(memo, e) {
            return memo.concat(e);
        }, [])
        .reduce(function(memo, e) {
            return memo[e.fieldId] = e.controller.value;
        }, {})
        .value();
*/
}

function save(cb) {}

function cancel() {}





/** ___________________________________ */






function render() {
    $.secondaryButton.visible = currentPage > 0;
    $.primaryButton.text = currentPage == 2 ? 'Fine' : 'Continua';

}

function primaryAction(e) {
    console.log('primaryAction', currentPage, pageNumber);
    if (currentPage == pageNumber - 1) {
        submit();
    } else {
        nextPage();
    }


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
                hideError();
                //     _(formSchema.fields[next][0].controller.focus).defer();
            } else {
                //finalizza form
            }
        } else {
            currentFocus && currentFocus.blur();
        }
    });
}

function submit() {

    validatePage(currentPage, function(valid) {
        console.log('submit', valid);
        if (valid) {
            var data = read();
            formSchema.onSubmit(data);
        }
    });


}

function onScroll(e) {
    currentPage = e.currentPage;
    render();

}


/**
 * Hack per la gstione del next da tastiera sui campi, per una compilazione veloce
 * @return {[type]} [description]
 */
function nextFieldHack() {



    for (var pageIndex = 0; pageIndex < formSchema.fields.length; pageIndex++) {
        var page = formSchema.fields[pageIndex];

        for (var fieldIndex = 0; fieldIndex < page.length; fieldIndex++) {
            // console.log('fieldIndex', fieldIndex);
            var field = page[fieldIndex];
            //    console.log('field ', field);

            var onReturn = function(fieldIndex, pageIndex) {
                var isLastField = fieldIndex == formSchema.fields[pageIndex].length - 1;
                var isLastPage = pageIndex == formSchema.fields.length - 1;

                //         console.log('return');
                console.log(fieldIndex, pageIndex, isLastField, isLastPage);

                if (isLastField) {
                    if (!isLastPage) {
                        nextPage();

                    } else {
                        submit();
                    }
                } else {
                    var nextField = formSchema.fields[pageIndex][fieldIndex + 1];
                    nextField.controller.focus();
                }
            }

            field.controller.on('return', _(onReturn).partial(fieldIndex, pageIndex));


        };
    };
};