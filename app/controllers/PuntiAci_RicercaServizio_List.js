var args = arguments[0] || {};

var net = require('network');
var utility = require('utility');

console.log("data ", args.data);
console.log("gic ", args.data.gic);
var gic = args.data.gic;
var fuoriGIC = args.data.fuoriGIC;

//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.delegazioni));
if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};
 $.searchBar.focus();
function loadData() {
    //Alloy.Collections.automobileClub.fetch();
    if (OS_ANDROID) {

        init1();

        //actionBarHelper.setIcon('/drawericonw@2x.png');

    } else {
        //$.windowtitle.text = winTitle;
    }
   

}


function filterRows(collection) {
    console.log('length', collection.models.length);
    if (collection.models.length === 0) {
        $.noResults.visible = true;
        $.puntiAci_Table.visible = false;
    } else {
        $.noResults.visible = false;
        $.puntiAci_Table.visible = true;

    }
    return collection.models;
}


function init1() {
    abx.displayHomeAsUp = true;
    abx.title = "Ricerca per Servizio";
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = Alloy.Globals.palette.blu;
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();
}


function init3() {
    //leggo i dati dal server e li carico in tabella
    Alloy.Globals.loading.show('Stiamo cercando i Punti ACI');
    net.getPuntiAciPerServizioGIC(gic, fuoriGIC, function(result) {
        Alloy.Collections.serviziGICpos.reset(result);
        updateUI();
        Alloy.Globals.loading.hide();
        console.log("punto aci", result[0]);
    });
}

function dataTransform(model) {
    var attrs = model.toJSON();
    //console.log("attrs", attrs);
    //Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
    attrs.distance = utility.formatDistance(attrs.address.distance);
    attrs.indirizzo = attrs.address.street;
    var ind2 = (attrs.address.postalCode || '') + ' ' + (attrs.address.locality.longName || '');
    attrs.indirizzo2 = ind2 == 'undefined' ? '' : ind2;
    attrs.latitude = attrs.address.location[1];
    attrs.longitude = attrs.address.location[0];
    attrs.tel = attrs.contacts.tel[0];
    attrs.email = attrs.contacts.email[0];
    attrs.id = model.cid;
    attrs.mongoId = attrs._id; //id di mongo

    //Ti.API.info("MODEL CID: "+attrs.id);
    return attrs;
};

function openNavigation(e) {
    e.cancelBubble = true;
    require('locationServices').getUserLocation(function(userLoc) {
        var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
        Ti.API.info("NAVIGATION DATA: " + e.source.lat + " " + e.source.lon + " " + userLoc.latitude + " " + userLoc.longitude);
        Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + e.source.lat + ',' + e.source.lon);
    });

}

function doPhoneCall(e) {
    e.cancelBubble = true;

    if (modelGot.contacts.tel[0]) {
        var trimmedPhone = modelGot.contacts.tel[0].replace(/\s+/g, '');
        Ti.API.info("TEL: " + trimmedPhone);
        Titanium.Platform.openURL('tel:' + trimmedPhone);
    } else {
        alert("Numero di telefono non disponibile");
    }

};

function doSendEmail(e) {
    e.cancelBubble = true;
    //console.log("doSendEmail e", e);
    if (e.source.indirizzoEmail) {
        Ti.API.info("EMAIL: " + e.source.indirizzoEmail);
        var recipients = [];
        recipients.push(e.source.indirizzoEmail);
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.toRecipients = recipients;
        emailDialog.open();
    } else {
        alert("Indirizzo email non disponibile");
    }
};


function openDetail(e) {
    console.log("e", e);

    //tipo
    var t = e.row.type;

    //dizionario dei dettagli
    var d = {
        'del': 'PuntiAci_DEL_Dett_Lite',
        'aacc': 'PuntiAci_AC_Dett',
        'pra': 'PuntiAci_PRA_Dett',
        'tasse': 'PuntiAci_TASSE_Dett'
    };
    //dizionario delle collection
    var c = {
        'del': 'delegazioni',
        'aacc': 'automobileClub',
        'pra': 'pra',
        'tasse': 'tasse'
    };

    //dati dell'elemento selezionato
    //var selected = Alloy.Collections.delegazioni.get(e.rowData.modelId);
    //devo selezionarlo tramite l'id di mongo perchè fa riferimento a collezioni deverse

    var selected = Alloy.Collections.delegazioni.where({
        "_id": e.rowData.mongoId //"54c23de75aed06a61b19e8c5"
    })[0];
    //controller name
    var ctrl = d[t];
    console.log("ctrl", ctrl);
    // console.log("selected", selected.toJSON());

    var w = Alloy.createController(ctrl, {
        data: selected
    }).getView();
    Alloy.Globals.navMenu.openWindow(w);
}



function mostraMappa() {
    var coll = Alloy.Collections.serviziGICpos.toJSON();
    console.log("coll", coll);
    var mapWin = Alloy.createController('mapView', {
        collection: coll,
        //pin: "pin_Tasse.png",
        titolo: (OS_ANDROID) ? "Tasse" : $.titleControl.backgroundImage,
        //  homeIcon: "ico_assistenza_tasse_blu.png"
    }).getView();
    Alloy.Globals.navMenu.openWindow(mapWin);
};


_.defer(init3);