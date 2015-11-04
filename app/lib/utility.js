var uuid = require('utility-uuid');
var tessere = require('utility-tessere');

/**
 * Esporta l'intero modulo uuid
 * @type {[type]}
 */
exports.uuid = uuid;



exports.formattaServizi = function(obj) {

    return _(obj).map(function(e) {
        return '·' + e;
    }).join('  ');

};


exports.formattaOrari = function(obj) {

    //console.log('formattaOrari', obj);

    var orari = [];

    var dayArray = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    _.each(dayArray, function(day) {
        //Ti.API.info("DAY: " + JSON.stringify(day));
        var daySchedule = _.find(obj, function(value, key) {
            return key == day;
        });
        ////Ti.API.info("DAY SCHEDULE: " + JSON.stringify(obj));

        var isEmpty = _.isUndefined(daySchedule[0]) || _.isEmpty(daySchedule[0].from) || _.isEmpty(daySchedule[0].to);

        if (!isEmpty) {

            //Ti.API.info("DAY SCHEDULE: " + JSON.stringify(daySchedule));
            //Ti.API.info("DAY SCHEDULE FROM: " + daySchedule[0].from);
            //Ti.API.info("DAY SCHEDULE TO: " + daySchedule[0].to);


            var h = [];
            _(daySchedule).each(function(e) {
                if (e.from || e.to) {
                    h.push([e.from, e.to].join('/'));
                }
            });



            var giorno;

            switch (day) {

                case 'mon':
                    giorno = 'Lunedì';
                    break;
                case 'tue':
                    giorno = 'Martedì';
                    break;
                case 'wed':
                    giorno = 'Mercoledì';
                    break;
                case 'thu':
                    giorno = 'Giovedì';
                    break;
                case 'fri':
                    giorno = 'Venerdì';
                    break;
                case 'sat':
                    giorno = 'Sabato';
                    break;
                case 'sun':
                    giorno = 'Domenica';
                    break;
                default:

            }
            orari.push(giorno + ': ' + h.join(', ') + '\n');

        }

    });

    ////Ti.API.info("ORARI: " + orari.toString());
    return orari.join('');

};

/**
 * Ritorna l'immagine frontale per questa tessera
 * @param  {[type]} codice     [description]
 * @param  {[type]} horizontal [description]
 * @return {[type]}            [description]
 */
exports.getTesseraImage = function(codice, horizontal) {
    return tessere.getImageSet(codice)[horizontal ? 'frontH' : 'frontV'];
};

/**
 * Ritorna l'immagine posteriore per questa tessera
 * @param  {[type]} codice [description]
 * @return {[type]}        [description]
 */
exports.getTesseraRetroImage = function(codice) {
    return tessere.getImageSet(codice).retroV;
};

/**
 * ritorna l'immagine da usare per la tessera scaduta
 * @param  {[type]} codice [description]
 * @return {[type]}        [description]
 */
exports.getTesseraScadutaImage = function(codice) {
    return tessere.getImageSet(codice).expiredV;
};

/**
 * elenco dei serivzi disponibili per la tessera
 * persona, casa, auto
 * @param  {[type]} codice [description]
 * @return {[type]}        [description]
 */
exports.getTesseraAssitenza = function(codice) {
    return tessere.getTesseraAssitenza(codice);
};

/*exports.getTesseraImage = function(codice, horizontal) {

    //Ti.API.info("CODICE: " + codice);

    var transcode = {

        'DIP': 'tessera_sistema.jpg',
        'SOC': 'tessera_sistema.jpg',
        'FAM': 'tessera_sistema.jpg',
        'SOC': 'tessera_sistema.jpg',
        'SMA': 'tessera_sistema.jpg',
        'SOG': 'tessera_sistema.jpg',
        'GDI': 'tessera_gold.jpg',
        'GFA': 'tessera_gold.jpg',
        'GSO': 'tessera_gold.jpg',
        'GMA': 'tessera_gold.jpg',
        'GFA': 'tessera_gold.jpg',
        'GIO': 'tessera_okkei.jpg',
        'GIA': 'tessera_okkei.jpg',
        'UNO': 'tessera_one.jpg',
        'ONG': 'tessera_one.jpg',
        'CLO': 'tessera_club.jpg',
        'CLU': 'tessera_club.jpg',
        'CLN': 'tessera_club.jpg',
        'VIN': 'tessera_vintage.jpg',
        'CON': 'tessera_driver.jpg',
        'DRV': 'tessera_driver.jpg',
        'STA': 'tessera_storico1.jpg',
        'STF': 'tessera_storico2.jpg'

    };

    var imm = _.find(transcode, function(value, key) {
        return key == codice;
    });

    //così gestisco con una sola funzione i doppi orientamenti
    if (horizontal) {

        imm = imm.replace('.jpg', '_h.jpg');
    }

    //Ti.API.info("TESSERA: " + imm);



    return "/" + imm;

}; */

/*
exports.getTesseraRetroImage = function(codice) {

    //Ti.API.info("CODICE: " + codice);

    var transcode = {

        'DIP': 'tessera_sistema_retro.jpg',
        'SOC': 'tessera_sistema_retro.jpg',
        'FAM': 'tessera_sistema_retro.jpg',
        'SOC': 'tessera_sistema_retro.jpg',
        'SMA': 'tessera_sistema_retro.jpg',
        'SOG': 'tessera_sistema_retro.jpg',
        'GDI': 'tessera_gold_retro.jpg',
        'GFA': 'tessera_gold_retro.jpg',
        'GSO': 'tessera_gold_retro.jpg',
        'GMA': 'tessera_gold_retro.jpg',
        'GFA': 'tessera_gold_retro.jpg',
        'GIO': 'tessera_okkei_retro.jpg',
        'GIA': 'tessera_okkei_retro.jpg',
        'UNO': 'tessera_one_retro.jpg',
        'ONG': 'tessera_one_retro.jpg',
        'CLO': 'tessera_club_retro.jpg',
        'CLU': 'tessera_club_retro.jpg',
        'CLN': 'tessera_club_retro.jpg',
        'VIN': 'tessera_vintage_retro.jpg',
        'CON': 'tessera_driver_retro.jpg',
        'DRV': 'tessera_driver_retro.jpg',
        'STA': 'tessera_storico1_retro.jpg',
        'STF': 'tessera_storico2_retro.jpg'

    };

    var imm = _.find(transcode, function(value, key) {
        return key == codice;
    });



    //Ti.API.info("TESSERA: " + imm);



    return "/" + imm;

};
*/

/*
exports.getTesseraScadutaImage = function(codice) {



    var imm = exports.getTesseraImage(codice, false);
    //così gestisco con una sola funzione i doppi orientamenti

    imm = imm.replace('.jpg', '_scaduta.jpg');


    return imm;

};
*/

/**
 * elenco dei serivzi disponibili per la tessera
 * persona, casa, auto
 * @param  {[type]} codice [description]
 * @return {[type]}        [description]
 */

/*
exports.getTesseraAssitenza = function(codice) {

    //Ti.API.info("CODICE: " + codice);

    var a1 = 'auto';
    var a2 = 'persone';
    var a3 = 'casa';

    var transcode = {

        //sistema
        'DIP': [a1, a2],
        'SOC': [a1, a2],
        'FAM': [a1, a2],
        'SOC': [a1, a2],
        'SMA': [a1, a2],
        'SOG': [a1, a2],
        //gold
        'GDI': [a1, a2, a3],
        'GFA': [a1, a2, a3],
        'GSO': [a1, a2, a3],
        'GMA': [a1, a2, a3],
        'GFA': [a1, a2, a3],
        //okkei
        'GIO': [a1],
        'GIA': [a1],
        //one
        'UNO': [a1],
        'ONG': [a1],
        //club
        'CLO': [a1, a2, a3],
        'CLU': [a1, a2, a3],
        'CLN': [a1, a2, a3],
        //vintage
        'VIN': [a1, a2],
        //driver
        'CON': [],
        'DRV': [],
        //storico
        'STA': [a1, a2],
        'STF': [a1, a2]

    };

    return transcode[codice];

};
*/

exports.formatDistance = function(d) {
    //console.log("formatDistance ", d);
    if (_.isUndefined(d) || !_.isNumber(d)) {
        return '';
    }

    //approssimo i km alla prima cifra decimale
    var km = Math.round(d * 10) / 10;

    if (km >= 1) {
        return km + ' km';
    } else {
        return (km * 1000) + ' m';
    }

};

/**
 * Snippet per nascondere una vista contenuta in un layout=vertical
 * evita il problema per cui le viste mantengono il loro spazio
 * (simula il flow dinamico dei controlli)
 * @param  {Ti.View} view la vista da nascondere
 */
exports.hideVertical = function(view) {
    //salva i precedenti valori della vista
    view.__originalValues = {
        top: view.top,
        bottom: view.bottom,
        height: view.height
    };

    //imposta i valori che corrispondo allo stato invisibile
    view.top = 0;
    view.bottom = 0;
    view.height = 0;
    view.visible = false;
};

/**
 * Snippet per mostrare una vista contenuta in un layout=vertical
 * Ripristina quanto nascosto con hideVertical()
 * @param  {Ti.View} view la vista da nascondere
 */
exports.showVertical = function(view) {
    //ripristina i valori precedenti all'hide
    view = _.extend(view, view.__originalValues || {});

    view.visible = true;
};


/**
 * Formatta una stringa con la prima lettera maiuscola
 * @param  {[type]} s [description]
 * @return {[type]}   [description]
 */
exports.capitalize = function(s) {
    if (!s || s.length == 0) {
        return '';
    }
    if (s.length == 1) {
        return s.toUpperCase();
    }
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
};

/**
 * @method arrayIndexBy
 * In un array di oggetti, ritorna l'indice dell'elemento che soddisfa el condizioni
 * @param  {array} arr  array in cui cercare
 * @param  {object|function} query può essere o una serie di chiave/valore da testare, o una funzione di ricerca
 * @return {number}     indice del primo elemento trovato, -1 se nessun elemento trovato
 */
exports.arrayIndexBy = function(arr, query) {

    //routine di controllo per cercare l'elemento.
    //  se query=function, viene sovrascritta
    //  altrimenti ho una funzione default che fa il controllo con le chiavi dell'oggetto query
    var check = _.isFunction(query) ? query : function(item) {
        var keys = _.keys(query);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (item[key] != query[key]) {
                return false;
            }
        };
        return true;
    };

    for (var i = 0; i < arr.length; i++) {
        if (check(arr[i])) {
            return i;
        }
    }
    return -1;

};


/**
 * Calcola la differenza tra due date
 * @param  {Date} d1 prima data
 * @param  {Date} d2 seconda data
 * @param  {String} u  unità di misura in cui ci aspettiamo la differenza, valori accettati sono: ms, s, m, h, d. Default: ms
 * @return {Number}    differenza tra le due date. Se d1>d2 -> diff<0, altrimenti diff>0
 */
exports.dateDiff = function(d1, d2, u) {
    var timeDiff = d2.getTime() - d1.getTime();

    //default
    if (!u) u = 'ms';

    switch (u) {

        case 'd':
        case 'days':
            timeDiff /= 24;
        case 'h':
        case 'hours':
            timeDiff /= 60;
        case 'm':
        case 'minutes':
            timeDiff /= 60;
        case 's':
        case 'seconds':
            timeDiff /= 1000;
        case 'ms':
        case 'milliseconds':
            //do nothing
            break;
        default:
            throw ("invalid date diff format: " + m);
    };

    return timeDiff;

};

/**
 * calcola la distanza tra due set di coordinate, in metri
 * http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
 * @param  {Number} lat1 latitudine punto 1
 * @param  {Number} lon1 longitudine punto 1
 * @param  {Number} lat2 latitudine punto 2
 * @param  {Number} lon2 longitudine punto 2
 * @return {Number}      distanza tra i punti, in metri
 */
exports.calculateDistance = function(lat1, lon1, lat2, lon2) {
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000; //distanza in metri 
    return d;
};


/**
 * Rimpie una stringa con tanti caratteri a sinistra fino a raggiungere una lunghezza predefinita
 * @param  {String} str    stringa sorgente
 * @param  {String} filler carattere con cui riempire a sinistra
 * @param  {Number} count  lunghezza totale della stringa
 * @return {String}        stringa formattata
 */
exports.padLeft = function(str, filler, count) {
    while (filler.length < count) {
        filler += filler;
    }

    return filler.substring(0, count - str.length) + str;

};



/**
 * Rimpie una stringa con tanti caratteri a destra fino a raggiungere una lunghezza predefinita
 * @param  {String} str    stringa sorgente
 * @param  {String} filler carattere con cui riempire a destra
 * @param  {Number} count  lunghezza totale della stringa
 * @return {String}        stringa formattata
 */
exports.padRight = function(str, filler, count) {
    while (filler.length < count) {
        filler += filler;
    }

    return str + filler.substring(0, count - str.length);

};


/**
 * Seleziona la collection che si riferisce ad un determinato codice AciGeo
 * @param  {[type]} id_code [description]
 * @return {[type]}         [description]
 */
exports.getAciGeoCollection = function(id_code) {
    var coll;
    //console.log('getAciGeoCollection id_code', id_code);

    if (id_code == 'ric') return Alloy.Collections.serviziGICpos;

    _.keys(Alloy.Collections).every(function(k) {
        var c = Alloy.Collections[k];
        //console.log('id_code', id_code);
        //console.log('k', k);
        //console.log('c.config', c.config);
        if (c && c.config && c.config.type_code && c.config.type_code.toLowerCase() == id_code.toLowerCase()) {
            //console.log('getAciGeoCollection', id_code, c.config);
            coll = c;
            return false;
        }
        return true;
    });
    return coll;
};


/**
 * ### fitHeight
 * Aggiusta l'altezza di un controllo all'interno di un container. 
 * Il caso d'uso è quello in cui il container ha layout vertical, e tutti i figli hanno altezza definita TRANNE il controllo da adattare. 
 * Tale controllo avrà l'altezza corretta per riempire lo spazio disponibile
 * @param {Ti.UI.View} container vista container
 * @param {Ti.UI.View} toFit vista di cui adattare l'altezza. Deve essere figlio del container
 
 */
exports.fitHeight = function(container, toFit) {
    var h = 0;
    _(container.getChildren()).each(function(c) {
        if (c != toFit) {
            h += c.rect.height;
            //  h += c.rect.top || 0;
            //  h += c.rect.bottom || 0;
            console.log('fit', h);

        }
    });
    if (OS_ANDROID) {
        h += 30;
    }
    console.log('fitHeight', h, container.rect.height);
    toFit.height = Math.abs( container.rect.height - h);

};