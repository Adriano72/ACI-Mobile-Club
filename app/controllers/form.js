var args = arguments[0] || {};


var formSchema;
var currentPage;
var pageNumber;

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
    var params = _(field).pick('hintText', 'prefix', 'postfix', 'keyboardType');
    console.log('params', params);
    return Alloy.createController('form_field_text', params);
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


/**
 * valida il singolo controllo secondo le regole definite nello schema
 * @param  {[type]}   field [description]
 * @param  {Function} cb    [description]
 * @return {[type]}         [description]
 */
function validateField(field, cb) {
    function onError(msg) {
        console.log('validateField', field.fieldId, msg);
    }

    function response(valid) {
        var controller = field.controller;

        controller.isValid = valid;

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
          //  alert('non valido');
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