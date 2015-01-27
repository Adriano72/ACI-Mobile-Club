/**
 * Modulo che offre servizi comuni per le chiamate rest alle api remote
 * @author Emanuele De Cupis
 */


/**
 * Funzione generica per eseguire una chiamata rest
 * @param  {string}   url        url a cui indirizzare la chiamata
 * @param  {string}   method     metodo http della chiama
 * @param  {object}   parameters [parametri da allegare alla chiamata]
 * @param  {Function} callback   callback di risposta nel formato function(err, result)
 * @param  {object}   headers    eventuali intestazioni della richiesta http
 */
function call(url, method, parameters, callback, headers) {
    Ti.API.debug("webServiceCall " + url);

    /*if (!Titanium.Network.online) {
        //alert(L("noconnectionapp"));
        if (callback) {
            callback('noconnection');
        }
        return;
    }*/



    var xhr = Titanium.Network.createHTTPClient();

    /*if (url.substr(0, 5) === "https") {
        xhr.validatesSecureCertificate = false;
        xhr.tlsVersion = Ti.Network.TLS_VERSION_1_0;
    }*/

    //controllo che la url non abbia dichiarato delle credenziali
    //in caso, devo aggiungere l'header di autenticazione
    /*    var U = exports.parseUrl(url);
    if (U.username && U.password) {
        console.log("aggiunge autorizzazione");
        xhr.setRequestHeader('Authorization', exports.formatBasicAuthentication(U.username, U.password));
    } else {
        console.log("NON aggiunge autorizzazione");

    }
    */





    /**
     * Definisco il gestore dell'errore
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    xhr.onerror = function(e) {
        Ti.API.debug("xhr onError " + JSON.stringify(e));


        Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
        if (callback) {
            e.message = this.message;
            callback(e);
        }
    };


    /**
     * Definisco il gestore per il caricamento della risposta
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    xhr.onload = function(e) {
        Ti.API.debug("xhr onSuccess");


        try {
            var response = this.responseText;

            Ti.API.debug("response\n " + response);
            var currentObject = JSON.parse(response);
            Ti.API.debug("parsed as\n " + JSON.stringify(currentObject));
            if (callback) {

                Ti.API.debug("calling success handler");
                if (callback) {
                    callback(null, currentObject);
                }

            }
        } catch (ex) {
            Ti.API.debug("error " + JSON.stringify(ex));
            if (callback) {
                callback(e);
            }
        }



    };

    var uname = 'acimobileclub';
    var pass = 'Iniziale$01';
    authstr = 'Basic ' + Titanium.Utils.base64encode(uname + ':' + pass);



    Ti.API.debug(url);
    Ti.API.debug(parameters);

    //formatta url e parametri a seconda del tipo di richiesta
    if (method.toUpperCase() == "GET") {
        url = url + '?' + toQueryString(parameters);
        parameters = undefined;
    } else {
        parameters = JSON.stringify(parameters);
    }


    xhr.open(method, url);

    //aggiungo gli eventuali header
    //bisogna farlo tra open() e send()!
    // https://twitter.com/balanza/status/560108493945192449
    for (var k in headers) {
        if (headers.hasOwnProperty(k)) {
            var h = headers[k];
            console.log("set header", k, h);
            xhr.setRequestHeader(k, h);
        }
    }

    xhr.send(parameters);




};

/**
 * Utility che formatta una coppia username/password in un token valido per l'autenticazione http basic
 * http://it.wikipedia.org/wiki/Basic_access_authentication#Lato_Client
 * @param  {string} username
 * @param  {string} password
 * @return {string}          token formattato secondo le specifiche
 */
exports.formatBasicAuthentication = function(username, password) {
    return 'Basic ' + Ti.Utils.base64encode(username + ':' + password);
}

/**
 * Utility per il parsing della url
 * playground: http://jsbin.com/rijiha/1/edit?html,js,console
 * @param  {string} url url da esaminare
 * @return {object}     hash con le parti della url
 */
exports.parseUrl = function(url) {
    var r = /^((http[s]?|ftp):\/)?\/?(([\w\-\.]+):([\w\-\.\$]+)@)?([^:\/\s]+)((\/\w+)*?(:([0-9]+))\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
    var tmp = r.exec(url);

    return {
        original: tmp[0],
        protocol: tmp[2],
        username: tmp[4],
        password: tmp[5],
        host: tmp[6],
        port: tmp[10],
        path: tmp[11],
        query: tmp[12]
    };
};

function toQueryString(obj) {

    var params = _.map(obj, function(value, key) {
        return key + '=' + JSON.stringify(value);
    });

    return params.join('&');
}

/**
 * Shorthand di call() per eseguire chiamate GET
 * @param  {string}   url        url a cui indirizzare la chiamata
 * @param  {object}   parameters [parametri da allegare alla chiamata]
 * @param  {Function} callback   callback di risposta nel formato function(err, result)
 * @param  {object}   headers    eventuali intestazioni della richiesta http
 */
exports.get = function(url, parameters, callback, headers) {
    call(url, 'GET', parameters, callback, headers);
};

/**
 * Shorthand di call() per eseguire chiamate POST
 * @param  {string}   url        url a cui indirizzare la chiamata
 * @param  {object}   parameters [parametri da allegare alla chiamata]
 * @param  {Function} callback   callback di risposta nel formato function(err, result)
 * @param  {object}   headers    eventuali intestazioni della richiesta http
 */
exports.post = function(url, parameters, callback, headers) {
    call(url, 'POST', parameters, callback, headers);
};

/**
 * Shorthand di call() per eseguire chiamate PUT
 * @param  {string}   url        url a cui indirizzare la chiamata
 * @param  {object}   parameters [parametri da allegare alla chiamata]
 * @param  {Function} callback   callback di risposta nel formato function(err, result)
 * @param  {object}   headers    eventuali intestazioni della richiesta http
 */
exports.put = function(url, parameters, callback, headers) {
    call(url, 'PUT', parameters, callback, headers);
};