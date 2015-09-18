(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.ti || (g.ti = {})).aci = f()}})(function(){var define,module,exports;return (function e(t,n,r){function o(i,u){if(!n[i]){if(!t[i]){var a=typeof require=="function"&&require;if(!u&&a)return a.length===2?a(i,!0):a(i);if(s&&s.length===2)return s(i,!0);if(s)return s(i);var f=new Error("Cannot find module '"+i+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[i]={exports:{}};t[i][0].call(l.exports,function(e){var n=t[i][1][e];return o(n?n:e)},l,l.exports,e,t,n,r)}return n[i].exports}var i=Array.prototype.slice;Function.prototype.bind||Object.defineProperty(Function.prototype,"bind",{enumerable:!1,configurable:!0,writable:!0,value:function(e){function r(){return t.apply(this instanceof r&&e?this:e,n.concat(i.call(arguments)))}if(typeof this!="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var t=this,n=i.call(arguments,1);return r.prototype=Object.create(t.prototype),r.prototype.contructor=r,r}});var s=typeof require=="function"&&require;for(var u=0;u<r.length;u++)o(r[u]);return o})({1:[function(require,module,exports){
/**
 * Modulo che estrae la gestione degli eventi
 * Si usa per implementare il meccanismo ad eventi in altri moduli
 */



/**
 * Definisce lo scope di un gestore di eventi
 */
function EventManagerScope() {

    //scaffold degli eventi
    // strutturato come un hash nella forma
    // "nome evento" : [array degli handler]
    var handlers = {};

    /**
     * Getter per gli handler
     * @param  {string} type nome dell'evento
     * @return {array}      array degli handler associati all'evento
     */
    this.getHandlers = function(type) {
        return handlers[type] || [];
    };

    /**
     * Setter per gli handler
     * @param  {string} type nome dell'evento
     * @return {array}   h   array degli handler associati all'evento
     */
    this.setHandlers = function(type, h) {
        handlers[type] = h;
    };

}

/**
 * Aggiunge un handler ad un evento
 * @param {string}   type nome dell'evento
 * @param {Function} cb   handler
 */
EventManagerScope.prototype.addEventListener = function(type, cb) {
    //aggiungo la callback al dizionario degli handler
    var handlers = this.getHandlers(type);

    if (handlers) {
        handlers.push(cb);
        this.setHandlers(type, handlers);
    }

};

/**
 * Rimuove un handler da un evento
 * @param {string}   type nome dell'evento
 * @param {Function} cb   handler
 */
EventManagerScope.prototype.removeEventListener = function(type, cb) {
    //rimuovo la callback dal dizionario degli handler
    var handlers = this.getHandlers(type);
    if (handlers) {
        var index = _(handlers[type]).indexOf(cb);
        if (index > 0) {
            handlers[type].splice(index, 1);
            this.setHandlers(type, handlers);
        }
    }
};

/**
 * Aggiunge TUTTI gli handler di un evento
 * @param {string}   type nome dell'evento
 */
EventManagerScope.prototype.removeAllEventListeners = function(type) {
    //rimuovo TUTTE le callback dal dizionario degli handler
    this.setHandlers(type, []);
};

/**
 * Scatena un evento
 * @param {string}   type nome dell'evento
 * @param {object} args argomenti da passare agli handler
 */
EventManagerScope.prototype.fireEvent = function(type, args) {
    var handlers = this.getHandlers(type);

    handlers.forEach(function(cb) {
        cb && cb(args);
    });
};





//
// PUBLIC API
// 


/**
 * Factory method per un nuovo event manager
 * @return {EventManagerScope} oggetto event manager
 */
exports.createEventManager = function() {

    return new EventManagerScope();

};

/**
 * Dato un oggetto, lo estende con le funzionalità della gestione eventi
 * @param  {object} o oggetto da estendere
 * @return {object} lo stesso oggetto, esteso
 */
exports.extendObjectWithEventManager = function(o) {
    var em = new EventManagerScope();

    o.addEventListener = em.addEventListener;
    o.removeEventListener = em.removeEventListener;
    o.removeAllEventListeners = em.removeAllEventListeners;
    o.fireEvent = em.fireEvent;

    return o;
};
},{}],2:[function(require,module,exports){
/**
 * ti-ACI
 * © ACI Informatica 2015
 *
 * ti-ACI è una libreria che raccoglie utility e componenti UI utilizzabili da tutte le applicazioni Titanium.
 * index.js è il file principale della libreria, nel quale vengono esposti i sotto-moduli
 */



exports.PushNotification = require('./pushnotification');
exports.EventManager = require('./eventmanager');
exports.REST = require('./rest');
//exports.Services = require('./services');
},{"./eventmanager":1,"./pushnotification":3,"./rest":4}],3:[function(require,module,exports){
(function (console){
/**
 * Modulo per la gestione delle push notification
 * generalizza il comportamento tra le piattaforme e tiene traccia dei token
 */

var deviceToken;

var OS_IOS = Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad';
var OS_ANDROID = Ti.Platform.osname === 'android';

var r = function(p) {
    return require(p);
}

var Cloud = r("ti.cloud");

/**
 * Callback da chiamare quando ri riceve una push notification
 * @param  {[type]} e [description]
 */
function onNotification(e) {
    console.log('retrieveDeviceToken, onNotification', e);

    var data = OS_IOS ? e.data : JSON.parse(e.payload);

    console.log('retrieveDeviceToken, data', data);


    //richiamo gli handler dell'app associati alla notifica
    notify(getNotificationType(data), data.payload);

    /*
    if (OS_IOS) {
        var badge = Math.max(0, Titanium.UI.iPhone.getAppBadge() - 1);
        Titanium.UI.iPhone.setAppBadge(badge);

        Cloud.PushNotifications.setBadge({
            device_token: deviceToken,
            badge_number: badge
        }, function(r, p) {
            console.log('setBadge', r, p);
        });
    }
    */
}


/**
 * Estrae il tipo della notifica dal payload
 * @param  object payload payload della notifica
 * @return string         tipo della notifica
 */
function getNotificationType(payload) {
    return payload.type;
}


/**
 * Metodo cross-platorm per abilitare il device a ricevere push notification
 * @return {[type]} [description]
 */
function retrieveDeviceToken(cb) {

    var types = OS_IOS ? [
        Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
        Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
        Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
    ] : undefined;


    function onSuccess(e) {
        console.log('retrieveDeviceToken, success', e);
        deviceToken = e.deviceToken;
        cb && cb(null, e);
    }

    function onError(e) {
        console.log('retrieveDeviceToken, error', e);
        cb && cb(e);

    }

    function requestToken() {
        console.log('requestToken');
        if (OS_IOS) {

            Ti.Network.registerForPushNotifications({
                success: onSuccess,
                error: onError,
                types: types,
                callback: onNotification
            });

        } else if (OS_ANDROID) {

            var cp = r('ti.cloudpush');

            cp.retrieveDeviceToken({
                success: onSuccess,
                error: onError
            });

            cp.addEventListener('callback', onNotification);

        } else {
            //non supportiamo altre piattaforme al momento
            onError('piattaforma non supportata');
        }
    }


    if (OS_IOS && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
        // Wait for user settings to be registered before registering for push notifications
        Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
            console.log('requestToken usernotificationsettings');

            // Remove event listener once registered for push notifications
            Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

            requestToken();
        });

        console.log('requestToken registerUserNotificationSettings');

        // Register notification types to use
        Ti.App.iOS.registerUserNotificationSettings({
            types: types
        });
    } else {
        requestToken();
    }


}




function subscribeToChannel(channel, cb) {
    // Subscribes the device to the 'news_alerts' channel
    // Specify the push type as either 'android' for Android or 'ios' for iOS
    Cloud.PushNotifications.subscribeToken({
        device_token: deviceToken,
        channel: channel,
        type: Ti.Platform.name == 'android' ? 'android' : 'ios'
    }, function(e) {
        if (e.success) {
            cb && cb();
        } else {
            //alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
            console.error('subscribeToChannel', e);
        }
    });
}

function unsubscribeToChannel(channel, cb) {
    // Unsubscribes the device from the 'test' channel
    Cloud.PushNotifications.unsubscribeToken({
        device_token: deviceToken,
        channel: channel,
    }, function(e) {
        if (e.success) {
            cb && cb();
        } else {
            // alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
            console.error('unsubscribeToChannel', e);
        }
    });
}



/**
 * Gestione degli eventi
 * Le notifiche possono essere gestite dall'app trasmite un meccanismo di eventi globali
 * Le seguenti funzioni simulano il meccanismo nativo di gestione degli eventi
 */


var NotificationEventManager = require("./eventmanager").createEventManager();


function addNotificationListener(type, cb) {
    NotificationEventManager.addEventListener(type, cb);
};

function removeNotificationListener(type, cb) {
    NotificationEventManager.removeEventListener(type, cb);
}

function notify(type, args) {
    NotificationEventManager.fireEvent(type, args);
}






/**
 * Public API
 */

/**
 * Metodo cross-platorm per abilitare il device a ricevere push notification
 */
exports.retrieveDeviceToken = retrieveDeviceToken;
exports.subscribeToChannel = subscribeToChannel;
exports.unsubscribeToChannel = unsubscribeToChannel;
exports.addNotificationListener = addNotificationListener;
exports.removeNotificationListener = removeNotificationListener;
}).call(this,require("--console--"))
},{"--console--":13,"./eventmanager":1}],4:[function(require,module,exports){
(function (console){
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
}).call(this,require("--console--"))
},{"--console--":13}],5:[function(require,module,exports){

module.exports = (function () { return this; })();

module.exports.location = {};

},{}],6:[function(require,module,exports){
(function (setTimeout){
/* global Ti:true, Titanium:true */

var process = module.exports = {};

process.nextTick = function nextTick(fn) {
  setTimeout(fn, 0);
};

process.title = 'titanium';
process.titanium = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.stdout = {};
process.stderr = {};

process.stdout.write = function (msg) {
  Ti.API.info(msg);
};

process.stderr.write = function (msg) {
  Ti.API.error(msg);
};

'addEventListener removeEventListener removeListener hasEventListener fireEvent emit on off'.split(' ').forEach(function (name) {
  process[ name ] = noop;
});

function noop() {}

}).call(this,require("--timers--").setTimeout)
},{"--timers--":7}],7:[function(require,module,exports){
(function (global){

module.exports.clearInterval = clearInterval;
module.exports.clearTimeout = clearTimeout;
module.exports.setInterval = setInterval;
module.exports.setTimeout = setTimeout;

// See https://html.spec.whatwg.org/multipage/webappapis.html#dom-windowtimers-cleartimeout

function clearInterval(intervalId) {
  try {
    return global.clearInterval(intervalId);
  }
  catch (e) {
    // Do nothing
    return undefined;
  }
}

function clearTimeout(timeoutId) {
  try {
    return global.clearTimeout(timeoutId);
  }
  catch (e) {
    // Do nothing
    return undefined;
  }
}

function setInterval(func, delay) {
  var args = [];
  for (var i = 2, l = arguments.length; i < l; ++i) {
    args[ i - 2 ] = arguments[ i ];
  }

  return global.setInterval(function () {
    func.apply(this, args);
  }, +delay);
}

function setTimeout(func, delay) {
  var args = [];
  for (var i = 2, l = arguments.length; i < l; ++i) {
    args[ i - 2 ] = arguments[ i ];
  }

  return global.setTimeout(function () {
    func.apply(this, args);
  }, +delay);
}

}).call(this,require("--global--"))
},{"--global--":5}],8:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":11}],9:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],11:[function(require,module,exports){
(function (process,global,console){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require("--process--"),require("--global--"),require("--console--"))
},{"--console--":13,"--global--":5,"--process--":6,"./support/isBuffer":10,"inherits":9}],12:[function(require,module,exports){
module.exports = now

function now() {
    return new Date().getTime()
}

},{}],13:[function(require,module,exports){
var util = require("util");
var now = require("date-now");

var _console = {};
var times = {};

var functions = [
	['log','info'],
	['info','info'],
	['warn','warn'],
	['error','error']
];

functions.forEach(function(tuple) {
	_console[tuple[0]] = function() {
		Ti.API[tuple[1]](util.format.apply(util, arguments));
	};
});

_console.time = function(label) {
	times[label] = now();
};

_console.timeEnd = function(label) {
	var time = times[label];
	if (!time) {
		throw new Error("No such label: " + label);
	}

	var duration = now() - time;
	_console.log(label + ": " + duration + "ms");
};

_console.trace = function() {
	var err = new Error();
	err.name = "Trace";
	err.message = util.format.apply(null, arguments);
	_console.error(err.stack);
};

_console.dir = function(object) {
	_console.log(util.inspect(object) + "\n");
};

_console.assert = function(expression) {
	if (!expression) {
		var arr = Array.prototype.slice.call(arguments, 1);
		require("assert").ok(false, util.format.apply(null, arr));
	}
};

module.exports = _console;

},{"assert":8,"date-now":12,"util":11}]},{},[2])(2)
});