var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');


//selezioni la collection corretta dalla quale prendere i dati
var collection = utility.getAciGeoCollection(args.id_code);
//attributi della UI in base al tipo di convenzione
console.log('PuntiAci_List args', args);
var itemData = _.findWhere(require('tabulatedData').puntiAciMain(), {
    id_code: args.id_code
});


//Handler per l'apertura del navigatore
var openNavigation = commons.openNavigation;
//Handler per la telefonata
var doPhoneCall = commons.doPhoneCall;
//Handler per l'invio email
var doSendEmail = commons.doSendEmail;


//inizializzazioni comuni della Window
commons.initWindow($.win, itemData.text, itemData.img, [{
    icon: "/images/ic_action_pin.png",
    onClick: _(commons.openMapWindow).partial(collection, itemData.text, itemData.img, itemData.pin)
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
        console.log('error fetch', e);

    }
    $.searchBar.blur();
}

var xx = 0;

function dataTransform(model) {
    var attrs = model.toJSON();
    //Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));

    attrs.distance = utility.formatDistance(attrs.address.distance);
    attrs.indirizzo = attrs.address.street;
    var ind2 = (attrs.address.postalCode || '') + ' ' + (attrs.address.locality.longName || '');

    attrs.indirizzo2 = ind2.trim(); // attrs.address.postalCode ;//+ " " + attrs.address.locality.longName;
    attrs.latitude = attrs.address.location[1];
    attrs.longitude = attrs.address.location[0];
    attrs.tel = attrs.contacts.tel[0];
    attrs.email = attrs.contacts.email[0];
    attrs.id = model.cid;
    console.log('dt');

    //Ti.API.info("MODEL CID: "+attrs.id);
    //console.log('dataTransform', attrs);
    console.log('dataTransform', xx++);
    return attrs;
};

function openDetail(e) {
    if (e.rowData) {
        var selectedConv = Alloy.Collections.tempCollection.getByCid(e.rowData.modelId);

        var dettConvenzione = Alloy.createController('PuntiAci_Detail', {
            data: selectedConv,
            titolo: itemData.text,
            headerImg: itemData.img
        }).getView();
        Alloy.Globals.navMenu.openWindow(dettConvenzione);
    }
}



$.win.addEventListener('close', function() {
    $.destroy();
});