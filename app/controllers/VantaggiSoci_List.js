var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');


//selezioni la collection corretta dalla quale prendere i dati
var collection = utility.getAciGeoCollection(args.id_code);
//attributi della UI in base al tipo di convenzione
var itemData = _.findWhere(require('tabulatedData').categorieSyc(), {
    short_name: args.id_code
});


//Handler per l'apertura del navigatore
var openNavigation = commons.openNavigation;


//inizializzazioni comuni della Window
commons.initWindow($.win, itemData.long_name, itemData.img, [{
    icon: "/images/ic_action_pin.png",
    onClick: _(commons.openMapWindow).partial(collection, itemData.long_name, itemData.img, itemData.pin)
}]);

//carica i dati
loadData();







/**
 * Funzione che carica i dati nella collection collegata alla tabella
 * @return {[type]} [description]
 */
function loadData() {
    //aggiorna i dati solo se non sono più validi
    Alloy.Globals.loading.show('Stiamo cercando');
    try {
        collection.fetchIfChanged(function(err, cached) {
            Alloy.Collections.tempCollection.reset(collection.models);
            updateUI();
            Alloy.Globals.loading.hide();
        });
    } catch (e) {
        Alloy.Globals.loading.hide();
        alert('Si è verificato un errore di connessione');

    }
    $.searchBar.blur();
}

function dataTransform(model) {
    var attrs = model.toJSON();
    //Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
    attrs.indirizzo = attrs.address.street;
    attrs.distance = utility.formatDistance(attrs.address.distance);

    attrs.indirizzo2 = (function() {
        var i = [];
        i.push((attrs.address.postalCode || ''));
        i.push(attrs.address.locality && attrs.address.locality.longName ? attrs.address.locality.longName : '');
        return i.join('');

    })();

    attrs.latitude = attrs.address.location[1];
    attrs.latitude = attrs.address.location[1];
    attrs.longitude = attrs.address.location[0];
    attrs.tel = attrs.contacts.tel[0];
    attrs.email = attrs.contacts.email[0];
    if (attrs.agreement_id.images) {
        attrs.immagine = encodeURI(Alloy.Globals.bannerBaseURL + attrs.agreement_id.images.logo);
    }
    attrs.id = model.cid;
    return attrs;
};

function dettaglioConvenzione(e) {
    if (e.rowData) {
        var selectedConv = Alloy.Collections.tempCollection.getByCid(e.rowData.modelId);

        var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
            data: selectedConv,
            titolo: itemData.long_name,
            headerImg: itemData.img
        }).getView();
        Alloy.Globals.navMenu.openWindow(dettConvenzione);
    }
}



$.win.addEventListener('close', function() {
    $.destroy();
});