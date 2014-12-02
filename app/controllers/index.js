var ViewScrollr = require("ViewScrollr");
var settingsMenu = require('settingsMenu');

if (OS_ANDROID)
	var abx = require('com.alcoapps.actionbarextras');
//var menuTop = (OS_ANDROID)?PixelsToDPUnits((Titanium.Platform.displayCaps.platformHeight/2))-40:(Titanium.Platform.displayCaps.platformHeight/2)-15;
var menuTop = (OS_ANDROID) ? Alloy.Globals.deviceHeightHalf - 40 : Alloy.Globals.deviceHeightHalf - 30;
$.menuView.top = menuTop;

function doopen(evt) {

	Alloy.Globals.navMenu = $.navWin;
	if (OS_ANDROID) {
		abx.title = "ACI Mobile Club";
		abx.titleFont = "ACI Type Regular.otf";
		abx.titleColor = "#4A678C";

		//actionBarHelper.setIcon('/drawericonw@2x.png');

	} else {
		//$.windowtitle.text = winTitle;
	}
	require('locationServices').getUserLocation(loadData);
}

var view1 = Ti.UI.createView({
	backgroundImage : "/images/banner1.png"
});

var view2 = Ti.UI.createView({
	backgroundImage : "/images/beach.jpg"
});

var view3 = Ti.UI.createView({
	backgroundImage : "/images/lizard.jpg"
});

var Banner = ViewScrollr.create({
	width : "98%",
	height : (OS_ANDROID) ? "48.5%" : "50%",
	top : (OS_ANDROID) ? 3 : 2,
	auto : true,
	delay : 3000,
	navigation : {
		selectedColor : "#fff",
		color : "#000",
		backgroundColor : "#fff"
	},
	panels : [{
		view : view1
	}, {
		view : view2
	}, {
		view : view3
	}]
});

var scrollHack = _.once(triggerScroll);

function triggerScroll() {
	//Ti.API.info("**** FIRE EVENT *****");
	if (OS_ANDROID) {
		Ti.App.fireEvent('initialScrollHack');
	};
}

$.index.add(Banner);

function closeSideMenu() {
	settingsMenu.hideMenu(rightSettingsMenu);
}

var rightSettingsMenu = settingsMenu.openSideMenu();

$.index.add(rightSettingsMenu);

function toggleSideMenu() {

	settingsMenu.toggleMenu(rightSettingsMenu);
}

function tessera() {

	if (Ti.App.Properties.getBool("utenteAutenticato")) {

		var winTessera = Alloy.createController('showTessera', Ti.App.Properties.getObject("datiUtente")).getView();
		Alloy.Globals.navMenu.openWindow(winTessera);

	} else {

		var winLogin = Alloy.createController('loginWindow').getView();
		Alloy.Globals.navMenu.openWindow(winLogin);

	}

	

}

function swipeAction(e) {// NON USATA AL MOMENTO
	if (e.direction == "up") {
		$.menuView.animate({
			top : (OS_ANDROID) ? 0 : 45
		});
	}

	if (e.direction == "down") {
		$.menuView.animate({
			top : menuTop
		});
	}

};

function doPhoneCall(e) {
	e.cancelBubble = true;
	var winSoccorso = Alloy.createController('soccorsoStradale').getView();
	Alloy.Globals.navMenu.openWindow(winSoccorso);

};

function openPuntiACI() {
	var winPAci = Alloy.createController('PuntiAciMain').getView();
	Alloy.Globals.navMenu.openWindow(winPAci);

}

function openVantaggiSoci() {
	var winVantaggiSoci = Alloy.createController('VantaggiSociMain').getView();
	Alloy.Globals.navMenu.openWindow(winVantaggiSoci);

}

function loadData() {

	uno();

	function uno() {

		Alloy.Globals.loading.show('Sincronizzazione', false);

		net.getBanner(function(p_data) {
			try {

				//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));

				Alloy.Globals.bannerImageURL = Alloy.Globals.bannerBaseURL + p_data[0].agreement_id.images.banner;
				Alloy.Globals.convenzioneBanner = p_data[0];
				Ti.API.info("BANNER DATA: " + Alloy.Globals.bannerImageURL);
				_.defer(due);
			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server :\n" + error);
			}
		});

	}

	function due() {

		net.getPuntiAci("aacc", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
				Alloy.Collections.automobileClub.reset(p_data);
				Ti.API.info("AACC COLLECTION LENGTH: " + Alloy.Collections.automobileClub.length);
				_.defer(tre);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});

	}

	function tre() {

		net.getPuntiAci("del", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
				Alloy.Collections.delegazioni.reset(p_data);
				Ti.API.info("DEL COLLECTION LENGTH: " + Alloy.Collections.delegazioni.length);
				_.defer(quattro);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function quattro() {

		net.getPuntiAci("pra", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
				Alloy.Collections.pra.reset(p_data);
				Ti.API.info("PRA COLLECTION LENGTH: " + Alloy.Collections.pra.length);
				_.defer(cinque);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function cinque() {

		net.getPuntiAci("urp", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
				Alloy.Collections.urp.reset(p_data);
				Ti.API.info("URP COLLECTION LENGTH: " + Alloy.Collections.urp.length);
				_.defer(sei);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function sei() {

		net.getPuntiAci("tasse", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
				Alloy.Collections.tasse.reset(p_data);
				Ti.API.info("TASSE COLLECTION LENGTH: " + Alloy.Collections.tasse.length);
				_.defer(sette);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function sette() {

		net.getDemolitori("dem", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
				Alloy.Collections.demolitori.reset(p_data);
				Ti.API.info("DEMOLITORI COLLECTION LENGTH: " + Alloy.Collections.demolitori.length);
				_.defer(otto);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function otto() {

		net.getVantaggiSoci("dormire_mangiare", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
				Alloy.Collections.dormireMangiare.reset(p_data);
				Ti.API.info("SYC DORMIRE MANGIARE COLLECTION LENGTH: " + Alloy.Collections.dormireMangiare.length);
				_.defer(nove);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function nove() {

		net.getVantaggiSoci("tempo_libero_benessere", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT TEMPO LIBERO: " + JSON.stringify(p_data));
				Alloy.Collections.tempoLibero.reset(p_data);
				Ti.API.info("SYC TEMPO LIBERO BENESSERE COLLECTION LENGTH: " + Alloy.Collections.tempoLibero.length);
				_.defer(dieci);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function dieci() {

		net.getVantaggiSoci("cultura_spettacoli", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT CULTURA SPETTACOLI: " + JSON.stringify(p_data));
				Alloy.Collections.culturaSpettacoli.reset(p_data);
				Ti.API.info("SYC CULTURA SPETTACOLI COLLECTION LENGTH: " + Alloy.Collections.culturaSpettacoli.length);
				_.defer(undici);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function undici() {

		net.getVantaggiSoci("noleggi_trasporti", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT NOLEGGI TRASPORTI: " + JSON.stringify(p_data));
				Alloy.Collections.noleggiTrasporti.reset(p_data);
				Ti.API.info("SYC NOLEGGI TRASPORTI COLLECTION LENGTH: " + Alloy.Collections.noleggiTrasporti.length);
				_.defer(dodici);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function dodici() {

		net.getVantaggiSoci("sport_eventi", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT NOLEGGI TRASPORTI: " + JSON.stringify(p_data));
				Alloy.Collections.sportEventi.reset(p_data);
				Ti.API.info("SYC SPORT EVENTI COLLECTION LENGTH: " + Alloy.Collections.sportEventi.length);
				_.defer(tredici);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function tredici() {

		net.getVantaggiSoci("altri_servizi", function(p_data) {
			try {
				//Ti.API.info("XHR RESULT NOLEGGI TRASPORTI: " + JSON.stringify(p_data));
				Alloy.Collections.altriServizi.reset(p_data);
				Ti.API.info("SYC ALTRI SERVIZI COLLECTION LENGTH: " + Alloy.Collections.altriServizi.length);
				_.defer(ultima);

			} catch(error) {
				Alloy.Globals.loading.hide();
				alert("Problemi di comunicazione con il server:\n" + error);
			}
		});
	}

	function ultima() {
		Alloy.Globals.loading.hide();
	}

}

$.navWin.open();

