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
