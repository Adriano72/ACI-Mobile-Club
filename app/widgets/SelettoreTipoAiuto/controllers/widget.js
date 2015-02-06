var args = arguments[0] || {};

var user = require('user');
var utility = require('utility');


var userInfo = user.getCurrentUser();

//controllo attualmente selezionato
var current;

//lista di possibili valori
var values = ['casa', 'auto', 'persone'];

/**
 * Inizializzazioni
 * @return {[type]} [description]
 */
function init() {
    for (var i = 0; i < values.length; i++) {
        initItem(values[i]);
    };
}


function isEnabled(tipo) {

    var ass = utility.getTesseraAssitenza(userInfo['userInfo.categoriaTessera']);
    console.log("ass", ass);
    return _.indexOf(ass, tipo) >= 0;
}

function onNotEnabled() {
    alert('la tua tessera non comprende questo tipo si assistenza');
}

/**
 * Inizializzazioni per il singolo elemento
 * @param  {[type]} tipo [description]
 * @return {[type]}      [description]
 */
function initItem(tipo) {
    loadImage(tipo);
    switchOff(tipo);
}

/**
 * Routine generica che si occupa di selezionare un elemento
 * @param  {string|number} next il valore che identifica il prossimo elemento da selezionare. se numerico, esprime l'indice dell'elemento, se stringa esprime il valore da inserire
 */
function select(next) {
    console.log('select ', next);

    if (isEnabled(next)) {

        var value;
        if (_.isNumber(next) && values.length >= next) {
            value = values[next];
        } else if (_.indexOf(values, next) >= 0) {
            value = next;
        } else {
            console.log('Widget SelettoreTipoAiuto select - valore non trovato: ', next);
            clear();
            return;
        }

        //deseleziona il precedente, se esiste
        current && switchOff(current);

        switchOn(value);


        fireEvent('change', {
            prev: current,
            value: value
        });


        current = value;
    } else {
        onNotEnabled();
    }
}


/**
 * Wrapper di selezione per l'elemento 'casa'
 */
function selectCasa() {
    select('casa');
}

/**
 * Wrapper di selezione per l'elemento 'auto'
 */
function selectAuto() {
    select('auto');
}

/**
 * Wrapper di selezione per l'elemento 'persone'
 */
function selectPersone() {
    select('persone');
}


/**
 * Funzione generica che esegue le modifiche UI dopo che si è selezionato un elemento
 * @param  {string} next il valore che identifica il prossimo elemento da selezionare
 */
function switchOn(tipo) {
    console.log('on tipo', tipo);
    $[tipo + 'ImageOn'].visible = true;
    $[tipo + 'ImageOff'].visible = false;
    $[tipo + 'Label'].color = args.highlightColor;
}


/**
 * Funzione generica che esegue le modifiche UI dopo che si è selezionato un altro elemento
 * @param  {string} next il valore che identifica il prossimo elemento da de-selezionare
 */
function switchOff(tipo) {
    console.log('off tipo', tipo);

    $[tipo + 'ImageOn'].visible = false;
    $[tipo + 'ImageOff'].visible = true;
    $[tipo + 'Label'].color = args.color;
}

/**
 * Questa routine serve per assegnare le immagini corrette alle imageview
 * http://docs.appcelerator.com/titanium/3.0/#!/guide/Alloy_Widgets-section-35621514_AlloyWidgets-CreatingWidgets
 * @param  {[type]} tipo [description]
 */
function loadImage(tipo) {
    $[tipo + 'ImageOn'].image = WPATH(tipo + '_on.png');
    $[tipo + 'ImageOff'].image = WPATH(tipo + '_off.png');

}


/**
 * deseleziona tutti gli elementi
 * @return {[type]} [description]
 */
function clear() {
    current = undefined;

    for (var i = 0; i < values.length; i++) {
        switchOff(values[i]);
    };

}


/**
 * Esporta come proprietà pubblica
 */
Object.defineProperty($, 'value', {
    /**
     * Ritorna il valore dell'elemento selezionato (undefined se nulla è selezionato)
     * @return {[type]} [description]
     */
    get: function() {
        return current;
    },

    /**
     * Imposta il valore e seleziona l'elemento corrispondente
     * @param {string|number} x se numerico, esprime l'indice dell'elemento, se stringa esprime il valore da inserire
     */
    set: function(x) {

        select(x);
    }
});


/**
 * UI Event handling
 */
$.casaWrapper.addEventListener('click', selectCasa);
$.autoWrapper.addEventListener('click', selectAuto);
$.personeWrapper.addEventListener('click', selectPersone);


/**
 * GESTIONE CUSTOM DEGLI EVENTI PER IL WIDGET
 */


/**
 * Scaffold degli eventi
 * @type {Object}
 */
var eventHandlers = {};

/**
 * Bridge per gli eventi interni al widget
 * http://www.slideshare.net/MartinHudson1/ticonfeu
 * @param {string} eventName    evento da collegaro
 * @param {Function} eventHandler handler dell'evento
 */
exports.addEventListener = function(eventName, eventHandler) {
    eventHandlers[eventName] = eventHandler;
};

/**
 * Custom fire event function
 * @param  {[type]} name    [description]
 * @param  {[type]} context [description]
 * @param  {[type]} params  [description]
 * @return {[type]}         [description]
 */
function fireEvent(name, params) {
    var c = this;
    var h = eventHandlers[name];
    console.log('call: ' + name);
    if (h) return h.call(this, params);
    return h;
}



//run init
init();