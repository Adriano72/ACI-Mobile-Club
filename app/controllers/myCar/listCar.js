/**
 * @author Antonio Polifemi
 */

var tiACI = require('ti.aci');

var commons = require('commons');

var navigation = require('navigation');

var listVehicle;


function onActivityOpen() {

    //  Alloy.Globals.loading.show(L('veicle_loading'), false);
    Alloy.Globals.loading.show(L('veicle_loading'), false);
    var authToken = tiACI.Services.SSO.authToken;
    console.log('listCar token', authToken);
    tiACI.Services.praTasse.listVehicle(authToken, {
        success: function(vehicles) {
            console.log('success', vehicles);

            listVehicle = vehicles

            var items = _(vehicles).map(function(e) {
                return {
                    template: 'templateCar',
                    icVehicle: {
                        image: (function(tipo) {
                            switch (tipo) {
                                case "AUTOVEICOLO":
                                    return "/images/mycar_ic_car.png";
                                case "MOTOVEICOLO":
                                    return "/images/mycar_ic_scooter.png";
                                default:
                                    return "/images/mycar_ic_autocarri.png";
                            }
                        })(e.tipoVeicolo)
                    },
                    carLicensePlate: {
                        text: e.targa
                    },
                    carModel: {
                        text: e.fabbrica
                    },
                    ruolo: {
                        text: translateRuoloSoggetto(e.ruoloSoggetto)
                    },
                    date: {
                        text: e.dataRuoloSoggetto
                    }
                };
            });
            console.log('items', items);
            $.listContainer.sections[0].items = items;
            Alloy.Globals.loading.hide();


            function translateRuoloSoggetto(ruolo) {
                switch (ruolo) {
                    case "Intestatario":
                        return L("intestatario_label");
                    case "Locatario":
                        return L("locatario_label");
                    case "Usufruttuario":
                        return L("usufruttuario_label");
                    default:
                        return ruolo;
                }
            } // translateRuoloSoggetto

        },
        error: function(e) {
            console.log('error', e);

            Alloy.Globals.loading.hide();
            var dialog = Titanium.UI.createAlertDialog({
                message: L("veicle_alert"),
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

function showFiscalSituation(e) {
    navigation.open('myCar/fiscalSituation', {
        targa: e.section.items[e.itemIndex].carLicensePlate.text,
        serieTarga: listVehicle[e.itemIndex].serieTarga,
        codiceRegione: 6,
        modello: listVehicle[e.itemIndex].fabbrica,
        tipo: listVehicle[e.itemIndex].tipoVeicolo
    });
}

function showCarDetail(e) {

    navigation.open('myCar/carDetail', {
        targa: e.section.items[e.itemIndex].carLicensePlate.text,
        serieTarga: listVehicle[e.itemIndex].serieTarga,
        modello: listVehicle[e.itemIndex].fabbrica,
        tipo: listVehicle[e.itemIndex].tipoVeicolo
    });

}

function showPraDigitale() {
    var alert = Ti.UI.createAlertDialog({
        message: L('pradigitale_alert'),
        title: "Pra digitale",
        buttonNames: ["Ok"]
    }).show();
}

function onArrowClick() {
    $.win.close();
}


function showDisclaimer(message) {
    var dialog = Titanium.UI.createAlertDialog({
        message: message,
        buttonNames : ["Chiudi"]
    });
    dialog.show();  
}

var showDisclaimer1 = _(showDisclaimer).partial("Se riscontri difformità tra le informazioni in tuo possesso e quelle visualizzate ti preghiamo di contattare uno dei Punti di Servizio ACI"
);

var showDisclaimer2 = _(showDisclaimer).partial("Attenzione: potresti avere delle situazioni fiscali irregolari su veicoli che hai venduto e che quindi non sono qui elencati. Nella prossima versione potrai digitare la targa di questi veicoli per verificare la loro situazione fiscale nel periodo in cui ne sei stato proprietario."
);

commons.initWindow($.win, L("intro_listcars_text"), null, []);