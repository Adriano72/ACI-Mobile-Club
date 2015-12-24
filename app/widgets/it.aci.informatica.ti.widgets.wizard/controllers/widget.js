/**
 * # Wizard
 * Implementa un controllo wizard in cui si possono gestire percorsi condizionali attraverso i vari step.
 * Gli step vengono passati al widget che li conserva nella variabile scaffold `steps`. Vengono poi aggiunti di volta in volta allo stack e renderizzati nella UI.
 * Ogni `step` è definito come:
 *
 * - `id`: nome univoco dello step, serve per navigare da uno step all'altro
 * - `view`: controllo `Ti.UI.View` da renderizzare
 * - `next`: se `String`, identifica l'`id` del prossimo step da visualizzare. Se `Function`, è una funzione nella forma `function(done, abort)` dove:
 *     - `done`: callback da chiamare in caso si voglia effettivamente passare allo step successivo. Accetta l'`id` dello step successivo come parametro.
 *     - `abort`: callback da chiamare in caso si voglia bloccare il passaggio allo step successivo.
 *
 */

//Il dizionario step definiti per questo wizard
var steps = [];
//Lo stack di step effettivamente utilizzati
var stack = [];

function onScrollOnce(fn) {
    var wrap = _(fn).wrap(function(f) {
        $.stepsScroller.removeEventListener('scrollend', wrap);
        var args = Array.prototype.slice.call(arguments).splice(1);
        f.apply(this, args);
    });
    $.stepsScroller.addEventListener('scrollend', wrap);
}


function goNext(stepId, cb) {
    //console.log('wizard goNext', stepId);

    //individuo lo step in base all'`id`
    var step;
    //- se `stepId` è definito
    if (stepId) {
        //console.log('wizard goNext case 1');
        step = _(steps).findWhere({
            id: stepId
        });
    }
    //- altrimenti considero lo step successivo 
    else if (stack.length) {
        //console.log('wizard goNext case 2');
        var currentStep = stack[stack.length - 1];
        //console.log('goNext !stepId', stack.length, currentStep, stepId);
        var naturalIndex = _(steps).chain().map(function(e) {
            return e.id;
        }).indexOf(currentStep.id).value();

        step = steps[naturalIndex + 1];
    }
    //- se invece è il primo step (stack vuoto), considero il primo step nella lista
    else {
        //console.log('wizard goNext case 3');
        step = _(steps).findWhere({
            first: true
        }) || steps[0];
    }




    //Se il pannello è già nello stack, lo tolgo
    var indexInStack = _(stack).chain()
        .map(function(e) {
            return e.id;
        })
        .indexOf(stepId)
        .value();
    if (indexInStack >= 0) {
        //console.log('goNext', stepId, indexInStack, stack);
        stack.splice(indexInStack, 1);
        //console.log('goNext', stepId, indexInStack, stack);

        $.stepsScroller.removeView(indexInStack);
    }

    //Se lo step esiste, lo aggiungo
    if (step && step.view) {
        //aggiungo la view allo scroller
        $.stepsScroller.addView(step.view);
        //aggiungo lo step allo stack
        stack.push(step);
        //muovo verso il nuovo step
        $.stepsScroller.scrollToView(stack.length - 1);

        cb && cb(null);
    }
    //altrimenti ritorno un errore
    else {
        cb && cb('Impossibile passare allo step ' + stepId);
    }
}

function goPrev(cb) {
    //console.log('goPrev', stack.length, $.stepsScroller.views.length);


    //gestisco la fine dello scroll tramite un evento di tipo once
    onScrollOnce(function(e) {
        //console.log('goPrev onScrollOnce', e);
        //tolgo lo step dallo stack
        var currentStep = stack.pop();
        //rimuovo la vista dallo scroller
        _.defer(function() {
            $.stepsScroller.removeView(currentStep.view)
        });

        //finalizzo    
        cb && cb(null);
    });


    //scrollo all'indietro di 1 step
    $.stepsScroller.scrollToView(stack.length - 2);



}


/**
 * ### next
 * Passa allo step specificato. Uso una callback per comunciare la fine dell'operazione per gestire eventualy animazioni e delay dell'interfaccia.
 * @param {string} stepId id dello step da visualizzare
 * @param {Function} cb callback di fine operazione nella forma function(err)
 */
$.next = function(cb) {

    if (!_.isFunction(cb)) cb = null;

    //console.log('wizard next', cb);
    var currentStep = stack[stack.length - 1];
    //console.log('wizard next ', currentStep, stack);

    //Controllo il tipo di `next`:
    // - Se stringa, è l'id del prossimo step
    if (_.isString(currentStep.next)) {
        //console.log('wizard next 1');
        goNext(currentStep.next, cb);
    }
    // - Se function, è una callback
    else if (_.isFunction(currentStep.next)) {
        //console.log('wizard next 2');
        currentStep.next(
            //callback di successo. `nextStepId` è l'`id` del prossimo step
            function done(nextStepId) {
                goNext(nextStepId, cb);
            },
            //callback di abort, blocca il passaggio al prossimo step
            function abort() {
                cb && cb('aborted');
            }
        );
    }
    // - Se number, è l'indice dello step nell'ordine con cui sono stati passati al wizard
    else if (_.isNumber(currentStep.next)) {
        //console.log('wizard next 3');
        if (currentStep.next < steps.length && currentStep.next >= 0) {
            goNext(steps[currentStep.next].id, cb);
        } else {
            cb && cb('Impossibile passare allo step di indice ' + currentStep.next);
        }
    }
    // - Qualsiasi altro valore (compreso `undefined`) viene considerato come il prossimo step nell'ordine con cui vengono passati al wizard
    else {
        //console.log('wizard next 4', currentStep.next);
        var naturalIndex = _(steps).chain().map(function(e) {
            return e.id;
        }).indexOf(currentStep.id).value();

        var nextStep = steps[naturalIndex + 1];
        //console.log('wizard nextStep', nextStep, !!nextStep);
        if (nextStep) {
            goNext(nextStep.id, cb);
        } else {
            cb && cb('Impossibile passare allo step di indice ' + nextStep.id);
        }

    }
}


$.prev = function(cb) {

    var currentStep = stack[stack.length - 1];


    //Controllo il tipo di `prev`:

    // - Se Function, 
    if (_.isFunction(currentStep.prev)) {
        currentStep.prev(
            //callback di successo.
            function done() {
                goPrev(cb);
            },
            //callback di abort, blocca il passaggio al precedente step
            function abort() {

                cb && cb(null);
            }
        );
    }
    // - Qualsiasi altro valore (compreso `undefined`) eseguo il comportamento di default
    else {
        //Se è l'unico step nello stack, non posso fare nulla
        if (stack.length <= 1) {
            cb && cb('Impossibile andare indietro, è l\'unico step attivo');
        }
        //Altrimenti, eseguo il back
        else {
            goPrev(cb);
        }
    }
};


$.addStep = function(step) {
    steps.push(step);
    if (stack.length == 0) {
        //console.log('wizard addStep first', step.id, step);
        goNext(step.id);
    }
};

$.addSteps = function(stepList) {
    _(stepList).each($.addStep);
};

$.removeStep = function(stepId) {
    var index = _(steps).chain()
        .map(function(e) {
            return e.id;
        })
        .indexOf(stepId)
        .value();
}

//
//  Handle inner controls
// 
$.add = function(stepView) {
    //inferisco i dati dello step direttamente dalla view
    $.addStep({
        view: stepView,
        id: stepView.stepId,
        next: stepView.next,
        prev: stepView.prev
    });
}

$.applyProperties = function(props) {
    $.stepsScroller.applyProperties(props);
};
// $.remove = $.content.remove;
// $.applyProperties = $.content.applyProperties;


$.stepsCount = function() {
    return steps.length;
};




/**
 * Constructor function
 * Autoexecuting function which encapsulates every initialization
 * @param  object args arguments passed to the controller
 */
(function constructor(args) {


    $.applyProperties(args);

    //if we use Inner Controls, we need to manually add children 
    _.each(args.children, function(child) {
        $.add(child);
    });

    //espongo gli eventi
    _(['scroll', 'scrollend']).each(function(e) {
        $.stepsScroller.addEventListener(e, function(evt) {
            $.trigger(e, evt);
        });
    });


})(arguments[0] || {});