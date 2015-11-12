var ViewScrollr = require("ViewScrollr");
var settingsMenu = require('settingsMenu');
var user = require('user');
var env = require('environment');
var locationServices = require('locationServices');
var navigation = require('navigation');


//imposto il riferimento alla `NavigationWindow` nel modulo `navigation`
Alloy.Globals.navMenu = $.navWin;
navigation.Nav = $.navWin;


//specifica il tempo da assegnare alla funzione _.throttle sugli eventi click dei pulsanti in index.xml
//http://underscorejs.org/#throttle 
var THROTTLE_TIME = 5000;


/**
 * da eseguire solo al primo avvio dell'app
 * @return {[type]} [description]
 */
function onFirstRun() {

    var w = Alloy.createController('welcome').getView();
    w.open();
}




function closeSideMenu() {
    if (rightSettingsMenu) {
        settingsMenu.hideMenu(rightSettingsMenu);
    }
}


var rightSettingsMenu;

function toggleSideMenu() {
    if (!rightSettingsMenu) {
        rightSettingsMenu = settingsMenu.openSideMenu();
        $.index.add(rightSettingsMenu);
    }

    settingsMenu.toggleMenu(rightSettingsMenu);
}


/**
 * Apre la schermata di visualizzazione della tessera
 * Se non loggato, porta ad un menu in cui si può scegliere se loggarsi, registrarsi o comprare una tessera
 * @param  {Object} e argomenti dell'evento click sul pulsante
 */
var openTessera = _(function(e) {
    e.cancelBubble = true;


    if (user.isLogged && user.hasTessera) {

        var winTessera = Alloy.createController('showTessera', Ti.App.Properties.getObject("datiUtente")).getView();
        Alloy.Globals.navMenu.openWindow(winTessera);

    } else {

        var winOpts = Alloy.createController('userOptions').getView();
        Alloy.Globals.navMenu.openWindow(winOpts);

    }


}).throttle(THROTTLE_TIME);


/**
 * Apre la schermata di Assistenza
 * @param  {Object} e argomenti dell'evento click sul pulsante
 */
var openAssistenza = _(function(e) {
    e.cancelBubble = true;

    //la funzionalità di asssitenza la posso usare solo se ho attivi i servizi di geolocalizzazione
    if (!locationServices.useLocation()) {
        console.log('openAssistenza 1');
        var numVerde = require('aciglobal').NumeroVerde;
        //apro un dialog per scegliere cosa fare
        var dialog = Titanium.UI.createAlertDialog({
            title: 'Impossibile usare la posizione attuale',
            message: 'Controlla le impostazioni di sistema, oppure chiama il numero ' + numVerde,
            buttonNames: OS_IOS ? ['Chiudi', 'Chiama'] : ['Chiudi', 'Chiama', 'Impostazioni'],
            cancel: 0
        });

        dialog.addEventListener('click', function(e) {
            console.log('dialog e', e);
            switch (e.index) {
                case e.source.cancel:
                    console.log('dialog cancel');
                    break;
                case 1: //chiama
                    Titanium.Platform.openURL('tel:' + numVerde);
                    break;
                case 2: //apri settings
                    locationServices.openLocationSettings();
            }
        });

        dialog.show();
    } else if (Ti.Network.networkType == Ti.Network.NETWORK_NONE) {
        console.log('openAssistenza 1');
        var numVerde = require('aciglobal').NumeroVerde;
        //apro un dialog per scegliere cosa fare
        var dialog = Titanium.UI.createAlertDialog({
            title: 'Connessione non disponibile',
            message: 'Controlla le impostazioni di sistema, oppure chiama il numero ' + numVerde,
            buttonNames: OS_IOS ? ['Chiudi', 'Chiama'] : ['Chiudi', 'Chiama', 'Impostazioni'],
            cancel: 0
        });

        dialog.addEventListener('click', function(e) {
            console.log('dialog e', e);
            switch (e.index) {
                case e.source.cancel:
                    console.log('dialog cancel');
                    break;
                case 1: //chiama
                    Titanium.Platform.openURL('tel:' + numVerde);
                    break;
                case 2: //apri settings
                    locationServices.openLocationSettings();
            }
        });

        dialog.show();
    } else {
        console.log('openAssistenza 2');

        var winSoccorso = Alloy.createController('SoccorsoStradaleMain').getView();
        Alloy.Globals.navMenu.openWindow(winSoccorso);
    }






}).throttle(THROTTLE_TIME);



/**
 * Apre la schermata dei punti aci
 * @param  {Object} e argomenti dell'evento click sul pulsante
 */
var openPuntiACI = _(function(e) {
    e.cancelBubble = true;

    var winPAci = Alloy.createController('PuntiAciMain').getView();
    Alloy.Globals.navMenu.openWindow(winPAci);

}).throttle(THROTTLE_TIME);


/**
 * Apre la schermata delle convenzioni
 * @param  {Object} e argomenti dell'evento click sul pulsante
 */
var openVantaggiSoci = _(function(e) {
    e.cancelBubble = true;

    var winVantaggiSoci = Alloy.createController('VantaggiSociMain').getView();
    Alloy.Globals.navMenu.openWindow(winVantaggiSoci);

}).throttle(THROTTLE_TIME);


/**
 * Funzione eseguita al caricamento della window
 * @param  {Object} e argomenti dell'evento click sul pulsante
 */
function loadData() {

    //eseguo un primo caricamento dei banner, in modo da avere sempre qualcosa da mostrare
    Alloy.Collections.banner.fetchRandom(function() {
        console.log("banner caricati");
    });


}






(function constructor() {

    //setup window
    require('commons').initWindow($.index, 'ACI Mobile Club', '/logo_aci.png', [{
        icon: "/images/ic_action_impostazioni.png",
        onClick: toggleSideMenu
    }]);


    //setup window
    //require('commons').initWindow($.index, 'ACI Mobile Club', '/logo_aci.png');

    //clear cache
    var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, "/");
    cacheDir.deleteDirectory(true);

    //banner 
    var images = _(3).times(function(e) {
        return 'http://www.aci.it/fileadmin/syc/acimobileclub/banner' + (e + 1) + '.jpg';
    });
    // $.gallery.getView().height = Alloy.Globals.size.W30;
    //    $.gallery.getView().height = 300;
    //    $.gallery.getView().width = Alloy.Globals.W;
    //    $.gallery.getView().top = 0;

    $.gallery.setImages(images);



    if (env.isFirstRun) {
        onFirstRun();
        env.isFirstRun = false;
    }

    loadData();

    //bind degli eventi dei tile
    $.tileInfoTarga.addEventListener('click', navigation.openInfoTargaMain);
    
    $.tileMyCar.addEventListener('click', navigation.openMyCarMain);


    $.navWin.open();

})();