var args = arguments[0] || {};
var utility = require("utility");
var commons = require("commons");

Ti.API.info("ARGS: " + JSON.stringify(args));


//inizializzazioni comuni della Window
commons.initWindow($.win, "La mia tessera", "/ico_tessera_01.png");


var immagineTessera, immagineTesseraRetro;

//controllo la scadenza
var scadenza = new Date(args["userInfo.dataScadenza"]);
console.log('dataScadenza', new Date(args["userInfo.dataScadenza"]));
console.log('dataScadenza', args["userInfo.dataScadenza"]);

var code = args["userInfo.categoriaTessera"];

if (scadenza >= new Date()) {
    immagineTessera = utility.getTesseraImage(code);
    immagineTesseraRetro = utility.getTesseraRetroImage(code);
} else {
    immagineTessera = utility.getTesseraScadutaImage(code);
    immagineTesseraRetro = utility.getTesseraRetroImage(code);
}



//$.tessera.backgroundImage = immagineTessera;
//$.tessera_back.backgroundImage = immagineTesseraRetro;
$.tessera.image = immagineTessera;
$.tessera_back.image = immagineTesseraRetro;

Ti.API.info("TESSERA: " + immagineTessera);
Ti.API.info("TESSERA RETRO: " + immagineTesseraRetro);


$.titolare.text = args["userInfo.name"] + " " + args["userInfo.surname"];
$.numTessera.text = args["userInfo.numeroTessera"];


var pieces = args["userInfo.dataScadenza"].split('/');


//Ti.API.info("SPLITTED: "+pieces);
pieces.reverse();
var reversed = pieces.join('/');
//Ti.API.info("SPLITTED: "+reversed);

$.validita.text = "FINO AL " + reversed;



$.rotatedContainer.transform = Ti.UI.create2DMatrix().rotate(-90);



if (OS_ANDROID) {
    $.rotatedContainer.setBottom("20%");
    $.rotatedContainer.setLeft("40%");
} else {

    if (Ti.Platform.displayCaps.platformHeight <= 480) {
        $.rotatedContainer.setBottom("32%");
    } else {
        $.rotatedContainer.setBottom("29%");
    }

    $.rotatedContainer.setLeft("25%");
}


var qr = Alloy.Globals.baseURL + '/qrcode/acicardno/' + args["userInfo.numeroTessera"] + '.png?options={"size":8,"margin":1}';
console.log('qr', qr);
$.barcode.image = qr;


var flag = false;

function checkSize(e) {

    e.cancelBubble = true;
    $.tessera.backgroundImage = immagineTessera;
    Ti.API.info("WIDTH: " + e.source.toImage().width);
    Ti.API.info("HEIGHT: " + e.source.toImage().height);

    var imgWidth = PixelsToDPUnits(e.source.toImage().width);
    var imgHeight = PixelsToDPUnits(e.source.toImage().height);

    Ti.API.info("WIDTH IN DP: " + $.titolare.height);

    if (flag == false) {
        flag = true;
        //$.titolare.bottom = (imgHeight * 0.0385) + 45;
        //$.titolare.left = (imgWidth * 0.771);

    };

}

var showSYC = _.throttle(function() {
    var winVantaggiSoci = Alloy.createController('VantaggiSociMain').getView();
    Alloy.Globals.navMenu.openWindow(winVantaggiSoci);
}, 1000);


//$.tessera.transform = Ti.UI.create2DMatrix().rotate(-90);

function PixelsToDPUnits(ThePixels) {
    if (Titanium.Platform.displayCaps.dpi > 160) {
        if (Ti.Platform.displayCaps.density == 'high' && Ti.Platform.osname == 'iphone') { //retina iPhone
            return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160)) * 2;
        }
        return (ThePixels / (Titanium.Platform.displayCaps.dpi / 160));
    } else {
        if (Ti.Platform.displayCaps.density == 'low') {
            return (ThePixels * (160 / Titanium.Platform.displayCaps.dpi));
        }
        return ThePixels;
    }
}

function DPUnitsToPixles(theDPs) {
    if (Titanium.Platform.displayCaps.dpi > 160) {
        if (Ti.Platform.displayCaps.density == 'high' && Ti.Platform.osname == 'iphone') { //retina iPhone
            return (theDPs * (Titanium.Platform.displayCaps.dpi / 160)) / 2;
        }
        return (theDPs * (Titanium.Platform.displayCaps.dpi / 160));
    } else {
        if (Ti.Platform.displayCaps.density == 'low') {
            return (theDPs / (160 / Titanium.Platform.displayCaps.dpi));
        }
        return theDPs;
    }
}

require('PagingControl'); 
var sViewPagingControl = new PagingControl($.SC); 
$.pagingContainer.add(sViewPagingControl); 

_.defer(fit);

function fit() {
    $.rotatedContainer.setWidth($.tessera.rect.width);
}