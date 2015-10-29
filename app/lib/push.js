/**
 * Modulo che racchiude le operazioni sulle push notifications per questa app
 */

//canali a cui sottoscriversi
var channels = [

    //canale broadcast, default
    {
        name: 'news_alerts',
        active: true
    }

];

//dizionario delle notifiche
var notifications = [

    //report settimanale delle convenzioni
    {
        type: 'new_syc',
        cb: function(payload) {
            console.log('mi è arrivata la notifica!', 'new_syc', payload);

            var dateFrom = new Date(payload.content.time * 1000);
            var province = payload.content.province;


            console.log(dateFrom, province);

            //imposto il contesto di ricerca alla provincia
            var settings = require('settings');
            settings.ricercaPerProssimita = false;
            settings.provinciaDiRiferimento = province;


            //imposto la data di riferimento alla collezione 
            Alloy.Collections.sycLatest.dateFrom = dateFrom;
            Alloy.Collections.sycLatest.source = 'push';

            //apro la pagina con l'elenco dei syc
            var itemData = _(require('tabulatedData').categorieSyc()).findWhere({
                short_name: 'sycLatest'
            });

            console.log('itemData', itemData);

            var winAC = Alloy.createController('VantaggiSoci_List', {

                icon: itemData.img,
                title: itemData.text,
                id_code: itemData.short_name

            }).getView();
            Alloy.Globals.navMenu.openWindow(winAC);



        }
    }

];


/**
 * gestore comune a tutte le notifiche
 * @param  {Function} fn [description]
 * @return {[type]}      [description]
 */
function commonNotificationHandler(cb) {

    return function() {

        var args = Array.prototype.slice.call(arguments);
        console.log('commonNotificationHandler cb', args);
        cb && cb.apply(this, args);
        if (OS_IOS) {

            Titanium.UI.iPhone.setAppBadge(0);


        }
    }

}


/**
 * Inizializza le push notifications per questa app
 * @return {[type]} [description]
 */
exports.init = function() {

    var tiACI = require('ti.aci');


    tiACI.PushNotification.retrieveDeviceToken(function(err, res) {
        if (err) {
            console.error('retrieveDeviceToken', err);
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
        // tiACI.PushNotification.addNotificationListener(n.type, _(n.cb).wrap(commonNotificationHandler));
        tiACI.PushNotification.addNotificationListener(n.type, commonNotificationHandler(n.cb));
    });


}