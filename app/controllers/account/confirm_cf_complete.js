function check(){

	Alloy.Globals.loading.show('Attendere');

	var user = require('user');
	user.refreshData(function(err, res){
			Alloy.Globals.loading.hide();
		console.log('refresh', err, res);
		if(user.hasCellulare){
			alert('confermato');
		} else {
			alert('non confermato');
		}

	});

}

function changeMobile(){

}


/**
 * ### constructor
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
(function(args) {

    //inizializzazioni comuni della Window
    require('commons').initWindow($.win, 'Conferma Codice Fiscale', null, []);

    var userData = require('user').getCurrentUser();

    $.message.html = 'Abbiamo inviato un SMS con il "codice di verifica" al numero <strong>' + userData['userInfo.mobileTemp'] + '</strong>. Inserisci il codice nella tua Area Riservata sul sito ACI e conferma la tua identità';

})(arguments[0] || {});