var args = arguments[0] || {};



function init() {
    $.puntiAci_Table.setSearch($.searchBar);
    hideResults();
    Alloy.Collections.serviziGIC.fetch();
    updateUI();
};



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

var lastHeight;

function hideResults() {
    lastHeight = $.puntiAci_Table.rect.height;
    $.puntiAci_Table.height = 0;
    $.puntiAci_Table.visible = false;
}

function showResults() {
    if ($.searchBar.value) {
        $.puntiAci_Table.height = Ti.UI.FILL;
        $.puntiAci_Table.visible = true;
    } else {
        hideResults();
    }
}


$.resultTable = $.puntiAci_Table;
$.searchBar = $.searchBar;


init();