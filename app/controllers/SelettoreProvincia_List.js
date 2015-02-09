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
    abx.title = "Ricerca per Servizio";
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
        });
    }

}

function dataTransform(model) {
    var attrs = model.toJSON();

    attrs.id = model.cid;
    console.log('attrs', attrs);
    return attrs;
};



function select(e) {
    console.log("e", e);


    var selected = {
        shortName: e.rowData.shortName,
        longName: e.rowData.longName
    };

    console.log("selected", selected);

    //imposto la preferenza
    settings.provinciaDiRiferimento = {
        shortName: selected.shortName,
        longName: selected.longName
    }
    settings.ricercaPerProvincia = true;


    //chiudi la finestra corrente
    _.defer(function() {
        Alloy.Globals.navMenu.closeWindow($.win);
    });
}






_.defer(init3);