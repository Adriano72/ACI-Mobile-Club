/**
 * Handle events
 */
var eventHandlers = {};

exports.addEventListener = function(eventName, eventHandler) {
    if (_.isUndefined(eventHandlers[eventName])) {
        eventHandlers[eventName] = [];
    }
    eventHandlers[eventName].push(eventHandler);
};
exports.removeEventListener = function(eventName, eventHandler) {
    var index = _(eventHandlers[eventName]).indexOf(eventHandler);
    if (index > -1) {
        eventHandlers[eventName].splice(index, 1);
    }
};

function fireEvent(name, params) {
    var handlers = eventHandlers[name];
    var self = this;
    _(handlers).each(function(handler) {
        handler.call(self, params);

    });

}




/**
 * functions
 */


/**
 * Builder method per la singola vista di immagine
 * @param  {[type]} args [description]
 * @return Ti.UI.ImageView      l'immagine creata
 */
function createImageItem(image) {

    /*
    return Ti.UI.createImageView({
        image: image,
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE
    });
*/
    return Widget.createController('imageItem', {
        image: image,
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE
    }).getView();

}

/**
 * Builder method per il singolo elemento del paginatore
 * @param  object args array di parametri da passare al costruttore. si aspetta selecte=(true/false) e index
 * @return Alloy.Controller     controller dell'elemento paginatore
 */
function createPagingItem(args) {
    return Widget.createController('pagingItem', args);
}

/**
 * Seleziona la i-esima immagine. Gestisce le immagine come array circolary
 * @param  number index indice dell'immagine da visualizzare
 */
function select(index) {

    var n = $.cover.views.length;
    var next = (index) % n;

    console.log('gallery select ', index, n, next);
    //sposto lo scroller
    $.cover.scrollToView(next);

}

/**
 * Avvia lo slider automatico
 */
function startSlider() {
    if (interval > 0) {
        t = setTimeout(function() {
            console.log('step', currentIndex);
            select(currentIndex + 1);
            startSlider();
        }, interval);
    }
}

/**
 * Ferma lo slider automatico
 */
function stopSlider() {
    clearTimeout(t);
}

/**
 * Resetta e ferma lo slider automatico
 */
function resetSlider() {
    select(0);
    stopSlider();
}


function onScrollend(e) {

    var next = e.currentPage;

    //aggiorno il paginatore
    _(paginator).each(function(p, i) {
        if (i == next) p.select();
        else p.unselect();
    });

    //scatzeno l'evento
    fireEvent('imageChanged', {
        index: next,
        previousIndex: currentIndex
    });

    //aggiorno il puntatore all'immagine selezionata
    currentIndex = next;
}


function setImages(images) {
    console.log('gallery setImages ', images);
    $.cover.removeAllChildren();

    _(images).each(function(e, i) {
        $.cover.addView(createImageItem(e));
    });

    if (images && images.length > 1) {

        //creo il paginatore
        _(images.length).times(function(n) {
            var c = createPagingItem({
                index: n,
                selected: n == currentIndex
            });
            paginator.push(c);
            $.pagingContainer.add(c.getView());
        });


        //se è definito un intervallo, imposto lo scorrimento automatico
        if (interval && interval > 0) {

            startSlider();
        }

        $.pagingContainer.visible = true;
        $.cover.scrollingEnabled = true;

    } else {
        $.pagingContainer.visible = false;
        $.cover.scrollingEnabled = false;

        stopSlider();
    }
}


//indice dell'immagine corrente
var currentIndex = 0;
//puntatore al timeout, nel caso di
var t = null;
//intervallo per lo slider
var interval = -1;
//
var paginator = [];

/**
 * Constructor function
 * Autoexecuting function which encapsulates every initialization
 * @param  object args arguments passed to the controller
 */
(function constructor(args) {
    console.log('gallery args', args);

    interval = args.interval;


    //carico le immagini
    setImages(args.images);



})(arguments[0] || {});


/**
 * PUBLIC API
 */
exports.startSlider = startSlider;
exports.stopSlider = stopSlider;
exports.resetSlider = resetSlider;
exports.select = select;
exports.setImages = setImages;