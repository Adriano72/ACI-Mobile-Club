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
 */
function call(url, method, parameters, callback) {
    Ti.API.debug("webServiceCall " + url);

    if (!Titanium.Network.online) {
        //alert(L("noconnectionapp"));
        if (callback) {
            callback('noconnection');
        }
        return;
    }



    var xhr = Titanium.Network.createHTTPClient();

    if (url.substr(0, 5) === "https") {
        xhr.validatesSecureCertificate = false;
        xhr.tlsVersion = Ti.Network.TLS_VERSION_1_0;
    }
    /*
	 xhr.onsendstream = function(e) {

	 if (windowEnabled) {
	 var progress = (OS_ANDROID) ? e.progress : e.progress;
	 if (Math.round(progress * 100) <= 100) {
	 //activityIndicator.message = L("loading") + " " + (Math.round(progress * 100)).toString().replace(".", "") + '%';
	 }
	 }

	 };
	 */
    xhr.onerror = function(e) {
        Ti.API.debug("xhr onError " + JSON.stringify(e));



        if (callback) {
            callback(e);
        }
    };

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

    Ti.API.debug(url);
    Ti.API.debug(parameters);
    if (method.toUpperCase() == "GET") {
        url = url + '?' + toQueryString(parameters);
        Ti.API.debug(url);
        xhr.open(method, url);
        xhr.send();
    } else {
        xhr.open(method, url);
        xhr.send(JSON.stringify(parameters));

    }




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
 */
exports.get = function(url, parameters, callback) {
    call(url, 'GET', parameters, callback);
};

/**
 * Shorthand di call() per eseguire chiamate POST
 * @param  {string}   url        url a cui indirizzare la chiamata
 * @param  {object}   parameters [parametri da allegare alla chiamata]
 * @param  {Function} callback   callback di risposta nel formato function(err, result)
 */
exports.post = function(url, parameters, callback) {
    call(url, 'POST', parameters, callback);
};

/**
 * Shorthand di call() per eseguire chiamate PUT
 * @param  {string}   url        url a cui indirizzare la chiamata
 * @param  {object}   parameters [parametri da allegare alla chiamata]
 * @param  {Function} callback   callback di risposta nel formato function(err, result)
 */
exports.put = function(url, parameters, callback) {
    call(url, 'PUT', parameters, callback);
};