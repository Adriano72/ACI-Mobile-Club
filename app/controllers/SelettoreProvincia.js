var args = arguments[0] || {};


var settings = require('settings');
var utility = require('utility');

var index;


function init() {


    index = (settings.ricercaPerProssimita) ? 0 : 1;
    console.log("index", index);
    //genera l'etichetta in base alla provincia
    var l = settings.provinciaDiRiferimento ? 'Provincia (' + settings.provinciaDiRiferimento.shortName + ')' : 'Provincia'
        //imposta il controllo tab
    $.tabbedBar.init({
        index: index,
        labels: ['Prossimità', l]
    });

    select(index);


}

$.tabbedBar.addEventListener('click', function(e) {
    console.log("e", e);
    if (e.index != index) {
        select(e.index.index);
    }
})




function select(i) {

    if (i == 0) {
        //posizione
        settings.ricercaPerProssimita = true;
        //$.status.text = "Il servizio restituirà i punti più vicini alla posizione dell'utente";
        $.cambiaProvincia.visible = false;
    } else {
        //provincia
        var provincia = settings.provinciaDiRiferimento;
        if (provincia && !_.isEmpty(provincia)) {

            settings.ricercaPerProssimita = false;
            //  $.status.text = "Il servizio restituirà i risultati relativi alla provincia di " + utility.capitalize(provincia.longName);
            $.cambiaProvincia.visible = true;
        } else {
            selezionaProvincia();
        }

    }

}

function selezionaProvincia() {
    var win = Alloy.createController('SelettoreProvincia_List').getView();
    win.addEventListener('close', function() {
        init();
    });
    Alloy.Globals.navMenu.openWindow(win);
}

init();