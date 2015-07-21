var args = arguments[0] || {};


var settings = require('settings');
var locationServices = require('locationServices');
var utility = require('utility');

var index;


function init() {
    console.log('init');
    //questo è lo status del selettore secondo quanto mantenuto nei dati locali
    index = (settings.ricercaPerProssimita) ? 0 : 1;

    init1();
}

function init1() {
    //scateno la selezione corretta della modalità
    select(index);

    //inizializzo il controllo
    initSelector();

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


function initSelector() {
    var l = settings.provinciaDiRiferimento ? 'Provincia (' + settings.provinciaDiRiferimento.shortName + ')' : 'Provincia'
        //imposta il controllo tab
    $.tabbedBar.init({
        index: index,
        labels: ['Prossimità', l]
    });
}



function select(i) {

    console.log("i", i);

    var selections = {
        prossimita: function() {
            //posizione
            settings.ricercaPerProssimita = true;
            //$.status.text = "Il servizio restituirà i punti più vicini alla posizione dell'utente";
            // $.cambiaProvincia.visible = false;

            //Per ora (19/2/15) gestiamo il refresh della posizione tramite questo evento
            // in futuro andrà tolta
            require('locationServices').getUserLocation(function(err, p) {
                //do nothing
                console.log('******PROV*****');
            });

            //CANCELLO LA PROVINCIA
            settings.provinciaDiRiferimento = null;
            //questo è il metodo più veloce 
            // init1();
        },
        provincia: function() {
            console.log('provincia');
            //provincia
            settings.ricercaPerProssimita = false;
            var provincia = settings.provinciaDiRiferimento;
            if (provincia && !_.isEmpty(provincia)) {

                //  $.status.text = "Il servizio restituirà i risultati relativi alla provincia di " + utility.capitalize(provincia.longName);
                //      $.cambiaProvincia.visible = true;
            } else {
                _(selezionaProvincia).defer();
            }
        }
    };

    /*
    Devo gestire la selezione della corretta modalità in base a due parametri:
        Input -> la selezione dell'utente - 0=prossimità, 1=provincia
        useLocation -> booleano, indica se è disponibile il servizio di geolocalizzazione
    Lo gestisco attraverso la seguente tabella di verità:

        Input | useLocation || Scenario
       ---------------------------------
          0   |     0       ||    C (devo forzare la selezione provincia)
          0   |     1       ||    A (normale selezione per prossimità)
          1   |     0       ||    B (normale selezione provincia) 
          1   |     1       ||    B (normale selezione provincia)
        
     */

    //  
    var Input = i;
    var useLocation = locationServices.useLocation();
    var Scenario;

    //qui riconduco le condizioni ai casi reali
    switch (true) {
        case Input == 0 && useLocation == 0:
            Scenario = 'C';
            break;
        case Input == 0 && useLocation == 1:
            Scenario = 'A';
            break;
        case Input == 1 && useLocation == 0:
            Scenario = 'B';
            break;
        case Input == 1 && useLocation == 1:
            Scenario = 'B';
            break;
        default:
            //impossibile
            break;
    }

    //qui prendo le decisioni sul da farsi
    console.log('scenario ', Scenario);
    switch (Scenario) {
        case 'A':
            selections.prossimita();
            index = i;
            break;
        case 'B':
            index = i;
            selections.provincia();
            break;
        case 'C':
            //Ripristino 

            _(function() {

                //apro un dialog per scegliere cosa fare
                var dialog = Titanium.UI.createAlertDialog({
                    title: 'Impossibile usare la posizione attuale',
                    message: 'Selezionare una provincia di riferimento, oppure controlla le impostazioni di sistema',
                    buttonNames: OS_IOS ? ['Scegli provincia'] : ['Scegli provincia', 'Impostazioni'],
                    cancel: -1
                });

                dialog.addEventListener('click', function(e) {
                    console.log('dialog e', e);
                    switch (e.index) {
                        case e.source.cancel:
                            console.log('dialog cancel');
                            break;
                        case 0: //seleziona provincia
                            selezionaProvincia();
                            break;
                        case 1: //apri settings
                            locationServices.openLocationSettings();
                    }
                });

                dialog.show();

            }).defer();

            
            index = 1;
            initSelector();

            break;
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