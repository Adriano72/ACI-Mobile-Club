
var tiACI = require('ti.aci');
var commons = require('commons');
var navigation = require('navigation');

function submit(){

    var errors = [];

    var data = {
        targa: $.targa.value,
        tipo: $.tipo.value
    };

    console.log('submit', data);

    //validazione
    if(!data.targa){
        errors.push('Targa obbligatoria');
        $.targa.isValid = false;
    } else if(!data.targa.match(/[a-z]{2}\d{3}[a-z]{2}/i)){
        errors.push('Targa non valida');
        $.targa.isValid = false;
    } else {
        $.targa.isValid = true;  
    }

    if(!data.tipo){
       errors.push('Tipo veicolo obbligatorio');
        $.tipo.isValid = false;
    } else {
        $.tipo.isValid = true;
    }


    var isValid =  $.tipo.isValid && $.targa.isValid;

    if(isValid){
        
        navigation.open('infoTarga/carDetail', {
            targa: data.targa.toUpperCase(),
            serieTarga: tiACI.Services.praTasse.tipoVeicolo[data.tipo]
        });
    } else {
        alert(errors[0]);
    }

}

(function(args){
	
	commons.initWindow($.win, 'Infotarga', null, []);

    $.title.html = "Con <strong>InfoTarga</strong> puoi ottenere informazioni tecniche, amministrative e costi di gestione su di un veicolo digitando al sua targa."

    /*


	$.form.init({
		fields:[{
            fieldId: 'targa',
            type: 'text',
            hintText: 'Targa',
            required: true,
            format: /^[a-z]{2}\d{3}[a-z]{2}$/i
        }, 
		{
            fieldId: 'tipo_veicolo',
            hintText: 'Tipo Veicolo',
            required: true,
            type: 'iconselector',
            items:[
            	{image: '/images/mycar_ic_car.png', value: 'car'},
            	{image: '/images/mycar_ic_scooter.png', value: 'scooter'},
            	{image: '/images/mycar_ic_autocarri.png', value: 'autocarro'}
            ]
        }],
        onSubmit: function(data){
        	console.log('submit', data);
        }
	});

*/

})(arguments[0]);
