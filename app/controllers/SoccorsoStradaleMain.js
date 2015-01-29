var args = arguments[0] || {};

var AciGlobal = require('aciglobal');



if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};

function doopen(evt) {
    if (OS_ANDROID) {
        abx.displayHomeAsUp = true;
        abx.title = "Assistenza";
        abx.titleFont = "ACI Type Regular.otf";
        abx.titleColor = Alloy.Globals.palette.blu;

        //actionBarHelper.setIcon('/drawericonw@2x.png');

    } else {
        //$.windowtitle.text = winTitle;
    }
    //updateScreen();

    // $.randomBanner.image = encodeURI(Alloy.Globals.bannerImageURL);
}

var rowData = [{
    //richiesta
    immagine: "/images/ic_action_aiuto_gps_rosso.png",
    testo: "Invia la tua posizione per essere richiamato",
    id_code: 'richiedi'

}, {
    //chiama numero verde
    immagine: "/images/ic_action_aiuto_phone_rosso.png",
    testo: "Chiama l'" + AciGlobal.NumeroVerde,
    id_code: 'chiama'

}];

var rows = [];

_.each(rowData, function(value) {
    //Ti.API.info("DATA: " + value.img);
    var riga = Alloy.createController('TableViewRow_Single', value);
    //con questo hack non ho bisogno di creare un nuovo controllo
    riga.rowText.color = Alloy.Globals.palette.rosso;
    rows.push(riga.getView());
});

function selectionDetail(e) {
    console.log('selection', e);
    console.log('selection', e.row);
    console.log('selection', e.row.id_coda);
    console.log('selection', e.rowData);
    if (!_.isUndefined(e.row)) {

        Ti.API.info("CLICKED DATA: " + e.row.id_code);
        var win_controller;

        switch (e.row.id_code) {

            case "richiedi":
                win_controller = "SoccorsoStradale_Richiesta";
                break;
            case "chiama":
                win_controller = "SoccorsoStradale_Chiama";
                break;


            default:

        }

        if (win_controller) {
            var winAC = Alloy.createController(win_controller).getView();
            Alloy.Globals.navMenu.openWindow(winAC);
        }
    }
};

/*
function displayConvenzioneBanner() {

    var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: Alloy.Globals.convenzioneBanner,
        headerImg: "",
        isBanner: true
    }).getView();
    Alloy.Globals.navMenu.openWindow(dettConvenzione);

}
*/


$.puntiAciMain_Table.setData(rows);