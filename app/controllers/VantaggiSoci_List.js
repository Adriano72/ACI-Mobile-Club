var utility = require('utility');
var commons = require('commons');

var metaData, collection;


/**
 * Istruzioni da eseguire alla creazione del controller
 * @param  {object} args attributi passati al controller
 */
(function constructor(args) {


    //seleziono la collection corretta dalla quale prendere i dati
    collection = utility.getAciGeoCollection(args.id_code);

    //attributi della UI in base al tipo di convenzione
    metaData = _.findWhere(require('tabulatedData').categorieSyc(), {
        short_name: args.id_code
    });

    //inizializzazioni comuni della Window
    commons.initWindow($.win, metaData.long_name, metaData.img, [{
        icon: "/images/ic_action_pin.png",
        onClick: _(commons.openMapWindow).partial(collection, metaData.long_name, metaData.img, metaData.pin)
    }]);


    //carica i dati
    if (OS_ANDROID) {
        _.defer(loadData);
    } else {
        loadData();
    }

    //
    $.emptyView.getView().visible = false;


    //imposto il distruttore per evitare memory leaks
    $.win.addEventListener('close', function() {
        $.destroy();
    });

})(arguments[0] || {});





/**
 * Funzione che carica i dati nella collection collegata alla tabella
 * @return {[type]} [description]
 */
function loadData() {
    //aggiorna i dati solo se non sono più validi
    Alloy.Globals.loading.show('Stiamo cercando');
    try {
        collection.fetchIfChanged(function(err, cached) {


            var isEmpty = Boolean(collection.length);
            $.puntiAci_Table.visible = isEmpty;
            $.emptyView.getView().visible = !isEmpty;

            Alloy.Collections.tempCollection.reset(collection.models);
            // updateUI();


            Alloy.Globals.loading.hide();
        });

    } catch (e) {
        Alloy.Globals.loading.hide();
        console.log('errore load data', e);
        alert('Si è verificato un errore di connessione');

    }
    $.searchBar.blur();
}


/**
 * Manipolazione dei dati da passare alla lista
 * @param  {[type]} model [description]
 * @return {[type]}       [description]
 */
function dataTransform(model) {
    var attrs = model.toJSON();
    return {
        itemId: model.cid,
        searchableText: attrs.name,
        title: attrs.name,
        thumbnail: attrs.agreement_id.images.logo ? encodeURI(Alloy.Globals.bannerBaseURL + attrs.agreement_id.images.logo) : undefined,
        distance: utility.formatDistance(attrs.address.distance),
        address: attrs.address.street,
        address2: (function() {
            return _(
                    [attrs.address.postalCode, (attrs.address.locality && attrs.address.locality.longName ? attrs.address.locality.longName : undefined)])
                .filter(function(e) {
                    return !!e;
                }).join('');

        })(),
        latitude: attrs.address.location[1],
        longitude: attrs.address.location[0]
    };
};


/**
 * Handler del click di selezione degli elementi della lista
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function onItemClick(e) {
    var item = e.section.getItemAt(e.itemIndex);

    //snippet per cancellare la selezione, altrimenti l'elemento rimarrebbe selezionato quando si torna su questa lista
    function deselectThis() {
        if (OS_IOS) {
            $.puntiAci_Table.deselectItem(e.sectionIndex, e.itemIndex);
        }
    }


    //seleziono l'azione da fare in base al controllo che ho cliccato
    switch (e.bindId) {

        //ho cliccato sul link di navigazione
        case 'directions':
            commons.openNavigation({
                lat: item.directions.lat,
                lon: item.directions.lon
            });
            _(deselectThis).defer();

            break;

            //ho cliccato su qualsiasi altro punto    
        default:
            openDetail(item.properties.itemId);
            _(deselectThis).defer();

    }

}


/**
 * Apre la finestra di dettaglio di un syc a partire dal suo id
 * @param  {string} itemId  id del syc
 */
function openDetail(itemId) {
    var model = Alloy.Collections.tempCollection.getByCid(itemId);
    Alloy.Globals.navMenu.openWindow(Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: model,
        titolo: metaData.long_name,
        headerImg: metaData.img
    }).getView());
}