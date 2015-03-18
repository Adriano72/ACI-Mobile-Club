var args = arguments[0] || {};


var settings = require('settings');
var utility = require('utility');

var index;


function init() {

    init1();


    select(index);


}

function init1() {
    index = (settings.ricercaPerProssimita) ? 0 : 1;
    console.log("index", index);
    //genera l'etichetta in base alla provincia
    var l = settings.provinciaDiRiferimento ? 'Provincia (' + settings.provinciaDiRiferimento.shortName + ')' : 'Provincia'
        //imposta il controllo tab
    $.tabbedBar.init({
        index: index,
        labels: ['Prossimità', l]
    });
}

$.tabbedBar.addEventListener('click', function(e) {
    console.log("e", e);
    console.log("index", index);
    if (e.index != index) {
        if (_.isNumber(e.index)) {
            select(e.index);
        } else {
            select(e.index.index);

        }

    }
})




function select(i) {

    console.log("i", i);

    if (i == 0) {
        //posizione
        settings.ricercaPerProssimita = true;
        //$.status.text = "Il servizio restituirà i punti più vicini alla posizione dell'utente";
        // $.cambiaProvincia.visible = false;

        //Per ora (19/2/15) gestiamo il refresh della posizione tramite questo evento
        // in futuro andrà tolta
        require('locationServices').getUserLocation(function(err, p) {
            //do nothing
        });

        //CANCELLO LA PROVINCIA
        settings.provinciaDiRiferimento = null;
        //questo è il metodo più veloce 
        init1();

    } else {
        //provincia
        settings.ricercaPerProssimita = false;
        var provincia = settings.provinciaDiRiferimento;
        if (provincia && !_.isEmpty(provincia)) {

            //  $.status.text = "Il servizio restituirà i risultati relativi alla provincia di " + utility.capitalize(provincia.longName);
            //      $.cambiaProvincia.visible = true;
        } else {
            selezionaProvincia();
        }

    }

    index = i;

}

function selezionaProvincia() {
    var win = Alloy.createController('SelettoreProvincia_List').getView();
    win.addEventListener('close', function() {
        init();
    });
    Alloy.Globals.navMenu.openWindow(win);
}

init();