/**
 * funzione che formatta i parametri di querystring in modo da implementare la logica di ordinamento geografico
 * gestisce il caso provincia o (lat,lon)
 * https://mail.google.com/mail/u/2/#apps/m.deangelis%40informatica.aci.it/n50/14b35dab0bc4deee
 * ATTENZIONE! MODIFICA L'OGGETTO PASSATO COME PARAMETRO
 * @param {object} parametri originali della querystring
 * @return {object} querystring formattata
 */
function useLocationParams(params) {
    var settings = require('settings');



    //se ho la provincia, filtro per provincia
    // altrimenti ordino per posizione
    if (!settings.ricercaPerProssimita) {

        var provincia = settings.provinciaDiRiferimento;
        params.query['address.province.shortName'] = provincia.shortName;
    } else {
        /*params.query["address.location"] = {
            "$near": [Alloy.Globals.userPosition.longitude, Alloy.Globals.userPosition.latitude],
            "$maxDistance": 0.2
        }; */
        params.near = {
            point: [Alloy.Globals.userPosition.longitude, Alloy.Globals.userPosition.latitude],
            max: 0.2
        };
        params.populate = 1;
    }


}

/**
 * formatta una string aquerystring a partire da un oggetto
 * @return {[type]} [description]
 */
function formatQS(obj) {

    var params = _.map(obj, function(value, key) {
        return key + '=' + JSON.stringify(value);
    });

    return params.join('&');
}


exports.getPuntiAci = function(type_code, _callback) {

    Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.message == "200 OK") {
            Ti.API.debug("RISPOSTA: " + type_code + " " + JSON.stringify(json));
            _callback(json.result);

        } else {
            Alloy.Globals.loading.hide();
            alert("Errore nella comunicazione col server.");
        };

    };

    xhr.onerror = function() {
        Alloy.Globals.loading.hide();
        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
    };

    //parametri della richiesta
    var qs = {
        query: {
            "_type": type_code,
            "status": 'ok'
        },
        limit: 15
    }

    //aggiunge la parte dedicata all'ordinamento geografico
    useLocationParams(qs);

    var url = Alloy.Globals.baseURL + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);

    xhr.open('GET', url);

    xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

    xhr.send();

};

exports.getDemolitori = function(type_code, _callback) {

    Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.message == "200 OK") {

            _callback(json.result);

        } else {
            Alloy.Globals.loading.hide();
            alert("Errore nella comunicazione col server.");
        };

    };

    xhr.onerror = function() {
        Alloy.Globals.loading.hide();
        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
    };


    //parametri della richiesta
    var qs = {
        query: {
            "_type": type_code,
            "status": 'ok'
        },
        limit: 15
    }

    //aggiunge la parte dedicata all'ordinamento geografico
    useLocationParams(qs);

    var url = Alloy.Globals.baseURL + '/aci/dem?' + formatQS(qs);

    Ti.API.info("CHIAMATA HTTP: " + url);

    // Ti.API.info("CHIAMATA HTTP: " + Alloy.Globals.baseURL + '/aci/dem?query={"_type":"' + type_code + '", "status": "ok", "address.location": { "$near": [' + Alloy.Globals.userPosition.longitude + ',' + Alloy.Globals.userPosition.latitude + '], "$maxDistance": 0.2 } }&limit=15');

    //   xhr.open('GET', Alloy.Globals.baseURL + '/aci/dem?query={"_type":"' + type_code + '", "status": "ok", "address.location": { "$near": [' + Alloy.Globals.userPosition.longitude + ',' + Alloy.Globals.userPosition.latitude + '], "$maxDistance": 0.2 } }&limit=100');

    xhr.open('GET', url);

    xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

    xhr.send();

};

exports.getVantaggiSoci = function(type_code, _callback) {

    Ti.API.info("**TYPE CODE: " + type_code);

    var xhr = Ti.Network.createHTTPClient();

    xhr.clearCookies('http://www.aci.it');

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        //Ti.API.info("RISPOSTA: "+type_code+" " + JSON.stringify(json));

        if (json.message == "200 OK") {

            Ti.API.debug("RISPOSTA: " + type_code + " " + JSON.stringify(json));

            _callback(json.result);

        } else {
            Alloy.Globals.loading.hide();
            alert("Errore nella comunicazione col server.");
        };

    };

    xhr.onerror = function() {
        Alloy.Globals.loading.hide();
        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
    };

    //parametri della richiesta
    var qs = {
        query: {
            "agreement_id.categories.short_name": type_code,
            "status": "ok"
        },
        limit: 15
    }

    //aggiunge la parte dedicata all'ordinamento geografico
    useLocationParams(qs);

    var url = Alloy.Globals.baseURL + '/aci/syc?' + formatQS(qs);
    //var url = 'http://10.64.4.138:10000/api' + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);

    xhr.open('GET', url);


    xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

    xhr.send();

};

exports.getSSOID = function(p_username, p_password, _callback) {

    Ti.API.info("GET SSOID");

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json);

        if (json[0] == "success") {

            Ti.API.info("SUCCESS!");

            xhr.clearCookies('http://login.aci.it');

            _callback(json[1]);

        } else {
            Alloy.Globals.loading.hide();
            alert("LOGIN FALLITO - UTENTE NON AUTORIZZATO");
        };

    };

    xhr.onerror = function() {
        Alloy.Globals.loading.hide();
        Ti.API.error("LOGIN: ERRORE RISPOSTA SERVER: " + this.message);
    };

    //Ti.API.info("CHIAMATA HTTP: "+ Alloy.Globals.baseURL + '/api/aci/pos?query={"agreement_id.categories.short_name":"'+type_code+'", "status": "ok", "address.location": { "$near": ['+Alloy.Globals.userPosition.longitude+','+Alloy.Globals.userPosition.latitude+'], "$maxDistance": 1 } }&limit=15');

    xhr.open('GET', 'http://login.aci.it/index.php?do=login&application_key=mobile&id=login&username=' + p_username + '&password=' + p_password + '');

    xhr.send();

};

exports.getUserInfo = function(p_ssoid, _callback) {

    var xhr = Ti.Network.createHTTPClient();

    xhr.clearCookies('http://login.aci.it');

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + JSON.stringify(json));

        if (json.result == "success") {
            _callback(json);
            //Ti.API.info("USER INFO: " + JSON.stringify(json.data));

        } else {
            Alloy.Globals.loading.hide();
            alert("LOGIN FALLITO - UTENTE NON AUTORIZZATO");
        };

    };

    xhr.onerror = function() {
        Alloy.Globals.loading.hide();
        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
    };

    Ti.API.info("CHIAMATA HTTP: " + 'https://login.aci.it/index.php?do=getCustomUserInfo&application_key=mobile&keypass=0my6o9t6&sso-id=' + p_ssoid + '');

    xhr.open('GET', 'http://login.aci.it/index.php?do=getCustomUserInfo&application_key=mobile&keypass=0my6o9t6&sso-id=' + p_ssoid + '');

    xhr.send();
};

exports.getBanner = function(_callback) {

    var lat = 40.830774;
    var lon = 16.548602999999957;
    //var lat = Alloy.Globals.userPosition.latitude
    //var lon =  Alloy.Globals.userPosition.longitude;

    var xhr = Ti.Network.createHTTPClient();

    var _getRandomBanner = function(count, _callback) {
        console.log('count', count);
        var xhr = Ti.Network.createHTTPClient();

        xhr.onload = function() {
            var json = JSON.parse(this.responseText);
            Ti.API.info("RISPOSTA: " + json.message);
            if (json.message === "200 OK") {
                _callback(json.result);
            } else {
                Alloy.Globals.loading.hide();
                Ti.API.error("Errore nella comunicazione col server.");
            };
        };

        xhr.onerror = function() {
            Alloy.Globals.loading.hide();
            Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
        };

        var rand = Math.floor(Math.random() * count);



        var url = 'http://www.aci.it/geo/v2/aci/syc?query={"address.location":{"$near":[' + lon + ', ' + lat + '],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}&populate=1&limit=1&skip=' + rand;

        Ti.API.info("CHIAMATA HTTP BANNER: " + url);

        xhr.open('GET', 'http://www.aci.it/geo/v2/aci/syc?query={"address.location":{"$near":[' + lon + ', ' + lat + '],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}&populate=1&limit=1&skip=' + rand);
        xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');
        xhr.send();
    };
    //Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

    xhr.onload = function() {
        var json = JSON.parse(this.responseText);
        Ti.API.info("RISPOSTA: " + json.message);
        if (json.message === "200 OK") {
            if (json.result.count > 0) {
                _getRandomBanner(json.result.count, _callback);
            } else {
                _callback([]);
            }
        } else {
            Alloy.Globals.loading.hide();
            alert("Errore nella comunicazione col server.");
        };

    };

    xhr.onerror = function() {
        Alloy.Globals.loading.hide();
        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
    };

    Ti.API.info("CHIAMATA HTTP BANNER: " + 'http://www.aci.it/geo/v2/aci/syc/_count?query={"address.location":{"$near":[' + lon + ', ' + lat + '],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}');

    xhr.open('GET', 'http://www.aci.it/geo/v2/aci/syc/_count?query={"address.location":{"$near":[' + lon + ', ' + lat + '],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}');
    xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');
    xhr.send();

};



/**
 * Implmenta la ricerca dei punti aci che offrono il servizio gic
 * https://mail.google.com/mail/u/2/#inbox/14b53bd6b8974a96
 * @param  {[type]} gic       denominazione servizio gic
 * @param  {boolean} fuoriGIC       se fa parte dei servizi gic o no
 * @param  {[type]} _callback
 */
exports.getPuntiAciPerServizioGIC = function(gic, fuoriGIC, _callback) {

    Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.message == "200 OK") {
            // Ti.API.debug("RISPOSTA: " + gic + " " + JSON.stringify(json));
            _callback(json.result);

        } else {
            Alloy.Globals.loading.hide();
            alert("Errore nella comunicazione col server.");
        };

    };

    xhr.onerror = function(e) {
        Alloy.Globals.loading.hide();
        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
        console.log(e);
    };


    //parametri della richiesta
    var qs = {
        query: {
            //metto in or tutti i tipi di punti aci
            "_type": "del",
            "$or": _.map(['del', 'aacc', 'r2g', 'pra', 'urp', 'tasse'], function(x) {
                return {
                    "_type": x
                };
            }),
            "status": 'ok'
        },
        limit: 15
    }

    /* console.log('fuoriGIC', fuoriGIC);
    console.log('fuoriGIC', Boolean(fuoriGIC));
    console.log('fuoriGIC', fuoriGIC == false);
    console.log('fuoriGIC', fuoriGIC + '' == 'false'); */

    //su android fuoriGIC=false è interpretato come stringa
    var isGIC = OS_ANDROID ? fuoriGIC + '' == 'false' : !fuoriGIC;

    if (isGIC) {
        qs.query.services = gic;
    } else {
        qs.query.customServices = gic;

    }


    //aggiunge la parte dedicata all'ordinamento geografico
    console.log("qs", qs);
    useLocationParams(qs);
    console.log("qs", qs);


    var url = Alloy.Globals.baseURL + '/aci/pos?' + formatQS(qs);
    //var url = 'http://10.64.4.138:10000/api' + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);

    xhr.open('GET', url);

    xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

    xhr.send();

};


exports.getListaProvince = function(_callback) {
    Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.message == "200 OK") {
            // Ti.API.debug("RISPOSTA: " + gic + " " + JSON.stringify(json));
            _callback(json.result);

        } else {
            Alloy.Globals.loading.hide();
            alert("Errore nella comunicazione col server.");
        };

    };

    xhr.onerror = function(e) {
        Alloy.Globals.loading.hide();
        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
        console.log(e);
    };


    //parametri della richiesta
    var qs = {
        query: {
            "_level": 2,
            "lft": {
                "$gt": 1,
                "$lt": 47772
            }
        },
        select: "_id shortName longName",
        sort: {
            "longName": -1
        },
        limit: 0
    }



    var url = Alloy.Globals.baseURL + '/common/divisions?' + formatQS(qs);
    //var url = 'http://10.64.4.138:10000/api' + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);

    xhr.open('GET', url);

    xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

    xhr.send();
}