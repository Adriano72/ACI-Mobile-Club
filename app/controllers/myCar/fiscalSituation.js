/**
 * @author Antonio Polifemi
 */

var tiACI = require('ti.aci');
var commons = require('commons');
var navigation = require('navigation');

var args = arguments[0];



function onActivityOpen() {
    Alloy.Globals.loading.show(L('fiscasituation_loading'), false);


    var authToken = tiACI.Services.SSO.authToken
    //  var targa =  $.labelLicensePlate.text;
    var targa =   "MS100EM";
    var serieTarga = 1;
    tiACI.Services.praTasse.situazioneFiscale(targa, serieTarga, authToken, {
        success: function(data) {
            console.log('situazioneFiscale success', data);
        var itemList = [];
            for (var i in data.periodiTributari) {
                Ti.API.info(JSON.stringify(data.periodiTributari[i]));
                var item = {
                    startFiscalPeriod: {
                        text: formatDate(data.periodiTributari[i].dataDecorrenza)
                    },
                    endFiscalPeriod: {
                        text: formatDate(data.periodiTributari[i].dataScadenza)
                    },
                    totalAmount: {
                        text: "€ " + data.periodiTributari[i].importoDovuto
                    },
                    status: {
                        text: translateStatus(data.periodiTributari[i].stato),
                        color: data.periodiTributari[i].stato == "DA_PAGARE" ? "#f2840e" : data.periodiTributari[i].stato == "IRREGOLARE" ? "#ea0e0e" : "#23af19"
                    },
                    iconStatus: {
                        image: data.periodiTributari[i].stato == "DA_PAGARE" ? "/images/mycar_ic_dapagare.png" : data.periodiTributari[i].stato == "IRREGOLARE" ? "/images/mycar_ic_irregolare.png" : "images/mycar_ic_regolare.png"
                    },
                    imgActionButton: {
                        image: data.periodiTributari[i].stato == "DA_PAGARE" ? "/images/mycar_ic_paga.png" : data.periodiTributari[i].stato == "IRREGOLARE" ? "/images/mycar_ic_email.png" : ""
                    },
                    nameActionButton: {
                        text: data.periodiTributari[i].stato == "DA_PAGARE" ? L('paga_bollo_button') : L('punto_aci_button')
                    },
                    action: {
                        visible: data.periodiTributari[i].stato === "REGOLARE" ? false : true
                    }
                };
                itemList.push(item);
            }
            $.fiscalSection.setItems(itemList);
            Alloy.Globals.loading.hide();
        },
        error: function(e) {
            console.error('situazioneFiscale error', e);
            Alloy.Globals.loading.hide();
            Titanium.UI.createNotification({
                duration: Titanium.UI.NOTIFICATION_DURATION_LONG,
                message: L("fiscalsituation_alert")
            }).show();
        }
    });
} // onActivityOpen



function onArrowClick() {
    $.fiscalSituation.close();
}

function buttonAction(e) {

    var status = e.section.items[e.itemIndex].status.text;

    switch(status){
        case "DA PAGARE":
            var arg = args;
            navigation.open('myCar/payTax', {
                targa: $.labelLicensePlate.text,
                serieTarga: arg.serieTarga,
                codiceReigione: arg.codiceRegione,
                modello: $.veicleLabel.text,
                tipo: tipo,
                data: e.section.items[e.itemIndex]
            });
            break;
        case "IRREGOLARE":
            navigation.openPuntiAciList_ServiziGIC('Servizi di Assistenza Bollo Auto');
            break;

            

    }

}

function translateStatus(status) {
    switch (status) {
        case "IRREGOLARE":
            return L('stato_irregolare_label');
        case "DA_PAGARE":
            return L('stato_dapagare_label');
        case "REGOLARE":
            return L('stato_regolare_label');
        default:
            break;
    }
} 

function formatDate(date){
    date = date.split('/');
    var year,
        month;
    if (date.length > 2) {
        month = date[1];
        year = date[2];
    } else {
        month = date[0];
        year = date[1];
    }
    switch(month) {
    case '01':
        month = L('January');
        break;
    case '02':
        month = L('February');
        break;
    case '03':
        month = L('March');
        break;
    case '04':
        month = L('April');
        break;
    case '05':
        month = L('May');
        break;
    case '06':
        month = L('June');
        break;
    case '07':
        month = L('July');
        break;
    case '08':
        month = L('August');
        break;
    case '09':
        month = L('September');
        break;
    case '10':
        month = L('October');
        break;
    case '11':
        month = L('November');
        break;
    case '12':
        month = L('December');
        break;
    default:
        break;
    }
    return month + ' ' + year;
}


var tipo;
(function constructor(args){
    commons.initWindow($.win, L("intro_cardetail_text"), null, []);
    tipo = args.tipo;
    $.labelLicensePlate.text = args.targa;
    $.veicleLabel.text = (args.modello || "").trim();
    $.veicleImg.image = args.tipo === "AUTOVEICOLO" ? "/images/mycar_ic_car.png" : arg.tipo === "MOTOVEICOLO" ? "/images/mycar_ic_scooter.png" : "/images/mycar_ic_autocarri.png";
console.log('tipo', args.tipo, $.veicleImg.image);
})(arguments[0] || {});


