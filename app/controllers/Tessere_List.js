var args = arguments[0] || {};
var utility = require('utility');




function dataTransform(model) {
    var attrs = model.toJSON();
    var img = model.getImage();
    //  console.log("img", img);
    attrs.img = img;
    attrs.image = img;
    attrs.buyUrl = model.getBuyUrl();
    attrs.detailUrl = model.getDetailUrl();


    attrs.id = model.cid;

    //  console.log('model', attrs);
    return attrs;
};


function openDetail(e) {

    if (!e.rowData || !e.rowData.modelId) return;

    var selected = Alloy.Collections.tessere.getByCid(e.rowData.modelId);

    var w = Alloy.createController('Tessere_Dettaglio', {
        data: dataTransform(selected)
    }).getView();
    Alloy.Globals.navMenu.openWindow(w);
}


_.defer(function() {
    Alloy.Collections.tessere.fetch();
    updateUI();
});