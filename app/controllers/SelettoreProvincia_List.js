var args = arguments[0] || {};

var net = require('network');
var utility = require('utility');
var settings = require('settings');


var headerText = "Cambia Provincia";
var headerImg = "/images/ic_action_puntatore.png";

//inizializzazioni comuni della Window
require('commons').initWindow($.win, headerText, headerImg);


//carica i dati
loadData();



function loadData() {
    //Lazy load delle province
    if (Alloy.Collections.province.length == 0) {
        Alloy.Globals.loading.show('Caricamento');
        net.getListaProvince(function(result) {
            Alloy.Collections.province.reset(result);
            updateUI();
            Alloy.Globals.loading.hide();
            console.log("province", result);
            // init5();
        });
    } else {
        //init5();
        updateUI();
    }
    $.searchBar.blur();

}


function filterRows(collection) {
    console.log('length', collection.models.length);
    if (collection.models.length === 0) {
        $.noResults.visible = true;
        $.puntiAci_Table.visible = false;
    } else {
        $.noResults.visible = false;
        $.puntiAci_Table.visible = true;

    }
    return collection.models;
}

/*
//aggiungi la riga della posizione
function init4() {
    //aggungo la riga posizione in testa

    var style = $.createStyle({
        classes: "row simpleRowText PTSansRegular",
        apiName: 'TableViewRow'
    });
    var row = Ti.UI.createTableViewRow({
        modelId: 0,
        title: 'La tua posizione',
        leftImage: '/images/ic_action_gps.png'
        // leftImage: '/ico_punti_servizio_01.png'
    });
    row.applyProperties(style);
    $.puntiAci_Table.insertRowBefore(0, row);

}
*/

/*
//devo inserire le province a mano
function init5() {
    _.each(Alloy.Collections.province.models, function(m) {
        console.log("m", m);
        appendRow(m);
    });
}
*/

/*
//evidenzia la riga selezionata
function init6() {

    var sel = settings.provinciaDiRiferimento;
    if (sel) {
        highlight(sel.shortName);
        var i = utility.arrayIndexBy(Alloy.Collections.province.models, {
            shortName: sel.shortName
        });

    }

}
*/

function appendRow(r) {
    var style = $.createStyle({
        classes: "row simpleRowText PTSansRegular",
        apiName: 'TableViewRow'
    });
    var row = Ti.UI.createTableViewRow(r);
    row.applyProperties(style);
    $.puntiAci_Table.insertRowBefore(0, row);
}

function dataTransform(model) {
    var attrs = model.toJSON();
    attrs.mongoId = attrs._id;
    attrs.id = model.cid;   
    console.log('attrs', attrs);
    return attrs;
};



function select(e) {
    console.log('select');
    doHighlight(e);
    console.log("e", e);

    var selected = {
        id: e.rowData.mongoId,
        shortName: e.rowData.shortName,
        longName: e.rowData.longName
    };

    console.log("selected", selected);

    if (selected.id == 0) {
        //caso posizione
        //settings.provinciaDiRiferimento = undefined;
        settings.ricercaPerProssimita = true;
    } else {
        //la precedente provincia
        var prev = settings.provinciaDiRiferimento;


        //imposto la preferenza provincia
        settings.provinciaDiRiferimento = selected;


        // highlight(selected.shortName, (prev ? prev.shortName : undefined));

        settings.ricercaPerProssimita = false;
    }




    //chiudi la finestra corrente
    _.defer(function() {
        Alloy.Globals.navMenu.closeWindow($.win);
    });
}


function highlight(shortName, shortName_prev) {
    console.log(shortName);
    var children = $.puntiAci_Table.getChildren();
    console.log('data', $.puntiAci_Table.data);
    var p = _.where(children, {
        shortName: shortName_prev
    });
    var c = _.where(children, {
        shortName: shortName
    });
    console.log('c', c);
    if (c && c.length) {

        var child = c[0];
        child.font.fontWeight = "bold";

    }

    if (p && p.length) {
        var prev = p[0];
        prev.font.fontWeight = "regular";

    }
}



function doHighlight(e) {
    console.log('doHighlight');
    e.row.backgroundColor = Alloy.Globals.palette.celeste;
    e.row.opacity = 0.5;
}

function undoHighlight(e) {
    console.log('undoHighlight');
    e.row.backgroundColor = 'white';

}

function doClick(e) {
    console.log('click');
}


