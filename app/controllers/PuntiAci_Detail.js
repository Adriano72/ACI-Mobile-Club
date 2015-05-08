var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');



//Handler per la telefonata
var doPhoneCall = commons.doPhoneCall;
//Handler per l'invio email
var doSendEmail = commons.doSendEmail;


//inizializzazioni comuni della Window
commons.initWindow($.win, args.titolo, args.headerImg, [{
    icon: OS_IOS ? "/images/ic_action_gps.png" : "/images/ic_action_gps.png",
    onClick: function() {
        console.log('	open nav', $.detailModel);
        var location = $.detailModel.get('address').location;
        commons.openNavigation({
            lat: location[1],
            lon: location[0]
        });
    }
}]);


//carica i dati
loadData();


function loadData() {
    var utility = require('utility');
    var modelGot;
    if (args.fromMap) {
        modelGot = args.data;
    } else {
        modelGot = args.data.attributes;
    }
    modelGot.email = modelGot.contacts.email[0];
    modelGot.telefono = modelGot.contacts.tel[0];
    modelGot.fax = modelGot.contacts.fax[0];
    modelGot.web = modelGot.contacts.web[0];

    if (modelGot._type == 'del') {
        modelGot.title = modelGot.customName;
        var addr = formatContacts([modelGot.name, modelGot.address.formatted]);

    } else {
        var addr = modelGot.address.formatted;
        modelGot.title = modelGot.name;

    }


    modelGot.formattedAddress = addr;
    var services = (modelGot.services || []).concat(modelGot.customServices || []);
    modelGot.servizi = utility.formattaServizi(services);
    modelGot.orari = utility.formattaOrari(modelGot.schedule.timetable);

    if (modelGot.images && !_.isEmpty(modelGot.images)) {
        var interior = modelGot.images.exterior;
        var exterior = modelGot.images.exterior;

        modelGot.covers = [];
        if (exterior) {
            modelGot.covers.push(Alloy.Globals.PuntiAciBannerBaseURL + exterior);
        }
        if (interior) {
            modelGot.covers.push(Alloy.Globals.PuntiAciBannerBaseURL + interior);
        }

        console.log('**cover ', modelGot.covers);

        _(modelGot.covers).each(function(e) {
            console.log(e);
            var img = Ti.UI.createImageView({
                image: e,
                width: Ti.UI.FILL,
                height: 80
            });
            $.cover.addView(img);
        });

    }
    //porcate layout
    modelGot.orariVisible = Boolean(modelGot.orari);
    modelGot.telefonoVisible = Boolean(modelGot.telefono);
    modelGot.emailVisible = Boolean(modelGot.email);
    modelGot.orariHeight = modelGot.orariVisible ? 40 : 0;
    modelGot.telefonoHeight = modelGot.telefonoVisible ? 40 : 0;
    modelGot.emailHeight = modelGot.emailVisible ? 40 : 0;

    modelGot.coverVisible = !_.isEmpty(modelGot.covers);
    modelGot.coverHeight = modelGot.coverVisible ? 80 : 0;

    $.cover.height = modelGot.coverVisible ? 80 : 0;
    $.cover.showPagingControl = modelGot.covers.length > 1;

    $.detailModel.set(modelGot);
}

function formatContacts(cnts) {
    var r = [];
    for (var i = 0; i < cnts.length; i++) {
        var c = cnts[i];
        if (c) r.push(c);
    };
    return r.join('\n');
}



function toggleDettaglioServizi(e) {

    e.cancelBubble = true;
    if ($.dettaglioServizi.visible == true) {
        $.dettaglioServizi.visible = false;
        $.serviziIcon.image = "/images/ic_action_servizi_blu.png";
        $.serviziText.color = Alloy.Globals.palette.blu;
        $.rowServizi.backgroundColor = "#fff";
        $.dettaglioServizi.height = 0;

    } else {
        $.dettaglioServizi.height = Ti.UI.SIZE;
        $.serviziIcon.image = "/images/ic_action_servizi_bianco.png";
        $.serviziText.color = "#fff";
        $.rowServizi.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioServizi.visible = true;

    }

};

function toggleDettaglioOrari(e) {

    e.cancelBubble = true;

    if ($.dettaglioOrari.visible == true) {
        $.dettaglioOrari.visible = false;
        $.orariIcon.image = "/images/ic_action_orari_blu.png";
        $.orariText.color = Alloy.Globals.palette.blu;
        $.rowOrari.backgroundColor = "#fff";
        $.dettaglioOrari.height = 0;

    } else {
        $.dettaglioOrari.height = Ti.UI.SIZE;
        $.orariIcon.image = "/images/ic_action_servizi_bianco.png";
        $.orariText.color = "#fff";
        $.rowOrari.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioOrari.visible = true;

    }

};


$.win.addEventListener('close', function() {
    $.destroy();
});