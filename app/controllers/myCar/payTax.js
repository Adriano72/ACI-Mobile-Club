/**
 * @author Antonio Polifemi
 */

var tiACI = require('ti.aci');
var commons = require('commons');
var navigation = require('navigation');





	function getRegion(region) {
		switch(region) {
		case 1:
			return L("abruzzo_region");
		case 2:
			return L("basilicata_region");
		case 1:
			return L("campania_region");
		case 4:
			return L("emiliaromagna_region");
		case 5:
			return L("lazio_region");
		case 6:
			return L("liguria_region");
		case 7:
			return L("molise_region");
		case 10:
			return L("lombardia_region");
		case 12:
			return L("puglia_region");
		case 13:
			return L("toscana_region");
		case 14:
			return L("umbria_region");
		case 19:
			return L("bolzano_province");
		case 16:
			return L("trento_province");
		case 20:
			return L("valledaosta_region");
		default:
			break;
		}
	}// getRegion



function onPayTax(){
	Titanium.Platform.openURL('https://servizi.aci.it/Bollonet/');
}





(function constructor(args){
    commons.initWindow($.win, L("intro_paytax_text"), null, []);

	data = args.data;
	$.labelImporto.text = data.totalAmount.text;
	$.labelRegione.text = getRegion(args.codiceReigione);
	$.labelStartPeriod.text = data.endFiscalPeriod.text;
	$.labelStopPeriod.text = data.startFiscalPeriod.text;
	$.labelLicensePlate.text = args.targa;
	$.veicleLabel.text = args.modello;
	$.veicleImg.image = args.tipo === "AUTOVEICOLO" ? "/images/mycar_ic_car.png" : args.tipo === "MOTOVEICOLO" ? "/images/mycar_ic_scooter.png" : "/images/mycar_ic_autocarri.png";

})(arguments[0] || {});


