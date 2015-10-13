var utility = require('utility');
var commons = require('commons');



var showSYC = _.throttle(function() {
    var winVantaggiSoci = Alloy.createController('VantaggiSociMain').getView();
    Alloy.Globals.navMenu.openWindow(winVantaggiSoci);
}, 1000);


function fit() {
    console.log('fit');
//    $.rotatedContainer.setWidth($.tessera.rect.width);
 //   $.rotatedContainer.setHeight($.tessera.rect.height);
}


function buildPaginator() {
    var PagingControl = require('PagingControl');
    var sViewPagingControl = new PagingControl($.SC);
    $.pagingContainer.add(sViewPagingControl);
}

function loadData(args) {


    var immagineTessera, immagineTesseraRetro;

    //controllo la scadenza
    var scadenza = new Date(args['userInfo.dataScadenza']);
    console.log('dataScadenza', new Date(args['userInfo.dataScadenza']));
    console.log('dataScadenza', args['userInfo.dataScadenza']);

    var code = args['userInfo.categoriaTessera'];

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

    Ti.API.info('TESSERA: ' + immagineTessera);
    Ti.API.info('TESSERA RETRO: ' + immagineTesseraRetro);


    $.titolare.text = args['userInfo.name'] + ' ' + args['userInfo.surname'];
    $.numTessera.text = args['userInfo.numeroTessera'];

    console.log('TITOLARE t', $.titolare.text);
    console.log('TITOLARE v', $.titolare.visible);

    var pieces = args['userInfo.dataScadenza'].split('/');


    //Ti.API.info('SPLITTED: '+pieces);
    pieces.reverse();
    var reversed = pieces.join('/');
    //Ti.API.info('SPLITTED: '+reversed);

    $.validita.text = 'FINO AL ' + reversed;
}

function loadQR(args) {
    var qr = Alloy.Globals.baseURL + '/qrcode/acicardno/' + args['userInfo.numeroTessera'] + '.png?options={"size":8,"margin":1}';
    console.log('qr', qr);
    $.barcode.image = qr;
}

function rotateContent() {

    $.rotatedContainer.transform = Ti.UI.create2DMatrix().rotate(-90);



    if (OS_ANDROID) {
        console.log('img', $.tessera.width, $.tessera.rect);
        $.rotatedContainer.setBottom('25%');
        $.rotatedContainer.setRight("-15%");
    } else {

        if (Ti.Platform.displayCaps.platformHeight <= 480) {
            $.rotatedContainer.setBottom('32%');
        } else {
            $.rotatedContainer.setBottom('29%');
        }

        $.rotatedContainer.setLeft('25%');
    }


}



(function constructor(args) {

    Ti.API.info('ARGS: ' + JSON.stringify(args));

    //inizializzazioni comuni della Window
    commons.initWindow($.win, 'La mia tessera', '/ico_tessera_01.png');


    //carica i dati nella UI
    loadData(args);

    //ruota la UI, in modo da metere la tessera in verticale
    rotateContent();

    //inizializza il paginatore custom
    buildPaginator();


    

    function onPostlayout() {
        console.log('postlayout');
        $.win.removeEventListener('postlayout', onPostlayout);


        //carica il QR code
        loadQR(args);

        //aggiusta le dimensioni dei componenti UI
        fit();

    }
    $.win.addEventListener('postlayout', onPostlayout);


})(arguments[0] || {});