var args = arguments[0] || {};

var utility = require('utility');
var commons = require('commons');
var encoder = require('encoder');


//Handler per la telefonata
var doPhoneCall = commons.doPhoneCall;
//Handler per l'invio email
var doSendEmail = commons.doSendEmail;



//inizializzazioni comuni della Window
commons.initWindow($.win, args.titolo || 'Dettaglio Convenzione', args.headerImg, [{
    icon: OS_IOS ? "/images/ic_action_gps.png" : "/images/ic_action_gps.png",
    onClick: function() {
        var location = $.dormireMangiare.get('address').location;
        commons.openNavigation({
            lat: location[1],
            lon: location[0]
        });
    }
}]);

//carica i dati
loadData();


function loadData() {

    if (args.isBanner) {

        var modelGot = args.data;

    } else if (_.isUndefined(args.data.annotation)) {

        var modelGot = args.data.attributes;

    } else {

        var modelGot = args.data.annotation;

    };

    Ti.API.info("DATI: " + JSON.stringify(modelGot));


    modelGot.telefono = modelGot.contacts.tel[0];
    modelGot.fax = modelGot.contacts.fax[0];
    modelGot.web = modelGot.contacts.web[0];
    modelGot.email = modelGot.contacts.email[0];

    var meta = '<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.8">';

    // var addr = formatContacts([modelGot.address.formatted, modelGot.tel, modelGot.fax, modelGot.web]);
    var addr = modelGot.address.formatted;
    modelGot.formattedAddress = addr;
    //modelGot.descrizione = encoder.Encoder.htmlDecode(modelGot.agreement_id.serviceTypeDesc).trim();
    if (modelGot.agreement_id && modelGot.agreement_id.serviceTypeDesc) modelGot.descrizione = meta + modelGot.agreement_id.serviceTypeDesc.trim();
    //  modelGot.come = encoder.Encoder.htmlDecode(modelGot.agreement_id.discountDesc).trim();
    if (modelGot.agreement_id && modelGot.agreement_id.discountDesc) modelGot.come = meta + modelGot.agreement_id.discountDesc.trim();
    console.log("come", modelGot.come);
    //  modelGot.vantaggio = encoder.Encoder.htmlDecode(modelGot.agreement_id.offerDesc).trim();
    if (modelGot.agreement_id && modelGot.agreement_id.offerDesc) modelGot.vantaggio = meta + modelGot.agreement_id.offerDesc.trim();
    modelGot.logo = encodeURI(Alloy.Globals.bannerBaseURL + (modelGot.agreement_id.images.logo || modelGot.agreement_id.images.banner));


    if (modelGot.agreement_id.photoGallery && modelGot.agreement_id.photoGallery.length) {
        //   console.log('ho la galleria', modelGot.agreement_id.photoGallery);
        modelGot.images = _(modelGot.agreement_id.photoGallery).map(function(e) {
            return Alloy.Globals.bannerBaseURL + e.replace(" ", "%20");
        });
    } else {
        modelGot.images = [modelGot.logo];
    }

    $.gallery.getView().height = Alloy.Globals.deviceWidth * (600 / 1024);
    $.gallery.getView().width = Alloy.Globals.deviceWidth;
    $.gallery.setImages(modelGot.images);

    _.defer(function() {
        $.contatti.setContacts(modelGot.contacts);
    });

    //porcate layout
    modelGot.orariVisible = Boolean(modelGot.orari);
    modelGot.telefonoVisible = Boolean(modelGot.telefono);
    modelGot.emailVisible = Boolean(modelGot.email);
    modelGot.contattiVisible = _(['web', 'telefono', 'fax']).some(function(e) {
        var c = modelGot.contacts[e];
        return c && c[0];
    });

    modelGot.orariHeight = modelGot.orariVisible ? 40 : 0;
    modelGot.telefonoHeight = modelGot.telefonoVisible ? 40 : 0;
    modelGot.emailHeight = modelGot.emailVisible ? 40 : 0;
    modelGot.contattiHeight = modelGot.contattiVisible ? 40 : 0;

    console.log('modelGot.logo', modelGot.logo);
    console.log('modelGot.agreement_id.images.logo', modelGot.agreement_id.images.logo);

    $.dormireMangiare.set(modelGot);


}

function formatContacts(cnts) {
    var r = [];
    for (var i = 0; i < cnts.length; i++) {
        var c = cnts[i];
        if (c) r.push(c);
    };
    return r.join('\n');
}


function toggleDettaglioDescrizione(e) {

    e.cancelBubble = true;

    if ($.dettaglioDescrizione.visible == true) {

        $.dettaglioDescrizione.visible = false;
        $.descrizioneIcon.image = "/images/ic_action_descrizione_blu.png";
        $.descrizioneText.color = Alloy.Globals.palette.blu;
        $.rowDescrizione.backgroundColor = "#fff";
        $.dettaglioDescrizione.height = 0;

    } else {

        $.dettaglioDescrizione.height = Ti.UI.SIZE;
        $.descrizioneIcon.image = "/images/ic_action_descrizione_bianco.png";
        $.descrizioneText.color = "#fff";
        $.rowDescrizione.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioDescrizione.visible = true;

    }

};



function toggleDettaglioVantaggio(e) {

    e.cancelBubble = true;

    if ($.dettaglioVantaggio.visible == true) {
        $.dettaglioVantaggio.visible = false;
        $.vantaggioIcon.image = "/images/ic_action_sconti_blu.png";
        $.vantaggioText.color = Alloy.Globals.palette.blu;
        $.rowVantaggio.backgroundColor = "#fff";
        $.dettaglioVantaggio.height = 0;

    } else {
        $.dettaglioVantaggio.height = Ti.UI.SIZE;
        $.vantaggioIcon.image = "/images/ic_action_sconti_bianco.png";
        $.vantaggioText.color = "#fff";
        $.rowVantaggio.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioVantaggio.visible = true;

    }

};

function toggleDettaglioComeVantaggio(e) {

    e.cancelBubble = true;

    if ($.dettaglioComeVantaggio.visible == true) {
        $.dettaglioComeVantaggio.visible = false;
        $.comeVantaggioIcon.image = "/images/ic_action_monete_blu.png";
        $.comeVantaggioText.color = Alloy.Globals.palette.blu;
        $.rowComeVantaggio.backgroundColor = "#fff";
        $.dettaglioComeVantaggio.height = 0;

    } else {
        $.dettaglioComeVantaggio.height = Ti.UI.SIZE;
        $.comeVantaggioIcon.image = "/images/ic_action_monete_bianco.png";
        $.comeVantaggioText.color = "#fff";
        $.rowComeVantaggio.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioComeVantaggio.visible = true;

    }

};

function toggleDettaglioContatti(e) {

    e.cancelBubble = true;

    if ($.dettaglioContatti.visible == true) {
        $.dettaglioContatti.visible = false;
        $.contattiIcon.image = "/images/ic_action_contatti_blu.png";
        $.contattiText.color = Alloy.Globals.palette.blu;
        $.rowContatti.backgroundColor = Alloy.Globals.palette.bianco_sporco;
        $.dettaglioContatti.height = 0;

    } else {
        $.dettaglioContatti.height = Ti.UI.SIZE;
        $.contattiIcon.image = "/images/ic_action_contatti_bianco.png";
        $.contattiText.color = "#fff";
        $.rowContatti.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioContatti.visible = true;
        $.scroller.scrollToBottom();

    }

};


function openAciMerchant() {
    var hasApp = false;
    var appUrl = "useyourcardmerchant://"
    var storeUrl = OS_IOS ? "https://itunes.apple.com/us/app/aci-merchant/id1021977050?l=it&ls=1&mt=8" : "https://play.google.com/store/apps/details?id=it.aci.informatica.useyourcard.merchant";

    if (OS_IOS) {
        hasApp = Ti.Platform.canOpenURL(appUrl);
    } else if (OS_ANDROID) {
        hasApp = false;

        //Add our tools module
        var tools = require('bencoding.android.tools');
        var platformTools = tools.createPlatform();

        //Create our PDF intent
        var intent = Ti.Android.createIntent({
            action: Ti.Android.ACTION_VIEW,
            //packageName: 'it.aci.informatica.useyourcard.merchant'
            data: appUrl
        });




        //Check that the device can open the intent
        if (platformTools.intentAvailable(intent)) {
            //Since the device can open the intent run startActivity
            try {
                hasApp = true;
            } catch (e) {
                hasApp = false;

                Ti.API.debug(e);
            }
        } else {
            hasApp = false;
        }

    }


    console.log('openAciMerchant', hasApp, appUrl);

    if (hasApp) {
        Ti.Platform.openURL(appUrl);
    } else {
        Ti.Platform.openURL(storeUrl);
    }

}


$.win.addEventListener('close ', function() {
    $.destroy();
});