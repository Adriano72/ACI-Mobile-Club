exports.formattaOrari = function(obj) {

    Ti.API.info("CIAO");

    var orari = [];

    var dayArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

    _.each(dayArray, function(day) {
        Ti.API.info("DAY: " + JSON.stringify(day));
        var daySchedule = _.find(obj, function(value, key) {
            return key == day;
        });
        //Ti.API.info("DAY SCHEDULE: " + JSON.stringify(obj));

        if (!_.isUndefined(daySchedule[0])) {
            /*
			 Ti.API.info("DAY SCHEDULE: " + JSON.stringify(daySchedule));
			 Ti.API.info("DAY SCHEDULE FROM: " + daySchedule[0].from);
			 Ti.API.info("DAY SCHEDULE TO: " + daySchedule[0].to);
			 */

            switch (day) {

                case "mon":
                    orari.push("Lunedì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
                    break;
                case "tue":
                    orari.push("Martedì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
                    break;
                case "wed":
                    orari.push("Mercoledì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
                    break;
                case "thu":
                    orari.push("Giovedì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
                    break;
                case "fri":
                    orari.push("Venerdì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
                    break;
                case "sat":
                    orari.push("Sabato: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
                    break;
                case "sun":
                    orari.push("Domenica: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
                    break;
                default:

            };

        };

    });

    //Ti.API.info("ORARI: " + orari.toString());
    return orari.join("");

};

exports.getTesseraImage = function(codice) {

    Ti.API.info("CODICE: " + codice);

    var transcode = {

        'DIP': 'tessera_sistema.jpg',
        'FAM': 'tessera_sistema.jpg',
        'SOC': 'tessera_sistema.jpg',
        'SMA': 'tessera_sistema.jpg',
        'SOG': 'tessera_sistema.jpg',
        'GDI': 'tessera_gold.jpg',
        'GFA': 'tessera_gold.jpg',
        'GSO': 'tessera_gold.jpg',
        'GMA': 'tessera_gold.jpg',
        'GIO': 'tessera_okkei.jpg',
        'GIA': 'tessera_okkei.jpg',
        'UNO': 'tessera_one.jpg',
        'ONG': 'tessera_one.jpg',
        'CLO': 'tessera_club.jpg',
        'CLU': 'tessera_club.jpg',
        'VIN': 'tessera_vintage.jpg',
        'CON': 'tessera_driver.jpg',
        'DRV': 'tessera_driver.jpg',
        'STA': 'tessera_storico.jpg',
        'STF': 'tessera_storico.jpg'

    };

    var imm = _.find(transcode, function(value, key) {
        return key == codice;
    });

    Ti.API.info("TESSERA: " + imm);

    return "/" + imm;

};

/**
 * elenco dei serivzi disponibili per la tessera
 * persona, casa, auto
 * @param  {[type]} codice [description]
 * @return {[type]}        [description]
 */
exports.getTesseraAssitenza = function(codice) {

    Ti.API.info("CODICE: " + codice);

    var a1 = 'auto';
    var a2 = 'persone';
    var a3 = 'casa';

    var transcode = {

        //sistema
        'DIP': [a1, a2],
        'FAM': [a1, a2],
        'SOC': [a1, a2],
        'SMA': [a1, a2],
        'SOG': [a1, a2],
        //gold
        'GDI': [a1, a2, a3],
        'GFA': [a1, a2, a3],
        'GSO': [a1, a2, a3],
        'GMA': [a1, a2, a3],
        //okkei
        'GIO': [a1],
        'GIA': [a1],
        //one
        'UNO': [a1],
        'ONG': [a1],
        //club
        'CLO': [a1, a2, a3],
        'CLU': [a1, a2, a3],
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

exports.formatDistance = function(d) {
    console.log("formatDistance ", d);
    if (_.isUndefined(d) || !_.isNumber(d)) {
        return '';
    };

    //approssimo i km alla prima cifra decimale
    var km = Math.round(d * 10) / 10;

    if (km >= 1) {
        return km + ' km';
    } else {
        return (km * 1000) + ' m';
    };

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
    if (!s || s.length == 0) return '';
    if (s.length == 1) return s.toUpperCase();
    return s[0].toUpperCase() + s.slice(1).toLowerCase();
}