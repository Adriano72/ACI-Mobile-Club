/**
 * Modulo che racchiude le operazioni sulle push notifications per questa app
 */

//canali a cui sottoscriversi
var channels = [

    //canale broadcast, default
    {
        name: 'broadcast',
        active: true
    }

];

//dizionario delle notifiche
var notifications = [

    //notifica che gestisce l'arrivo di una nuova convenzione
    {
        type: 'syc_new',
        cb: function(payload) {

            console.log('mi è arrivata la notifica!', payload);

            var syc = {
                "_id": "54759c7d2abf83b56a76a644",
                "__v": 0,
                "_oid": "30",
                "_type": "syc",
                "address": {
                    "postalCode": "00198",
                    "formatted": "Via Po, 22, 00198 Roma RM",
                    "street": "Via Po",
                    "location": [12.4946687, 41.9138573],
                    "sublocality": "522053ff0638e1f025005d29",
                    "locality": {
                        "__v": 1,
                        "_csvrow": ["299", "4819", "ITALIA", "7", "LAZIO", "28", "ROMA", "299", "ROMA", "", "", "00100", "12,48305", "41,89296"],
                        "_id": "522053fb0638e1f025000116",
                        "_level": 3,
                        "_oid": 299,
                        "lft": 12756,
                        "location": {
                            "lat": 41.89296,
                            "lng": 12.48305
                        },
                        "longName": "ROMA",
                        "parentId": "522053fb0638e1f025000026",
                        "postalCodes": ["00100", "00118", "00119", "00120", "00121", "00122", "00123", "00124", "00125", "00126", "00127", "00128", "00129", "00130", "00131", "00132", "00133", "00134", "00135", "00136", "00137", "00138", "00139", "00140", "00141", "00142", "00143", "00144", "00145", "00146", "00147", "00148", "00149", "00150", "00151", "00152", "00153", "00154", "00155", "00156", "00157", "00158", "00159", "00160", "00161", "00162", "00163", "00164", "00165", "00166", "00167", "00168", "00169", "00170", "00171", "00172", "00173", "00174", "00175", "00176", "00177", "00178", "00179", "00180", "00181", "00182", "00183", "00184", "00185", "00186", "00187", "00188", "00189", "00190", "00191", "00192", "00193", "00194", "00195", "00196", "00197", "00198", "00199"],
                        "rgt": 12909,
                        "shortName": null
                    },
                    "province": {
                        "_id": "522053fb0638e1f025000026",
                        "__v": 0,
                        "_csvrow": ["28", "4819", "ITALIA", "7", "LAZIO", "28", "ROMA", "", "", "", "", "", "", ""],
                        "_level": 2,
                        "_oid": 28,
                        "lft": 12687,
                        "location": [12.4866714, 41.8877631],
                        "longName": "ROMA",
                        "parentId": "522053fb0638e1f025000011",
                        "postalCodes": [],
                        "rgt": 13316,
                        "shortName": "RM"
                    },
                    "region": {
                        "_id": "522053fb0638e1f025000011",
                        "__v": 0,
                        "_csvrow": ["7", "4819", "ITALIA", "7", "LAZIO", "", "", "", "", "", "", "", "", ""],
                        "_level": 1,
                        "_oid": 7,
                        "lft": 12686,
                        "location": [12.989615, 41.6552418],
                        "longName": "LAZIO",
                        "parentId": "522053fb0638e1f02500000a",
                        "postalCodes": [],
                        "rgt": 14935,
                        "shortName": "LAZ"
                    },
                    "country": {
                        "__v": 0,
                        "_csvrow": ["4819", "4819", "ITALIA", "", "", "", "", "", "", "", "", "", "", ""],
                        "_id": "522053fb0638e1f02500000a",
                        "_level": 0,
                        "_oid": 4819,
                        "lft": 1,
                        "location": null,
                        "longName": "ITALIA",
                        "parentId": null,
                        "postalCodes": [],
                        "rgt": 47772,
                        "shortName": null
                    }
                },
                "agreement_id": {
                    "_id": "54759c352abf83b56a76a5f3",
                    "__v": 2,
                    "_oid": "4fcdd860fc09610a2700001e",
                    "_type": "syc",
                    "attachments": [],
                    "categories": [{
                        "short_name": "benessere_e_salute",
                        "_type": "syc",
                        "long_name": "Benessere e Salute",
                        "_id": "54e1c6d2ef4123414860eb96"
                    }, {
                        "_id": "53594343415445474f000008",
                        "_type": "syc",
                        "_parent_id": {
                            "short_name": "benessere_e_salute",
                            "_type": "syc",
                            "long_name": "Benessere e Salute",
                            "_id": "54e1c6d2ef4123414860eb96"
                        },
                        "_origuid": "8",
                        "short_name": "centri_termali",
                        "long_name": "Centri termali"
                    }],
                    "discountDesc": "<p>Per ottenere gli sconti &egrave; sufficiente esibire la tessera associativa in corso di validit&agrave; presso le aziende termali aderenti all'iniziativa. <br /><span style=\"text-decoration: underline;\">Per maggiori dettagli sull'effettiva scontistica e sulle condizioni per usufruire degli sconti contattare le singole strutture.</span></p>",
                    "endDate": 1546210800,
                    "id_pos": null,
                    "images": {
                        "logo": "FEDERTERME.jpg",
                        "banner": ""
                    },
                    "offerDesc": "<p>Dal 10 al 30% di sconto&nbsp;sulle tariffe ufficiali per&nbsp;cure e&nbsp;soggiorni termali presso le strutture e gli alberghi convenzionati.</p>",
                    "pubDate": null,
                    "serviceTypeDesc": "<p><strong>Scopri le Terme italiane:&nbsp;luoghi di cura, relax e benessere.<br /></strong><strong>Famose in tutto il mondo grazie all'efficacia dei trattamenti praticati, ai numerosi servizi offerti, ma soprattutto per le bellezze naturali dei paesaggi in cui sono inserite. </strong></p>",
                    "status": "ok",
                    "title": "FEDERTERME",
                    "url": "www.federterme.it",
                    "photoGallery": []
                },
                "contacts": {
                    "web": [],
                    "cmail": [],
                    "email": [],
                    "fax": [],
                    "tel": []
                },
                "name": "FEDERTERME",
                "representatives": [],
                "schedule": {
                    "festivals": [],
                    "timetable": {
                        "sun": [],
                        "sat": [],
                        "fri": [],
                        "thu": [],
                        "wed": [],
                        "tue": [],
                        "mon": []
                    }
                },
                "services": [],
                "status": "ok"
            };



            console.log('syc');

            var itemData = _.findWhere(require('tabulatedData').categorieSyc(), {
                short_name: "benessere_e_salute"
            });




            var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
                data: syc,
                isBanner: true,
                titolo: itemData.long_name,
                headerImg: itemData.img
            }).getView();
            Alloy.Globals.navMenu.openWindow(dettConvenzione);

        }
    }

];





/**
 * Inizializza le push notifications per questa app
 * @return {[type]} [description]
 */
exports.init = function() {

    var tiACI = require('ti.aci');


    tiACI.PushNotification.retrieveDeviceToken(function(err, res) {
        if (err) {
            console.error(err);
        } else {
            require('network').registerForPush();

            //mi iscrivo ai canali
            _(channels).chain()
                .where({
                    active: true
                })
                .pluck('name')
                .each(tiACI.PushNotification.subscribeToChannel)
                .value();


        }
    });




    //registro gli eventi di ricezione della notifica
    _(notifications).each(function(n) {
        tiACI.PushNotification.addNotificationListener(n.type, n.cb);
    });


}