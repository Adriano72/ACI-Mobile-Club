var args = arguments[0] || {};

var sideMenu = require('mapSideMenu');
var locationServices = require('locationServices');

var tmpCollection = Alloy.Collections.tempCollection;

tmpCollection.reset(args.collection);

//se true, centra la mappa in base alla posizione dell'utente
//se false, centra la mappa in base ai punti 
var centerOnUser = args.centerOnUser;

var default_delta = 0.25;

console.log('mapview', args);
var headerText = args.titolo; //"Assistenza";
var headerImg = args.homeIcon; //"/images/ic_action_home_assistenza_blu.png";

//inizializzazioni comuni della Window
require('commons').initWindow($.win, headerText, headerImg);




function loadData() {

    _.defer(centerMap);

    //updateUI();

}


function centerMap() {
    console.log('centerOnUser', centerOnUser);
    if (centerOnUser) {
        var posizione = locationServices.getLastLocation();
        $.map.region = {
            latitude: posizione.latitude,
            latitudeDelta: default_delta,
            longitude: posizione.longitude,
            longitudeDelta: default_delta
        };
    } else {

        setMarkersWithCenter($.map);
    }

}

/**
 * seleziona il pin corretto
 * e args.pin è definito, usa quello
 * altrimenti lo ricava man mano dal tipo del poi
 */
function getPinImage(type) {
    var i = '/images/';
    /*if (OS_IOS) {
        i += 'images/'
    }; */

    if (args.pin) {
        i += args.pin;
    } else {

        //per i syc, cerco tra i tabulatedData
        var item = _(require('tabulatedData').categorieSyc()).findWhere({
            shortName: type
        });

        if (item && item.pin) {
            i += item.pin;
        } else {

            //per i puntiaci, lo gestisco a mano
            var d = {
                'del': 'pin_Delegazioni.png',
                'aacc': 'pin_AutomobileClub.png',
                'pra': 'pin_Pra.png',
                'tasse': 'pin_Tasse.png'
            };
            console.log("type", type);
            i += d[type];
        }


    }
    console.log("pin", i);
    return i;
}



function dataTransform(model) {
    var attrs = model.toJSON();
    var isPuntoAci = attrs._type != 'syc';

    Ti.API.info("END SIDE COLLECTION: " + JSON.stringify(args.collection));
    attrs.indirizzo = attrs.address.street;
    attrs.indirizzo2 = (function() {
        var i = [];
        i.push((attrs.address.postalCode || ''));
        i.push(attrs.address.locality && attrs.address.locality.longName ? attrs.address.locality.longName : '');
        return i.join('');

    })();
    attrs.latitude = attrs.address.location[1];
    attrs.longitude = attrs.address.location[0];
    attrs.tel = attrs.contacts.tel[0];
    attrs.image = getPinImage(isPuntoAci ? attrs._type : attrs.agreement_id.categories.short_name);
    attrs.title = attrs.name;
    attrs.subtitle = OS_IOS ? "Tocca 'i' per ulteriori informazioni" : "Tocca per ulteriori informazioni";
    attrs.leftButton = "/images/annotation-info.png";
    attrs.email = attrs.contacts.email[0];
    //attrs.immagine = encodeURI("http://www.aci.it/fileadmin/syc/logo/"+attrs.agreement_id.logo);

    return attrs;
};

function linkToPOI(e) {
    var clicksource = e.clicksource;

    var annotation = e.source;
    //get the Myid from annotation
    var clicksource = e.clicksource;

    if (clicksource == 'leftButton' || clicksource == 'leftPane' || clicksource == 'infoWindow' || clicksource == 'subtitle') { //leftButton event


        var id_code = e.annotation._type;
        var isPuntoAci = _.isUndefined(e.annotation.agreement_id);

        var ctrl = isPuntoAci ? 'PuntiAci_Detail' : 'VantaggiSoci_Dettaglio_Convenzione';

        var det = Alloy.createController(ctrl, {
            data: {
                attributes: e.annotation
            },
            titolo: headerText,
            headerImg: headerImg
        }).getView();
        Alloy.Globals.navMenu.openWindow(det);


    }

  //  Ti.API.info("CLICK: " + JSON.stringify(e));
};

function openNavigation(e) {

    require('locationServices').getUserLocation(function(err, userLoc) {
        var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
        Ti.API.info("NAVIGATION DATA: " + e.source.lat + " " + e.source.lon + " " + userLoc.latitude + " " + userLoc.longitude);
        Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + e.source.lat + ',' + e.source.lon);
    });

};

var rightSettingsMenu = sideMenu.openMapSideMenu(function() {
    //Ti.API.info("BEFORE CALLBACK - COLLECTION LENGTH: " + Alloy.Collections.puntiMappa.length);
    //tmpCollection.reset();
    //tmpCollection.trigger('change');
    //$.map.removeAllAnnotations();
    //_.each($.map.annotations, function(value) {
    //$.map.removeAnnotation(value);
    //});

    //Ti.API.info("ANNOTATIONS LENGTH: " + $.map.annotations.length);
    //Alloy.Collections.puntiMappa.reset(Alloy.Collections.automobileClub.toJSON());
    //Ti.API.info("ANNOTATIONS LENGTH: " + $.map.annotations.length);

    //updateUI();
    //Ti.API.info("AFTER CALLBACK - COLLECTION LENGTH: " + Alloy.Collections.puntiMappa.length);
});

$.win.add(rightSettingsMenu);

function toggleSideMenu() {

    sideMenu.toggleMenu(rightSettingsMenu);
}

//tempCollection.trigger("change");

$.win.addEventListener('close', function() {
    $.destroy();
});


/**
 * Imposta il centro della mappa rispetto ai punti
 * https://gist.github.com/synapse/9953552
 * @param {[type]} mapView  [description]
 * @param {[type]} latiarray  [description]
 * @param {[type]} longiarray [description]
 */
function setMarkersWithCenter(mapView) {
    var annotations = mapView.getAnnotations();

    var latiarray = _.map(annotations, function(a) {
        return a.latitude;
    });
    var longiarray = _.map(annotations, function(a) {
        return a.longitude;
    });

    if (latiarray.length != longiarray.length)
        return;

    if (latiarray.length == 1) {
        mapView.setLocation({
            animate: true,
            latitude: latiarray[0],
            longitude: longiarray[0],
            latitudeDelta: default_delta,
            longitudeDelta: default_delta,
        });
    } else {
        var total_locations = latiarray.length;
        var minLongi = null,
            minLati = null,
            maxLongi = null,
            maxLati = null;

        var totalLongi = 0.0,
            totalLati = 0.0;

        for (var i = 0; i < total_locations; i++) {
            if (minLati == null || minLati > latiarray[i]) {
                minLati = latiarray[i];
            }
            if (minLongi == null || minLongi > longiarray[i]) {
                minLongi = longiarray[i];
            }
            if (maxLati == null || maxLati < latiarray[i]) {
                maxLati = latiarray[i];
            }
            if (maxLongi == null || maxLongi < longiarray[i]) {
                maxLongi = longiarray[i];
            }
        }

        Ti.API.debug("minLati", minLati);
        Ti.API.debug("minLongi", minLongi);
        Ti.API.debug("maxLati", maxLati);
        Ti.API.debug("maxLongi", maxLongi);

        var ltDiff = maxLati - minLati;
        Ti.API.debug("ltDiff", ltDiff);
        var lgDiff = maxLongi - minLongi;
        if (lgDiff > 180) {
            lgDiff = 180
        }
        Ti.API.debug("lgDiff", lgDiff);
        var delta = ltDiff > lgDiff ? ltDiff : lgDiff;

        if (total_locations > 0 && delta > 0) {
            var latitude = ((maxLati + minLati) / 2);
            var longitude = ((maxLongi + minLongi) / 2);

            Ti.API.debug(latitude, longitude);

            Ti.API.debug('Center map', {
                animate: true,
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: delta,
                longitudeDelta: delta,
            });

            mapView.setLocation({
                animate: true,
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: delta,
                longitudeDelta: delta,
            });
        }
    }
}