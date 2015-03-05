var args = arguments[0] || {};

var net = require('network');
var utility = require('utility');
var settings = require('settings');

//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.delegazioni));
if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};

function loadData() {
    //Alloy.Collections.automobileClub.fetch();
    if (OS_ANDROID) {

        init1();

        //actionBarHelper.setIcon('/drawericonw@2x.png');

    } else {
        //$.windowtitle.text = winTitle;
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


function init1() {
    abx.displayHomeAsUp = true;
    abx.title = "Cambia provincia";
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = Alloy.Globals.palette.blu;
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();
}


function init3() {
    //Lazy load delle province
    if (true || Alloy.Collections.province.length == 0) {
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
    }



}

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

//devo inserire le province a mano
function init5() {
    _.each(Alloy.Collections.province.models, function(m) {
        console.log("m", m);
        appendRow(m);
    });
}

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

    attrs.id = model.cid;
    console.log('attrs', attrs);
    return attrs;
};



function select(e) {
    console.log('select');
    doHighlight(e);
    console.log("e", e);

    var selected = {
        id: e.rowData.modelId,
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
        settings.provinciaDiRiferimento = {
            shortName: selected.shortName,
            longName: selected.longName
        }


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




//$.puntiAci_Table.addEventListener('touchstart', select);

//$.puntiAci_Table.addEventListener('touchend', undoHighlight);
//$.puntiAci_Table.addEventListener('click', select);




_.defer(init3);