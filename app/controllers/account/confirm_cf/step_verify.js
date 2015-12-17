/**
 * 
 */


$.validate = $.form.validate;

$.read = $.form.read;



/**
 * ### constructor
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
(function constructor(args){

console.log('step verify constructor');
	//imposto il messaggio
	var userData = require('user').getCurrentUser();
	$.message.html = 'Abbiamo inviato un SMS con il "codice di verifica" al numero <strong>' + userData['userInfo.mobileTemp'] + '</strong>. Inserisci il codice nella tua Area Riservata sul sito ACI e conferma la tua identità';

	//Creo la form col codice di verifica
	$.form.init({
    	fields: [{
            fieldId: 'code',
            hintText: 'Codice di verifica',
            required: true,
            keyboardType: Ti.UI.KEYBOARD_PHONE_PAD,
            format: /^[0-9]{5}$/
        }]
    });

})(arguments[0] || {});