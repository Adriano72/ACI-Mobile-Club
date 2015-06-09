var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');

var images = {};


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

$.emptyView.getView().visible = false;
//carica i dati
if (OS_ANDROID) {
    _.defer(loadData);
} else {
    loadData();
}





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
            updateUI();

            // setTimeout(function(e) {
            console.log('controllo uodateUI', $.puntiAci_Table.data);
            var sect = $.puntiAci_Table.data[0];
            console.log('images', images);
            if (sect) {
                console.log('righe', sect.rows);
                _(sect.rows).each(function(row) {
                    console.log('row id', row.modelId);
                    console.log('row image', images[row.modelId]);
                    var logoImg = row.getChildren()[0].getChildren()[0].getChildren()[0];
                    console.log('row logoImg', logoImg);
                    logoImg.image = images[row.modelId];
                });
            }

            //  }, 3000) 

            Alloy.Globals.loading.hide();
        });
    } catch (e) {
        Alloy.Globals.loading.hide();
        console.log('errore load data', e);
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
        return i.join(' ');

    })();

    attrs.latitude = attrs.address.location[1];
    attrs.latitude = attrs.address.location[1];
    attrs.longitude = attrs.address.location[0];
    attrs.tel = attrs.contacts.tel[0];
    attrs.email = attrs.contacts.email[0];
    attrs.id = model.cid;

    if (attrs.agreement_id.images) {
        //   attrs.immagine = encodeURI(Alloy.Globals.bannerBaseURL + attrs.agreement_id.images.logo);
        var id = attrs.id;
        var img = encodeURI(Alloy.Globals.bannerBaseURL + attrs.agreement_id.images.logo);
        console.log('modelId', id);
        console.log('image', img);
        console.log('images', images);
        images[id] = img;

    }
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