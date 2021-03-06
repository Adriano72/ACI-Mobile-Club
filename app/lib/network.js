var locationServices = require('locationServices');


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
        params.query['address.province._id'] = provincia.id;
        params.limit = 0;
    } else {
        /*params.query["address.location"] = {
            "$near": [Alloy.Globals.userPosition.longitude, Alloy.Globals.userPosition.latitude],
            "$maxDistance": 0.2
        }; */
        var posizione = locationServices.getLastLocation();
        params.near = {
            point: [posizione.longitude, posizione.latitude],
            max: 0.2
        };
        params.populate = 1;
        params.limit = 15;

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

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);
        console.log('RISPOSTA: ', json);

        if (json.status == 200) {
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


    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });

    xhr.send();


};

exports.getDemolitori = function(type_code, _callback) {


    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.status == 200) {

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

    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });

    xhr.send();

};

exports.getVantaggiSoci = function(type_code, _callback) {

    Ti.API.info("**TYPE CODE: " + type_code);

    var xhr = Ti.Network.createHTTPClient();

    xhr.clearCookies('http://www.aci.it');

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        //Ti.API.info("RISPOSTA: "+type_code+" " + JSON.stringify(json));

        if (json.status == 200) {

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
            "status": "ok",
            "agreement_id.status": "ok"
        },
        limit: 15
    }

    //aggiunge la parte dedicata all'ordinamento geografico
    useLocationParams(qs);

    var url = Alloy.Globals.baseURL + '/aci/syc?' + formatQS(qs);
    //var url = 'http://10.64.4.138:10000/api' + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);

    xhr.open('GET', url);

    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });

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

            xhr.clearCookies(Alloy.CFG.SSO_Endpoint);
            // xhr.clearCookies('http://login.aci.it');

            _callback(json[1]);

        } else {
            Alloy.Globals.loading.hide();
            alert("LOGIN FALLITO - Nome utente e/o password non validi");
        };

    };

    xhr.onerror = function() {
        Alloy.Globals.loading.hide();
        Ti.API.error("LOGIN: ERRORE RISPOSTA SERVER: " + this.message);
    };

    //Ti.API.info("CHIAMATA HTTP: "+ Alloy.Globals.baseURL + '/api/aci/pos?query={"agreement_id.categories.short_name":"'+type_code+'", "status": "ok", "address.location": { "$near": ['+Alloy.Globals.userPosition.longitude+','+Alloy.Globals.userPosition.latitude+'], "$maxDistance": 1 } }&limit=15');

    xhr.open('GET', Alloy.CFG.SSO_Endpoint + '/index.php?do=login&application_key=mobile&id=login&username=' + p_username + '&password=' + p_password + '');
    //  xhr.open('GET', 'http://login.aci.it/index.php?do=login&application_key=mobile&id=login&username=' + p_username + '&password=' + p_password + '');

    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });

    xhr.send();

};

exports.getUserInfo = function(p_ssoid, _callback) {

    var xhr = Ti.Network.createHTTPClient();

    xhr.clearCookies(Alloy.CFG.SSO_Endpoint);
    //  xhr.clearCookies('http://login.aci.it');

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

    xhr.open('GET', Alloy.CFG.SSO_Endpoint + '/index.php?do=getCustomUserInfo&application_key=mobile&keypass=0my6o9t6&sso-id=' + p_ssoid + '');
    //  xhr.open('GET', 'http://login.aci.it/index.php?do=getCustomUserInfo&application_key=mobile&keypass=0my6o9t6&sso-id=' + p_ssoid + '');

    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });

    xhr.send();
};

exports.getBanner = function(_callback) {

    //i banner funzionano solo per posizione, quindi se non posso usare le coordinate non mostro i banner
    function noPosition() {
        console.log('network.getBanner -> impossibile ricavare la posizione attuale');
        _callback([]);
    }

    var posizione = locationServices.getLastLocation();


    if (locationServices.useLocation()) {

        if (posizione) {
            loadBanner();
        } else {
            locationServices.getUserLocation(function(err) {
                if (err) {
                    noPosition();
                } else {
                    loadBanner();
                }
            });
        }


        function loadBanner() {


            //var lat = 40.830774;
            //var lon = 16.548602999999957x            
            var lat = posizione.latitude
            var lon = posizione.longitude;

            var xhr = Ti.Network.createHTTPClient();

            var _getRandomBanner = function(count, _callback) {
                console.log('count', count);
                var xhr = Ti.Network.createHTTPClient();

                xhr.onload = function() {
                    var json = JSON.parse(this.responseText);
                    Ti.API.info("RISPOSTA: " + json.message);
                    if (json.status == 200) {
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

                var n = 10;
                var rand = Math.floor(Math.random() * Math.max(0, count - 10));



                var url = Alloy.Globals.baseURL + '/aci/syc?query={"address.location":{"$near":[' + lon + ', ' + lat + '],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}&populate=1&limit=' + n + '&skip=' + rand;

                Ti.API.info("CHIAMATA HTTP BANNER: " + url);

                xhr.open('GET', url);

                _(getAciGeoHeaders()).each(function(v, k) {
                    xhr.setRequestHeader(k, v);
                });

                xhr.send();
            };
            //Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

            xhr.onload = function() {
                var json = JSON.parse(this.responseText);
                Ti.API.info("RISPOSTA: " + json.message);
                if (json.status == 200) {
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

            var url = Alloy.Globals.baseURL + '/aci/syc/_count?query={"address.location":{"$near":[' + lon + ', ' + lat + '],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}'

            xhr.open('GET', url);

            _(getAciGeoHeaders()).each(function(v, k) {
                xhr.setRequestHeader(k, v);
            });

            xhr.send();
        }
    } else {
        noPosition();
    }

};



/**
 * Implmenta la ricerca dei punti aci che offrono il servizio gic
 * https://mail.google.com/mail/u/2/#inbox/14b53bd6b8974a96
 * @param  {[type]} gic       denominazione servizio gic
 * @param  {boolean} fuoriGIC       se fa parte dei servizi gic o no
 * @param  {[type]} _callback
 */
exports.getPuntiAciPerServizioGIC = function(gic, fuoriGIC, _callback) {

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.status == 200) {
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
            // "_type": "del",
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

    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });


    xhr.send();

};


exports.getListaProvince = function(_callback) {

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.status == 200) {
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

    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });



    xhr.send();
}


exports.registerApp = function(_callback) {

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {
        console.log('registerApp', this.responseText);
        /* var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + json.message);

        if (json.status == 200) {
            // Ti.API.debug("RISPOSTA: " + gic + " " + JSON.stringify(json));
            _callback(json.result);

        } else {
            Alloy.Globals.loading.hide();
            alert("Errore nella comunicazione col server.");
        }; */
        _callback && _callback(this.responseText);

    };

    xhr.onerror = function(e) {
        //per ora (20151028) chiamo la callback anche se la registrazione ha dato errore
        _callback && _callback(this.responseText);
        Alloy.Globals.loading.hide();
        console.log("ERRORE RISPOSTA SERVER: ", e, url);
    };





    var url = Alloy.Globals.baseURL + '/common/clients/_register'
        //var url = 'http://10.64.4.138:10000/api' + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);

    xhr.open('PUT', url);

    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });



    xhr.send();
};


exports.registerForPush = function(_callback) {

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {
        console.log('registerForPush', this.responseText);

        _callback && _callback(this.responseText);

    };

    xhr.onerror = function(e) {
        Alloy.Globals.loading.hide();
        console.log("ERRORE RISPOSTA SERVER: ", e, url);
    };





    var url = Alloy.Globals.baseURL + '/common/clients/_register_for_push'
        //var url = 'http://10.64.4.138:10000/api' + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);

    xhr.open('POST', url);

    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    });


    var user = require('user').getCurrentUser();

    var _u = {};

    _(_(user).keys()).map(function(key) {
        var nk = key.replace('userInfo.', '');
        _u[nk] = user[key];
    });
    user = _u;

    var pn = require('ti.aci').PushNotification;
    var data = {
        token: pn.deviceToken,
        userInfo: JSON.stringify(user)
    };
    console.log('registerForPush data', data);

    xhr.send(data);


};



exports.userSignUp = function(data, _callback) {
    data.step = 1;

    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + this.responseText);
        Ti.API.info("RISPOSTA: " + this.responseData);


        _callback(json);

        Alloy.Globals.loading.hide();


    };

    xhr.onerror = function(e) {
        Alloy.Globals.loading.hide();
        console.log("ERRORE RISPOSTA SERVER: ", e, url);
        alert("Errore nella comunicazione col server.");
    };





    //var url = 'http://sso-web.svi.local/index.php?do=registrationRest&application_key=mobile&id=register';
    var url = 'http://col-login.aci.it/index.php?do=registrationRest&application_key=mobile&id=register';
    //var url = 'http://10.64.4.138:10000/api' + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);
    console.log('data', data);
    xhr.open('POST', url);

    xhr.setRequestHeader('enctype', 'multipart/form-data');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    /*    _(getAciGeoHeaders()).each(function(v, k) {
        xhr.setRequestHeader(k, v);
    }); */


    xhr.send(data);
};


exports.userCheckUsername = function(username, _callback) {


    var xhr = Ti.Network.createHTTPClient();

    xhr.onload = function() {

        var json = JSON.parse(this.responseText);

        Ti.API.info("RISPOSTA: " + this.responseText);
        Ti.API.info("RISPOSTA: " + this.responseData);

        _callback(json);


    };

    xhr.onerror = function(e) {
        alert("Errore nella comunicazione col server.");
        console.log("ERRORE RISPOSTA SERVER: ", e, url);
        _callback(e);

    };





    // var url = 'http://sso-web.svi.local/index.php?do=usernameUtility&application_key=acinew&type=check&user=' + username;
    var url = 'http://col-login.aci.it/index.php?do=usernameUtility&application_key=acinew&type=check&user=' + username;
    //var url = 'http://10.64.4.138:10000/api' + '/aci/pos?' + formatQS(qs);


    Ti.API.info("CHIAMATA HTTP: " + url);
    xhr.open('GET', url);




    xhr.send();
};



/**
 * Crea e ritorna una lista di header http comuni da inserire nelle richieste
 * @return {Array} lista chiave-valore di header da inviare
 */
function getAciGeoHeaders() {

    var h = {
        // 'Authorization': 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ=='
        'x-acigeo-appid': 'UA-57956970-2',
        'x-acigeo-uuid': require('environment').sessionUUID,
        'x-acigeo-devid': Ti.Platform.id,
        'x-acigeo-appver': Ti.App.version,
        'x-acigeo-devos': OS_IOS ? 'ios' : 'android'
    };

    var user = require('user').getCurrentUser();
    if (user) {
        h['x-acigeo-tessera'] = user['userInfo.tessera'];
    }



    console.log('headers', h);
    return h;
}

/**
 * Crea un gestore comune delle risposte del server
 * @param  {[type]} err    [description]
 * @param  {[type]} result [description]
 * @return {[type]}        [description]
 */
function buildRequestHandler(callback) {

    return function(err, json) {

        if (err || json.status != 200) {
            //azioni da eseguire in caso di errore
            console.log('request error', err, json);
        } else {
            //azioni comuni da eseguire in caso di successo
            console.log('request ok', json);
        }

        callback && callback(err, json.result);

    };

}

exports.getAciGeoHeaders = getAciGeoHeaders;




//
// acigeo
//

var acigeo = require('ti.aci').Services.acigeo;

//imposto gli headers di sistema
acigeo.setConfig('headers', {
    // 'Authorization': 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ=='
    'x-acigeo-appid': 'UA-57956970-2',
    'x-acigeo-devid': Ti.Platform.id,
    'x-acigeo-appver': Ti.App.version,
    'x-acigeo-devos': function() {
        OS_IOS ? 'ios' : 'android';
    }
});

acigeo.setConfig('base_url', Alloy.CFG.AciGeo_BaseUrl);

console.log('network acigeo', Alloy.CFG.AciGeo_BaseUrl, acigeo.getConfig('base_url'));

/**
 * Metodo di accesso alle collezioni syc
 * @param  {hash}   params   hash di parametri della richiesta - controllare i doc della libreria acigeo
 * @param  {Function} cb     callback nella forma (err, result)
 */
exports.syc = function(params, cb) {
    acigeo.syc(params, buildRequestHandler(cb));
}

/**
 * Wrapper della funzione syc che permette la richiesta degli ultimi punti syc inseriti
 * @param  {date}   fromDate   data di riferimento (punti da fromDate incluso)
 * @param  {Function} cb       callback nella forma (err, result)
 */
exports.sycLatest = function(source, fromDate, cb) {

    //hash set di parametri da passare al web service
    var params = {};

    //aggiungo i parametri geografici
    (function(p) {
        var settings = require('settings');
        //se ho la provincia, filtro per provincia
        // altrimenti ordino per posizione
        if (!settings.ricercaPerProssimita) {
            p.province = settings.provinciaDiRiferimento.id;
            p.near = undefined;
        } else {
            var posizione = locationServices.getLastLocation();
            p.near = [posizione.longitude, posizione.latitude, 0.2];
            p.province = undefined;
        }
    })(params);


    //aggiungo il filtro per range di date
    (function(p, date) {
        p.publishDateRange = [Math.floor(date.getTime() / 1000), null];
    })(params, fromDate);

    //aggiungo il parametro source, se presente
    (function(p, s) {
        p.source = s;
    })(params, source);

    console.log('acigeo sycLatest', params);
    //chiamo la funzione base
    exports.syc(params, cb);
};