var args = arguments[0] || {};
var utility = require('utility');

//Ti.API.info("END SIDE COLLECTION: "+JSON.stringify(Alloy.Collections.automobileClub));
if (OS_ANDROID) {
    var abx = require('com.alcoapps.actionbarextras');
};

function loadData() {
    Alloy.Collections.tessere.fetch();
    if (OS_ANDROID) {

        init1();
        //actionBarHelper.setIcon('/drawericonw@2x.png');

    } else {
        //$.windowtitle.text = winTitle;
    }
    updateUI();

}

function init1() {
    abx.displayHomeAsUp = true;
    abx.title = "Le tessere ACI";
    abx.titleFont = "ACI Type Regular.otf";
    abx.titleColor = Alloy.Globals.palette.blu;
    _.defer(init2);
}

function init2() {
    $.win.activity.invalidateOptionsMenu();
}

function dataTransform(model) {
    var attrs = model.toJSON();
    var img = model.getImage();
    console.log("img", img);
    attrs.img = img;
    attrs.image = img;
    attrs.buyUrl = model.getBuyUrl();
    attrs.detailUrl = model.getDetailUrl();


    attrs.id = model.cid;

    console.log('model', attrs);
    return attrs;
};


function openDetail(e) {

	var selected = Alloy.Collections.tessere.getByCid(e.rowData.modelId);

    var w = Alloy.createController('Tessere_Dettaglio', {
        data: dataTransform(selected)
    }).getView();
    Alloy.Globals.navMenu.openWindow(w);
}



$.win.addEventListener('close', function() {
    $.destroy();
});