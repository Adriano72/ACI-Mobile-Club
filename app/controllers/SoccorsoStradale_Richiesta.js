var locationServices = require('locationServices');
var commons = require('commons');
var utility = require('utility');
var AciGlobal = require('aciglobal');
var dialogs = require('alloy/dialogs');
var user = require('user');

var isGuest = !user.isLogged;
var userData = user.getCurrentUser();
var currentAddress;

/**
 * Inizializza la mappa
 */
function initMap() {


    $.mapview.addEventListener('complete', function onMapComplete() {
        //la posizione iniziale è quella dell'utente
        locationServices.getUserLocation(function(err, coo) {
            if (err) {
                console.log('getUserLocation err', err);
            } else {
                console.log('getUserLocation coo', coo);
                console.log('getUserLocation last', locationServices.getLastLocation());


                $.mapview.setRegion({
                    latitude: coo.latitude,
                    longitude: coo.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                    zoom: 14
                });

                //  updateAddress(coo.latitude, coo.longitude, coo.accuracy);

            }
        });


    });

}



/**
 * handler per il submit della form
 * @return {[type]} [description]
 */
function submit() {

    var fake = ENV_DEV;

    var cb = fake ? renderConferma : function() {
        AciGlobal.limitRequests('La tua richiesta è già stata inviata per qualunque altro problema contatta la centrale operativa al numero ' + AciGlobal.NumeroVerde + '.', callAciGlobal);
    };

    validate(function(err) {
        if (err) {
            alert(err.join('\n'));

        } else {
            dialogs.confirm({
                title: "Conferma richiesta",
                message: "Confermi l'invio della richiesta?",
                yes: "Sì",
                no: "No",
                callback: cb
            });
        }
    });
}



/**
 * esegue la chiamata ai servizi AciGlobal
 * @return {[type]} [description]
 */
function callAciGlobal() {
    console.log('call aci global');

    Alloy.Globals.loading.show('Richiesta in corso');

    var params = {
        telefono: $.telefono.value,
        latitude: $.mapview.getRegion().latitude,
        longitude: $.mapview.getRegion().longitude
    };

    // console.log('isGuest ', isGuest);

    if (!isGuest) {
        params = _.extend(params, {
            nome: userData['userInfo.name'],
            cognome: userData['userInfo.surname'],
            tesseraACI: userData['userInfo.numeroTessera'],
            note: 'tipo: ' + $.tipoAiuto.value
        });
    }

    console.log("params ", params);

    AciGlobal.sendRichiestaAssistenza(params, function(err, result) {

        Alloy.Globals.loading.hide();

        if (err) {
            console.log('callAciGlobal', err);
            alert('si è verificato un errore nella trasmissione della richiesta');
        } else {
            console.log('callAciGlobal', result);
            renderConferma();
        }


    });

}

/**
 * Gestisce la visualizzazione dei componeneti della form
 * @return {[type]} [description]
 */
function renderForm() {


    if (!isGuest) {

        //utility.showVertical($.tipoWrapper);
        $.telefono.value = userData['userInfo.mobile'] || userData['userInfo.mobileTemp'];
        $.tipoAiuto.value = 'auto';

    } else {

        // utility.hideVertical($.tipoWrapper);
        $.telefono.value = '';

    }



    //serve ad evitare il problema che la tastiera viene visualizzata all'apertura
    if (OS_ANDROID) {
        $.telefono.once('focus', function() {
            $.telefono.blur();
            setScrollOnFocus();
        });
    } else {
        setScrollOnFocus();
    }

    function setScrollOnFocus() {
        /*  $.telefono.addEventListener('focus', function() {
            $.main.scrollToBottom();
        }); */
    }



    //stato: mostra form
    utility.hideVertical($.responseWrapper);
    utility.showVertical($.formWrapper)

}


/*
 * Gestisce la visualizzazione della schermata di conferma dopo l'invio della segnalazione
 * @return {[type]} [description]
 */

function renderConferma() {



    //
    //immette i valori nella schermata
    //

    //orario
    var now = new Date();
    //  $.richiestaOrario.text = [now.getHours(), now.getMinutes()].join(':');
    $.responseTime.text = formatOrario(now);
    $.responsePhone.text = $.telefono.value;
    $.responseAddress.text = currentAddress;


    //
    //stato: mostra richiesta inviata
    //
    utility.hideVertical($.formWrapper)
    utility.showVertical($.responseWrapper);


}


function formatOrario(d) {
    console.log('formatOrario', d);
    return [utility.padLeft(d.getHours(), '0', 2), utility.padLeft(d.getMinutes(), '0', 2)].join(':');
}

/**
 * funzione di validazione dei dati prima dell'invio
 * @return {[type]} [description]
 */
function validate(cb) {

    var err = [];

    var telefono = $.telefono.value.trim();
    var tipo = $.tipoAiuto.value;

    function validateTelefono(t) {
        var r = /^((00|\+)39)*([0-9]{10})$/;
        return r.test(t);
    }


    if (!telefono || (!isGuest && !tipo)) {
        err.push('Tutti i campi sono obbligatori');

    }


    if (telefono && !validateTelefono(telefono)) {
        err.push('Formato telefono non valido, utilizzare solo cifre.');
    }

    if (err.length) {
        cb && cb(err);
    } else {
        cb && cb();
    }

}


/**
 * Trigger per forzare il cambio di posizione
 */
function updatePosition() {
    var coo = locationServices.getLastLocation();
    // console.log('updatePosition', coo);

    //   console.log('updatePosition lat', coo.latitude);
    locationServices.getAddress(coo.latitude, coo.longitude, function(err, places, place) {

        if (err) {
            console.log('getAddress err', err);
        } else {
            console.log('getAddress places', places);
            currentAddress = place;
            $.address.text = place + ' (precisione ' + coo.accuracy + 'm)';

        }
    });
};


function canvasClick(e) {
    console.log(e);
    if (e.source !== $.telefono) {
        $.telefono.blur();
    }
}

function onLocation(e) {
    //   console.log('onLocation', e);
    updatePosition();
}

/**
 * ### open
 * hadler dell'evento Window.open
 * @return {[type]} [description]
 */
function open() {
    locationServices.getUserLocation(function() {
        Ti.Geolocation.addEventListener('location', onLocation);
    });
}

/**
 * ### close
 * hadler dell'evento Window.close
 * @return {[type]} [description]
 */
function close() {
    Ti.Geolocation.removeEventListener('location', onLocation);
    $.destroy();
}


/**
 * ### Constructor
 */
(function constructor(args) {

    //inizializzazioni comuni della Window
    var headerText = "Assistenza";
    var headerImg = "/images/ic_action_home_assistenza_blu.png";
    commons.initWindow($.win, headerText, headerImg);

    //inizializzazione mappa
    initMap();

    //renderizzazioni di avvio
    renderForm();

   

    //associo a mano l'evento click sul pulsante di submit
    $.btInvia.addEventListener('click', submit);

})(arguments[0] || {});