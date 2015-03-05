var ViewScrollr = require("ViewScrollr");
var settingsMenu = require('settingsMenu');
var user = require('user');

var cacheDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, "/");
cacheDir.deleteDirectory(true);

//specifica il tempo da assegnare alla funzione _.throttle sugli eventi click dei pulsanti in index.xml
//http://underscorejs.org/#throttle 
var THROTTLE_TIME = 5000;

zapImageCache = function() {
    var appDataDir,
        cacheDir,
        dir,
        externalRoot;
    if (Ti.Filesystem.isExternalStoragePresent()) {
        appDataDir = Ti.Filesystem.getFile('appdata://').nativePath;
        externalRoot = appDataDir.substring(0, appDataDir.lastIndexOf('/'));
        cacheDir = "" + externalRoot + "/Android/data/" + Ti.App.id + "/cache/_tmp/remote-cache";
        dir = Ti.Filesystem.getFile(cacheDir);
    } else {
        dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, '_tmp', 'remote-cache');
    }
    if (dir.exists()) {
        dir.deleteDirectory(true);
    }
    return dir.createDirectory();
};

if (OS_ANDROID) {
    //zapImageCache();
    var abx = require('com.alcoapps.actionbarextras');
}
//var menuTop = (OS_ANDROID)?PixelsToDPUnits((Titanium.Platform.displayCaps.platformHeight/2))-40:(Titanium.Platform.displayCaps.platformHeight/2)-15;
var menuTop = (OS_ANDROID) ? Alloy.Globals.deviceHeightHalf - 40 : Alloy.Globals.deviceHeightHalf - 30;
$.menuView.top = menuTop;

function doopen(evt) {
    // Alloy.Globals.loading.show('Sincronizzazione', false);
    Alloy.Globals.navMenu = $.navWin;
    if (OS_ANDROID) {
        abx.title = "ACI Mobile Club";
        abx.titleFont = "ACI Type Regular.otf";
        abx.titleColor = "#4A678C";

        //actionBarHelper.setIcon('/drawericonw@2x.png');

    } else {
        //$.windowtitle.text = winTitle;
    }
    require('locationServices').getUserLocation(loadData);
}

var view1 = Ti.UI.createImageView({
    image: "http://www.aci.it/fileadmin/syc/acimobileclub/banner1.jpg",
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
});

var view2 = Ti.UI.createImageView({
    image: "http://www.aci.it/fileadmin/syc/acimobileclub/banner2.jpg",
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
});

var view3 = Ti.UI.createImageView({
    image: "http://www.aci.it/fileadmin/syc/acimobileclub/banner3.jpg",
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
});

var Banner = ViewScrollr.create({
    width: "98%",
    height: (OS_ANDROID) ? "48.5%" : "50%",
    top: (OS_ANDROID) ? 3 : 2,
    auto: true,
    delay: 3000,
    backgroundColor: "#FFF",
    navigation: {
        selectedColor: "#fff",
        color: "#000",
        backgroundColor: "#fff"
    },
    panels: [{
        view: view1
    }, {
        view: view2
    }, {
        view: view3
    }]
});

var scrollHack = _.once(triggerScroll);

function triggerScroll() {
    //Ti.API.info("**** FIRE EVENT *****");
    if (OS_ANDROID) {
        Ti.App.fireEvent('initialScrollHack');
    };
}

$.index.add(Banner);

function closeSideMenu() {
    settingsMenu.hideMenu(rightSettingsMenu);
}

var rightSettingsMenu = settingsMenu.openSideMenu();

$.index.add(rightSettingsMenu);

function toggleSideMenu() {

    settingsMenu.toggleMenu(rightSettingsMenu);
}


/**
 * Apre la schermata di visualizzazione della tessera
 * Se non loggato, porta ad un menu in cui si può scegliere se loggarsi, registrarsi o comprare una tessera
 * @param  {Object} e argomenti dell'evento click sul pulsante
 */
var openTessera = _(function(e) {
    e.cancelBubble = true;


    if (user.isLogged) {

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
    var winSoccorso = Alloy.createController('SoccorsoStradaleMain').getView();
    Alloy.Globals.navMenu.openWindow(winSoccorso);

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
function loadData(e) {

    //eseguo un primo caricamento dei banner, in modo da avere sempre qualcosa da mostrare
    Alloy.Collections.banner.fetchRandom(function() {
        console.log("banner caricati");
    });


}

$.navWin.open();