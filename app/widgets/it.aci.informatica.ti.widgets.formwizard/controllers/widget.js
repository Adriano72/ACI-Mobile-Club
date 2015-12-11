/**
 * # FormWizard
 * Questo widget unisce le funzionalità del widget `form` e del widget `wizard`.
 * In pratica si passa una struttura compressa di form a questo widget, vengono create diverse form e ogni form viene associata ad una pagina del wizard.
 */



//
// ## Private members
//


//Id del widget usato per la form
var FORM_WIDGET = 'it.aci.informatica.ti.widgets.form';

//Funzione da chiamare al submit
var submit;

//Array dei componenti form
var forms = [];

//
// ## Public API
//


/**
 * [init description]
 * @param  {[type]} formSchema [description]
 * @return {[type]}            [description]
 */
$.init = function(formSchema) {

    _(formSchema.fields).each(function(step) {
        $.addStep(step);
    })

    submit = formSchema.onSubmit;

};


$.next = $.wizard.next;
$.prev = $.wizard.prev;

//
//  Handle inner controls
// 
//$.add = function(child) {};


$.addStep = function(fields) {
    //Creo la form della singola pagina. L'argomento `child` rappresenta un array di campi come definiti nel widget `form`
    var form = Alloy.createWidget(FORM_WIDGET, {
        fields: fields,
        onSubmit: function(data) {
            //In questa maniera sovrascrivo la funzione `onSubmit` della form con la funzione `next` del wizard. 
            //Gestirò nella configurazione del wizard il processo di validazione
            $.wizard.next();
        }
    });

    //Definisco lo step da aggiungere al wizard
    var stepIndex = $.wizard.stepsCount();
    var stepId = 'step' + stepIndex;
    var step = {
        id: stepIndex,
        view: form.getView(),
        next: function(done, abort) {
            form.validate(function(isValid, errors) {
                console.log('formwizard form.validate', stepId, isValid, errors, stepIndex, $.wizard.stepsCount());
                if (isValid) {
                    var isLast = stepIndex == $.wizard.stepsCount() - 1;
                    if (isLast) {
                        var data = _(forms).reduce(function(memo, e) {
                            return _.extend({}, memo, e.read());
                        }, {});
                        submit && submit(data);
                    } else {
                        done();
                    }

                } else {
                    abort();
                }
            })
        }
    };

    //Aggiungo lo step
    $.wizard.addStep(step);

    //
    forms.push(form);
};



$.applyProperties = function(props) {
    $.wizard.applyProperties(props);
};




/**
 * Constructor function
 * Autoexecuting function which encapsulates every initialization
 * @param  object args arguments passed to the controller
 */
(function constructor(args) {

    $.applyProperties(args);

    //if we use Inner Controls, we need to manually add children 
    // _.each(args.children, function(child) {
    //   $.add(child);
    // });



    //espongo gli eventi
    _(['scroll', 'scrollend']).each(function(e) {
        $.wizard.on(e, function(evt) {
            $.trigger(e, evt);
        });
    });



})(arguments[0] || {});