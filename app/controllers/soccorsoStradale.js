var locationServices = require('locationServices');
var utility = require('utility');
var AciGlobal = require('aciglobal');
var dialogs = require('alloy/dialogs');

var isGuest, user;

var args = arguments[0] || {};

if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};



function doopen(evt) {
    if (OS_ANDROID) {

        init1();


    } else {
        //$.windowtitle.text = winTitle;
        
        //salto l'init del menu
        init3();
    }

    //updateScreen();
}

function init1() {
    //  abx.displayHomeAsUp = true;
    abx.title = "Soccorso Stradale";
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = "#003772";
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();
    _.defer(init3);

}
//init3();//
function init3() {
    

    //
    //controllo lo stato della login
    //

    user = Ti.App.Properties.getObject("datiUtente");
    isGuest = Boolean(!(user && user != {}) && !Ti.App.Properties.getBool("utenteAutenticato"));

    console.log('isGuest', isGuest);
    console.log('user', user);
    if (!isGuest) {

        utility.showVertical($.tipoWrapper);
        $.telefono.value = user['userInfo.mobile'] || user['userInfo.mobileTemp'];

    } else {

        utility.hideVertical($.tipoWrapper);
        $.telefono.value = '';
    }


    //$.tipoAiuto.addEventListener('change', function(e) {
    //    console.log('change', e);
    //});

    //
    //inizializzazione della mappa con la posizione corrente
    //
    $.mapview.addEventListener('complete', function() {
        //la posizione iniziale è quella dell'utente
        locationServices.getUserLocation(function(coo) {
            $.mapview.setRegion({
                latitude: coo.latitude,
                longitude: coo.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
                zoom: 14
            });
        });
    });


    //serve ad evitare il problema che la tastiera viene visualizzata all'apertura
    if (OS_ANDROID) {
        $.telefono.once('focus', function() {
            $.telefono.blur();
        });
    }


    //stato: mostra form
    utility.hideVertical($.rowRichiestaInviata);
    utility.showVertical($.rowForm)
}

/**
 * Apre il telefono per chiamare il numero verde
 * @return {[type]} [description]
 */
function chiamaSoccorso() {
    Titanium.Platform.openURL('tel:' + AciGlobal.NumeroVerde);
}

/**
 * handler per il submit della form
 * @return {[type]} [description]
 */
function submit() {
    if (validate()) {
        dialogs.confirm({
            title: "Conferma richiesta",
            message: "Confermi l'invio della richiesta?",
            yes: "Sì",
            no: "No",
            callback: callAciGlobal
        });
    } else {
        alert("Tutti i dati sono obbligatori");
    }
}


/**
 * esegue la chiamata ai servizi AciGlobal
 * @return {[type]} [description]
 */
function callAciGlobal() {
    console.log('call aci global');

    Alloy.Globals.loading.show('Richiesta in corso');

    AciGlobal.sendRichiestaAssistenza({}, function(err, result) {

        Alloy.Globals.loading.hide();

        if (false && err) {
            console.log('callAciGlobal', err);
            alert('si è verificato un errore nella trasmissione della richiesta');
        } else {
            console.log('callAciGlobal', result);
            renderConferma();
        }


    });

}

function renderConferma() {



    //
    //immette i valori nella schermata
    //

    //orario
    var now = new Date();
    $.richiestaOrario.text = [now.getHours(), now.getMinutes()].join(':');

    //telefono
    $.richiestaTelefono.text = $.telefono.value;

    //indirizzo
    var region = $.mapview.getRegion();
    Alloy.Globals.loading.show('Calcolando indirizzo');
    locationServices.getAddress(region.latitude, region.longitude, function(err, places) {
        Alloy.Globals.loading.hide();

        //   console.log('err', err);
        //   console.log('places', places);
        if (err) {
            //todo: gestire errore reverse geocodinge
        } else {
            var place = places[0];
            var address = [place.street, place.zipcode, place.city].join(', ');
            //     console.log('address', address);
            $.richiestaIndirizzo.text = address;

        }
    });

    //
    //stato: mostra richiesta inviata
    //
    utility.hideVertical($.rowForm)
    utility.showVertical($.rowRichiestaInviata);


}


/**
 * funzione di validazione dei dati prima dell'invio
 * @return {[type]} [description]
 */
function validate() {

    var valid = true;
    if (isGuest) {

        valid = $.telefono.value;

    } else {
        valid = $.tipoAiuto.value && $.telefono.value;

    }


    return valid;

}






//logging, solo per test
/*$.mapview.addEventListener('regionchanged', function(e) {
    console.log('centro mappa: ', $.mapview.getRegion());
});*/