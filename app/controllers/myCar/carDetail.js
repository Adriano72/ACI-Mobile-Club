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

       success : function(response) {
            Ti.API.info(JSON.stringify(response));
            details = response.datiVeicolo;
            $.auto.text = tipo === "AUTOVEICOLO" ? L('auto_label') : tipo === "MOTOVEICOLO" ? L('motociclo_label') : L('autocarro_label');
            $.uso.text = details.uso;
            $.immatricolato.text = details.dataPrimaImmatricolazione;
            $.alimentazione.text = details.alimentazione;
            $.cavalli.text = details.cavalliFiscali;
            $.cilindrata.text = details.cilindrata;

            // ---------------------- inserire i controlli appena sono disponibili i paramentri dal servizio ------------------------------------
            if(!response.hasOwnProperty('denunciaFurto')) {
                $.rubatoLabel.text = L("rubato_nd_label");
                discaimerRubato = L("rubato_nd_label");
            } else if(response.denunciaFurto) {
                $.rubatoLabel.text = L("rubato_si_label");
                discaimerRubato = L("disclaimer_Rubato_si");
            }
            else {
                $.rubatoLabel.text = L("rubato_no_label");
                discaimerRubato = L("disclaimer_Rubato_no");
            }
            if(!response.hasOwnProperty('ultratrentennale')) {
                $.ultratrentenneLabel.text = L("ultratrentenne_nd_label");
            } else if(response.ultratrentennale) {
                $.ultratrentenneLabel.text = L("ultratrentenne_si_label");
            }
            else {
                $.ultratrentenneLabel.text = L("ultratrentenne_no_label");
            }
            if(!response.hasOwnProperty('neopatentati')) {
                $.neopatentatiLabel.text = L("neopatentati_nd_label");
            } else if(response.neopatentati) {
                $.neopatentatiLabel.text = L("neopatentati_si_label");
            }
            else {
                $.neopatentatiLabel.text = L("neopatentati_no_label");
            }
            Alloy.Globals.loading.hide();
        },
        error : function(e) {
            $.detailContainer.hide();
            Alloy.Globals.loading.hide();
            var dialog = Titanium.UI.createAlertDialog({
                message:L("detail_alert"),
                buttonNames : ["OK"]
            });
            dialog.addEventListener('click',function(){
                onArrowClick();
            });
            dialog.addEventListener('androidback',function(){
                onArrowClick();
            });
            dialog.show();
        }
        
    });

}


function showDisclaimer(message) {
    var dialog = Titanium.UI.createAlertDialog({
        message: message,
        buttonNames : ["Chiudi"]
    });
    dialog.show();  
}

function showDislaimerImmatricolazione() {
    showDisclaimer(L('disclaimer_Immatricolazione'));
}

function showDislaimerRubato() {
    showDisclaimer(discaimerRubato);
}

function showDislaimerUltratrentennale() {
    showDisclaimer(L('disclaimer_Ultratrentennale'));
}

function showDislaimerNeoPatentati() {
    showDisclaimer(L('disclaimer_NeoPatentati'));
}

function onArrowClick() {
    $.win.close();
}



commons.initWindow($.win, L("intro_cardetail_text"), null, []);