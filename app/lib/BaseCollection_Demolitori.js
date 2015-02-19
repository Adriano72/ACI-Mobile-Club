/**
 * Questo modulo è una raccolta di metodi base da applicare alla collezione dei demolitori
 * Nei metodi esportati, 'this' si riferisce all'istanza della collezione
 * Nella collezione ci si aspetta che sia dichiarato il parametro 'type_code' nelle configurazioni
 */

var base = require('BaseCollection_AciGeo');

//sovrascrive il metodo di raccolta dati 
this.retrieve_method = require('network').getDemolitori;

//raccolta di metodi specifici delle collezioni di tipo punti aci
var demolitori = {};

module.exports = _.extend(base, demolitori);