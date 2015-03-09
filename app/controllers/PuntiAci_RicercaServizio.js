var args = arguments[0] || {};



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
    updateUI();
   // $.searchBar.blur();

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
    Alloy.Collections.serviziGIC.fetch();
    updateUI();
};

init3();

function dataTransform(model) {
    var attrs = model.toJSON();
    attrs.id = attrs.alloy_id;
    // console.log("attrs", attrs);
    return attrs;
};



function listaGIC(e) {
    if (e.row) {
        console.log("e", e);
        console.log("e.rowData", e.rowData);
        var selected = Alloy.Collections.serviziGIC.where({
            alloy_id: e.rowData.modelId
        })[0].toJSON();
        console.log("selected", selected);
       var list = Alloy.createController('PuntiAci_RicercaServizio_List', {
            data: selected
        }).getView();
        Alloy.Globals.navMenu.openWindow(list);
    }
}




$.win.addEventListener('close', function() {
    $.destroy();
});