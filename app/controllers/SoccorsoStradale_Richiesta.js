var locationServices = require('locationServices');
var commons = require('commons');
var utility = require('utility');
var AciGlobal = require('aciglobal');
var dialogs = require('alloy/dialogs');
var user = require('user');

var isGuest, userData;

/**
 * FORMATO UTENTE
 * {
    "userInfo.provincia": "RM",
    "userInfo.numeroTessera": "AC900932465",
    "userInfo.dataNascita": "1960-12-02",
    "userInfo.mobile": "3289769508",
    "userInfo.codiceFiscale": "CHRMSM60T02H501G",
    "userInfo.emailTemp": "M.CHIERCHINI@INFORMATICA.ACI.IT",
    "userInfo.surname": "CHIERCHINI",
    "userInfo.tipoTessera": "I",
    "userInfo.user": "MCHIERCH",
    "userInfo.categoriaTessera": "CLO",
    "userInfo.newsletteraci": "",
    "userInfo.email": "M.CHIERCHINI@INFORMATICA.ACI.IT",
    "userInfo.note": "",
    "userInfo.dataScadenza": "2015/12/31",
    "userInfo.sesso": "M",
    "userInfo.newsletter3rdparty": "",
    "userInfo.name": "MASSIMO",
    "userInfo.tessera": "AC900932465",
    "userInfo.mobileTemp": "3289769508",
    "userInfo.citta": "ROMA"
}

 * 
 */

var args = arguments[0] || {};

var headerText = "Assistenza";
var headerImg = "/images/ic_action_home_assistenza_blu.png";

//inizializzazioni comuni della Window
commons.initWindow($.win, headerText, headerImg);


//carica i dati
loadData();



function loadData() {


    //
    //controllo lo stato della login
    //

    userData = user.getCurrentUser();
    isGuest = !user.isLogged; //Boolean(!(user && userData != {}) && !Ti.App.Properties.getBool("utenteAutenticato"));

    console.log('isGuest', isGuest);
    console.log('user', userData);
    if (!isGuest) {

        utility.showVertical($.tipoWrapper);
        $.telefono.value = userData['userInfo.mobile'] || userData['userInfo.mobileTemp'];
        $.tipoAiuto.value = 'auto';

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
            setScrollOnFocus();
        });
    } else {
        setScrollOnFocus();
    }

    function setScrollOnFocus() {
        $.telefono.addEventListener('focus', function() {
            $.main.scrollToBottom();
        });
    }



    //stato: mostra form
    utility.hideVertical($.rowRichiestaInviata);
    utility.showVertical($.rowForm)

    _.defer(loadMap);
}

function loadMap() {


    var region = $.mapview.getRegion();
    console.log('region', region);

    if (region) {
        locationServices.getAddress(region.latitude, region.longitude, function(err, places) {


            //   console.log('err', err);
            //   console.log('places', places);
            if (err) {
                //todo: gestire errore reverse geocodinge
            } else {
                var place = places[0];
                var address = [place.street, place.zipcode, place.city].join(', ');
                //     console.log('address', address);
                $.labelMap.text = address;

            }
        });
    } else {
        //nel caso in cui la mappa non sia pronta
       

    }

    var t;
    $.mapview.addEventListener('regionchanged', function(e) {

        clearTimeout(t)
        setTimeout(init4, 2)
    });
}


/**
 * handler per il submit della form
 * @return {[type]} [description]
 */
function submit() {
    validate(function(err) {
        if (err) {
            alert(err.join('\n'));

        } else {
            dialogs.confirm({
                title: "Conferma richiesta",
                message: "Confermi l'invio della richiesta?",
                yes: "Sì",
                no: "No",
                callback: function() {
                    AciGlobal.limitRequests('La tua richiesta è già stata inviata per qualunque altro problema contatta la centrale operativa al numero ' + AciGlobal.NumeroVerde + '.', callAciGlobal);
                }
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

function renderConferma() {



    //
    //immette i valori nella schermata
    //

    //orario
    var now = new Date();
    //  $.richiestaOrario.text = [now.getHours(), now.getMinutes()].join(':');
    $.richiestaOrario.text = formatOrario(now);

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


function formatOrario(d) {
    return [utility.padLeft(now.getHours(), '0', 2), utility.padLeft(now.getMinutes(), '0', 2)].join(':');
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

function cavasClick(e){
    console.log(e);
    if (e.source !== $.telefono) {
        $.telefono.blur();
    }
}