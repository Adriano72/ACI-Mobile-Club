/**
 * Modulo per salvare le variabili di stato dell'app
 * (come Alloy.Globals, ma ottimizzato)
 */

var utility = require('utility');


/**
 * variabile globale che identifica la sessione (intesa come avvio dell'app)
 * @type {[type]}
 */
exports.sessionUUID = utility.uuid.v4();


/**
 * Property globale che ci dice se è la prima esecuzione dell'app dopo l'installazione
 */
Object.defineProperty(exports, 'isFirstRun', {
    get: function() {
        var v = Ti.App.Properties.getBool('app-first-run');
        console.log('isFirstRun', v);
        return _.isUndefined(v) || _.isNull(v) ? true : v;
    },
    set: function(v) {
        return Ti.App.Properties.setBool('app-first-run', v);
    }
});