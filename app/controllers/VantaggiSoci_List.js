var args = arguments[0] || {};
var utility = require('utility');

/*
args.id_code
*/

var collection = utility.getAciGeoCollection(args.id_code);
var itemData = _.findWhere(require('tabulatedData').categorieSyc(), {
    short_name: args.id_code
});


if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};

function openWin() {
    if (OS_ANDROID) {


        console.log('itemData.img', itemData.img);
        init1();



    } else {

        $.titleIcon.image = itemData.img;
        $.titleLabel.text = itemData.long_name;
    }

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

function init1() {
    abx.displayHomeAsUp = false;
    // abx.disableIcon = false;
    console.log('itemData.img', itemData.img);
    //abx.homeAsUpIcon = itemData.img;
    abx.setDisableIcon(false);
    abx.setHomeAsUpIcon(itemData.img);
    abx.title = itemData.long_name,
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = Alloy.Globals.palette.blu;
    _.defer(init2);
}

function init2() {

    var activity = $.win.activity;


    if (activity) {
        activity.invalidateOptionsMenu();
        activity.onCreateOptionsMenu = function(e) {
            activity.actionBar.displayHomeAsUp = true;
            abx.setHomeAsUpIcon(itemData.img);
        }
    }
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
    attrs.immagine = encodeURI(Alloy.Globals.bannerBaseURL + attrs.agreement_id.images.logo);
    attrs.id = model.cid;
    return attrs;
};

function dettaglioConvenzione(e) {
    var selectedConv = Alloy.Collections.tempCollection.getByCid(e.rowData.modelId);

    var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: selectedConv,
        titolo: itemData.long_name,
        headerImg: itemData.img
    }).getView();
    Alloy.Globals.navMenu.openWindow(dettConvenzione);
}


function openNavigation(e) {

    require('locationServices').getUserLocation(function(userLoc) {
        var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
        Ti.API.info("NAVIGATION DATA: " + e.source.lat + " " + e.source.lon + " " + userLoc.latitude + " " + userLoc.longitude);
        Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + e.source.lat + ',' + e.source.lon);
    });

};

function mostraMappa() {

    var mapWin = Alloy.createController('mapView', {
        collection: Alloy.Collections.tempCollection.toJSON(),
        // pin: "pin_CulturaSpettacoli.png",
        titolo: itemData.long_name,
        homeIcon: itemData.img,
        pin: itemData.pin

    }).getView();
    Alloy.Globals.navMenu.openWindow(mapWin);
};

function togglePreferiti(e) {

};

function openDettagli(e) {

};



$.win.addEventListener('close', function() {
    $.destroy();
});