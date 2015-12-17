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
	$.message.html = 'Inserisci il tuo Codice Fiscale';

	//Creo la form col codice di verifica
	$.form.init({
    	fields: [{
            fieldId: 'cf',
            hintText: 'Codice Fiscale',
            required: true,
            format: /^[a-z]{6}\d{2}[abcdehlmprst]\d{2}[a-z]\d{3}[a-z]$/i,
            value: require('user').getCurrentUser()['userInfo.codiceFiscale']
        }],
        onSubmit: args.onSubmit || _.noop
    });

})(arguments[0] || {});