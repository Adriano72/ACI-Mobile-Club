/**
 * @author Antonio Polifemi
 */

var tiACI = require('ti.aci');
var commons = require('commons');

var targa = arguments[0].targa,
    serieTarga = arguments[0].serieTarga,
    modello = arguments[0].modello,
    tipo = arguments[0].tipo;

$.labelLicensePlate.text = targa;
$.veicleLabel.text = modello;
$.veicleImg.image = tipo === "AUTOVEICOLO" ? "/images/mycar_ic_car.png" : tipo === "MOTOVEICOLO" ? "/images/mycar_ic_scooter.png" : "/images/mycar_ic_autocarri.png";
console.log('tipo', tipo, $.veicleImg.image);

function onActivitiLoaded() {
    Alloy.Globals.loading.show(L('detail_loading'), false);

    var token = tiACI.Services.SSO.authToken;
    tiACI.Services.praTasse.detailsVehicle(targa, serieTarga, token, {

        success: function(details) {
            console.log('myCar/carDetail success', details);
            details = details.datiVeicolo;
            $.auto.text = tipo === "AUTOVEICOLO" ? L('auto_label') : tipo === "MOTOVEICOLO" ? L('motociclo_label') : L('autocarro_label');
            $.uso.text = details.uso;
            $.immatricolato.text = details.formattedPrimaImmatricolazione;
            $.alimentazione.text = details.alimentazione;
            $.cavalli.text = details.cavalliFiscali;
            $.cilindrata.text = details.cilindrata;

            // ---------------------- inserire i controlli appena sono disponibili i paramentri dal servizio ------------------------------------
            $.rubatoLabel.text = L("rubato_si_label");
            $.ultratrentenneLabel.text = L("ultratrentenne_si_label");
            $.neopatentatiLabel.text = L("neopatentati_si_label");
            Alloy.Globals.loading.hide();
        },
        error: function(e) {
            console.log('myCar/carDetail error', details);

            $.detailContainer.hide();
            Alloy.Globals.loading.hide();
            var dialog = Titanium.UI.createAlertDialog({
                message: L("detail_alert"),
                buttonNames: ["OK"]
            });
            dialog.addEventListener('click', function() {
                onArrowClick();
            });
            dialog.addEventListener('androidback', function() {
                onArrowClick();
            });
            dialog.show();
        }
    });

}

function onArrowClick() {
    $.carDetail.close();
}


commons.initWindow($.win, L("intro_cardetail_text"), null, []);