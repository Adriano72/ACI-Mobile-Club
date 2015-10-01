var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');


var coverInterval, currentCover;

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
    //  console.log(modelGot);
    modelGot.email = modelGot.contacts && modelGot.contacts.email ? modelGot.contacts.email[0] : '';
    modelGot.telefono = modelGot.contacts && modelGot.contacts.tel ? modelGot.contacts.tel[0] : '';
    modelGot.fax = modelGot.contacts && modelGot.contacts.fax ? modelGot.contacts.fax[0] : '';
    modelGot.web = modelGot.contacts && modelGot.contacts.web ? modelGot.contacts.web[0] : '';

    if (modelGot._type == 'del') {
        modelGot.title = modelGot.customName + ' ' + modelGot.code;
        var addr = formatContacts([modelGot.name, modelGot.address.formatted]);

    } else {
        var addr = modelGot.address.formatted;
        modelGot.title = modelGot.name;

    }


    modelGot.formattedAddress = addr;
    var services = (modelGot.services || []).concat(modelGot.customServices || []);
    modelGot.servizi = utility.formattaServizi(services);
    modelGot.orari = modelGot.schedule ? [utility.formattaOrari(modelGot.schedule.timetable)].concat(modelGot.schedule.festivals || []).join('\n') : '';
    modelGot.covers = [];

    var coverHeight = 220;


    var sourceImages = modelGot.images || {
        interior: null,
        exterior: null
    };

    console.log('modelGot.images 1', modelGot.images);


    //gestione delle cover
    var type_for_cover = ['aacc', 'del', 'urp', 'tasse', 'pra'];
    if (_(type_for_cover).indexOf(modelGot._type) >= 0) {


        //array delle immagini di copertina
        var covers = _([sourceImages.interior, sourceImages.exterior]).chain()
            //elimina le undefined
            .filter(function(e) {
                return e;
            })
            //formatta le url
            .map(function(e) {
                return [Alloy.Globals.PuntiAciBannerBaseURL, modelGot._type, e].join('/').replace(/\s/gi, '%20');
            })
            .value();

        //se ci sono le immagini, le assegno
        // altrimenti metto la cover di default
        if (covers && covers.length > 0) {

            modelGot.covers = covers;

        } else {


            modelGot.covers = ['/puntiaci_default_cover.jpg'];

        }
        console.log('modelGot.images 2', modelGot.images, modelGot.covers);
        $.gallery.getView().height = Alloy.Globals.deviceWidth * (600 / 1024);
        $.gallery.getView().width = Alloy.Globals.deviceWidth;
        $.gallery.setImages(modelGot.covers);



    } else {
        $.gallery.getView().height = 0;
    }


    //compongo i contatti
    modelGot.contatti = (function() {

        if (_.isEmpty(modelGot.contacts)) {
            return '';
        } else {

            var c = _(['web', 'telefono', 'fax']).chain()
                .filter(function(x) {
                    return !_.isEmpty(modelGot.contacts[x] && modelGot.contacts[x][0]);
                })
                /*   .map(function(x) {
                    if (modelGot.contacts[x].join('').length == 0) {
                        return '';
                    }
                    return [x, ': ', '<a href="http://',modelGot.contacts[x].join(','),'">', modelGot.contacts[x].join(','), '</a>'].join('');
                }) */
                .map(function(x) {
                    var target = modelGot.contacts[x][0];
                    return {
                        type: {
                            text: x
                        },
                        target: {
                            text: target,
                            href: (function formatHREF(type) {
                                if (type == 'web' && target.indexOf('http') < 0) return 'http://' + target;
                                else if (type == 'tel' || type == 'fax') return 'tel:' + target;
                                else return target;
                            })(x)
                        }
                    };
                })
                .value();
            return c;
        }

    })();

    _.defer(function() {
        $.ls.setItems(modelGot.contatti);
    });

    //porcate layout
    modelGot.orariVisible = Boolean(modelGot.orari);
    modelGot.telefonoVisible = Boolean(modelGot.telefono);
    modelGot.emailVisible = Boolean(modelGot.email);
    modelGot.noteVisible = Boolean(modelGot.note);
    modelGot.contattiVisible = Boolean(modelGot.contatti && modelGot.contatti.length);

    modelGot.orariHeight = modelGot.orariVisible ? 40 : 0;
    modelGot.telefonoHeight = modelGot.telefonoVisible ? 40 : 0;
    modelGot.emailHeight = modelGot.emailVisible ? 40 : 0;
    modelGot.noteHeight = modelGot.noteVisible ? 40 : 0;
    modelGot.contattiHeight = modelGot.contattiVisible ? 40 : 0;



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
        $.rowServizi.backgroundColor = Alloy.Globals.palette.bianco_sporco;
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
        $.rowOrari.backgroundColor = Alloy.Globals.palette.bianco_sporco;
        $.dettaglioOrari.height = 0;

    } else {
        $.dettaglioOrari.height = Ti.UI.SIZE;
        $.orariIcon.image = "/images/ic_action_servizi_bianco.png";
        $.orariText.color = "#fff";
        $.rowOrari.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioOrari.visible = true;

    }

};

function toggleDettaglioNote(e) {

    e.cancelBubble = true;

    if ($.dettaglioNote.visible == true) {
        $.dettaglioNote.visible = false;
        $.noteIcon.image = "/images/ic_action_descrizione_blu.png";
        $.noteText.color = Alloy.Globals.palette.blu;
        $.rowNote.backgroundColor = Alloy.Globals.palette.bianco_sporco;
        $.dettaglioNote.height = 0;

    } else {
        $.dettaglioNote.height = Ti.UI.SIZE;
        $.noteIcon.image = "/images/ic_action_descrizione_bianco.png";
        $.noteText.color = "#fff";
        $.rowNote.backgroundColor = Alloy.Globals.palette.blu;
        $.dettaglioNote.visible = true;
        $.scroller.scrollToBottom();

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

function openUrl(e) {
    console.log('openUrl', e);
    var source = OS_IOS ? e.source : e.section.items[e.itemIndex].target;
    if (e.bindId == 'target' && source.href) {
        Ti.Platform.openURL(source.href);
    }
}


$.win.addEventListener('close', function() {
    clearInterval(coverInterval);
    $.destroy();
});