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
    modelGot.email = modelGot.contacts.email[0];
    modelGot.telefono = modelGot.contacts.tel[0];
    modelGot.fax = modelGot.contacts.fax[0];
    modelGot.web = modelGot.contacts.web[0];

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
    modelGot.orari = utility.formattaOrari(modelGot.schedule.timetable);
    modelGot.covers = [];

    var coverHeight = 220;


    var sourceImages = modelGot.images || {
        interior: null,
        exterior: null
    };

    if (modelGot._type == 'aacc' || modelGot._type == 'del') {

        var cvs = [];
        if (sourceImages.interior) {
            cvs.push([Alloy.Globals.PuntiAciBannerBaseURL, modelGot._type, sourceImages.interior].join('/'));
        }

        if (sourceImages.exterior) {
            cvs.push([Alloy.Globals.PuntiAciBannerBaseURL, modelGot._type, sourceImages.exterior].join('/'));

        }

        if (cvs.length == 0) {
            cvs.push('/AutomobileClub.png');
        }



        _(cvs).each(function(e) {
            if (e) {
                e = e.replace(/\s/gi, '%20');
                console.log('cover e', e);
                modelGot.covers.push(e);
            } else {
                modelGot.covers.push('/AutomobileClub.png');
            }
        });




        _(modelGot.covers).each(function(e) {
            console.log(e);
            var img = Ti.UI.createImageView({
                image: e,

                width: Ti.UI.FILL,
                defaultImage: '/none.png'
                // height: coverHeight
            });

            var v = Ti.UI.createView({
                //  backgroundColor: "pink",
                //height: Ti.UI.SIZE,
                width: Ti.UI.FILL,
                height: coverHeight
            });
            v.add(img);
            $.cover.addView(v);
        });


        currentCover = 0;
        if (cvs.length > 1) {
            coverScroll = setInterval(function() {
                currentCover = (currentCover + 1) % $.cover.views.length;
                console.log('scroll', currentCover);
                $.cover.scrollToView(currentCover);
            }, 3000);
        }

    }


    //compongo i contatti
    modelGot.contatti = (function() {

        if (_.isEmpty(modelGot.contacts)) {
            return '';
        } else {
            var c = _(['web', 'telefono', 'fax']).chain()
                .filter(function(x) {
                    return !_.isEmpty(modelGot.contacts[x]);
                })
                .map(function(x) {
                    if (modelGot.contacts[x].join('').length == 0) {
                        return '';
                    }
                    return [x, ': ', modelGot.contacts[x].join(',')].join('');
                })
                .value();
            return c.join('\n');
        }

    })();

    //porcate layout
    modelGot.orariVisible = Boolean(modelGot.orari);
    modelGot.telefonoVisible = Boolean(modelGot.telefono);
    modelGot.emailVisible = Boolean(modelGot.email);
    modelGot.noteVisible = Boolean(modelGot.note);
    modelGot.contattiVisible = Boolean(modelGot.contatti);

    modelGot.orariHeight = modelGot.orariVisible ? 40 : 0;
    modelGot.telefonoHeight = modelGot.telefonoVisible ? 40 : 0;
    modelGot.emailHeight = modelGot.emailVisible ? 40 : 0;
    modelGot.noteHeight = modelGot.noteVisible ? 40 : 0;
    modelGot.contattiHeight = modelGot.contattiVisible ? 40 : 0;

    modelGot.coverVisible = !_.isEmpty(modelGot.covers);
    modelGot.coverHeight = modelGot.coverVisible ? coverHeight : 0;

    $.cover.height = modelGot.coverVisible ? coverHeight : 0;
    // $.cover.showPagingControl = modelGot.covers.length > 1;
    $.pagingContainer.visible = modelGot.covers.length > 1;

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

//custom paging control
var PagingControl = require('PagingControl');
var sViewPagingControl = new PagingControl($.cover);
var opac = Titanium.UI.createView({
    height: Ti.UI.SIZE,
    width: Ti.UI.SIZE,
    backgroundColor: Alloy.Globals.palette.bianco,
    opacity: 0.5
});
$.pagingContainer.add(opac);
$.pagingContainer.add(sViewPagingControl);




$.win.addEventListener('close', function() {
    clearInterval(coverInterval);
    $.destroy();
});