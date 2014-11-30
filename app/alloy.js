// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var net = require("network");

Alloy.Globals.rememberMe = false;

Alloy.Globals.deviceWidth = parseInt(Ti.Platform.displayCaps.platformWidth / (Ti.Platform.displayCaps.logicalDensityFactor || 1), 10);
Alloy.Globals.deviceWidthHalf = Alloy.Globals.deviceWidth / 2;
Alloy.Globals.deviceHeight = parseInt(Ti.Platform.displayCaps.platformHeight / (Ti.Platform.displayCaps.logicalDensityFactor || 1), 10);
Alloy.Globals.deviceHeightHalf = Alloy.Globals.deviceHeight / 2;

Alloy.Globals.menuButtonsWidth = Alloy.Globals.deviceWidthHalf - 5;
Alloy.Globals.menuButtonsHeight = (OS_ANDROID) ? (Alloy.Globals.deviceHeight / 4) - 22 : (Alloy.Globals.deviceHeight / 4) - 20;
//Alloy.Globals.baseURL = "http://10.64.4.199:9900/api";
Alloy.Globals.baseURL = "http://www.aci.it/geo/v2";

require('locationServices').getUserLocation(loadData);

// PUNTI ACI
Alloy.Collections.instance("automobileClub");
Alloy.Collections.instance("delegazioni");
Alloy.Collections.instance("pra");
Alloy.Collections.instance("urp");
Alloy.Collections.instance("tasse");
Alloy.Collections.instance("demolitori");

Alloy.Collections.tempCollection = new Backbone.Collection();

//SYC
Alloy.Collections.instance("dormireMangiare");
Alloy.Collections.instance("tempoLibero");
Alloy.Collections.instance("culturaSpettacoli");
Alloy.Collections.instance("noleggiTrasporti");
Alloy.Collections.instance("sportEventi");
Alloy.Collections.instance("altriServizi");

function loadData() {

	due();

	function due() {
		net.getPuntiAci("aacc", function(p_data) {

			//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
			Alloy.Collections.automobileClub.reset(p_data);
			Ti.API.info("AACC COLLECTION LENGTH: " + Alloy.Collections.automobileClub.length);
			_.defer(tre);
		});

	}

	function tre() {
		net.getPuntiAci("del", function(p_data) {

			//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
			Alloy.Collections.delegazioni.reset(p_data);
			Ti.API.info("DEL COLLECTION LENGTH: " + Alloy.Collections.delegazioni.length);
			_.defer(quattro);
		});
	}

	function quattro() {
		net.getPuntiAci("pra", function(p_data) {

			//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
			Alloy.Collections.pra.reset(p_data);
			Ti.API.info("PRA COLLECTION LENGTH: " + Alloy.Collections.pra.length);
			_.defer(cinque);
		});
	}

	function cinque() {
		net.getPuntiAci("urp", function(p_data) {

			//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
			Alloy.Collections.urp.reset(p_data);
			Ti.API.info("URP COLLECTION LENGTH: " + Alloy.Collections.urp.length);
			_.defer(sei);
		});
	}

	function sei() {
		net.getPuntiAci("tasse", function(p_data) {

			//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
			Alloy.Collections.tasse.reset(p_data);
			Ti.API.info("TASSE COLLECTION LENGTH: " + Alloy.Collections.tasse.length);
			_.defer(sette);
		});
	}

	function sette() {
		net.getDemolitori("dem", function(p_data) {

			//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
			Alloy.Collections.demolitori.reset(p_data);
			Ti.API.info("DEMOLITORI COLLECTION LENGTH: " + Alloy.Collections.demolitori.length);
			_.defer(otto);
		});
	}

	function otto() {
		net.getVantaggiSoci("dormire_mangiare", function(p_data) {

			//Ti.API.info("XHR RESULT: " + JSON.stringify(p_data));
			Alloy.Collections.dormireMangiare.reset(p_data);
			Ti.API.info("SYC DORMIRE MANGIARE COLLECTION LENGTH: " + Alloy.Collections.dormireMangiare.length);
			_.defer(nove);
		});
	}

	function nove() {
		net.getVantaggiSoci("tempo_libero_benessere", function(p_data) {

			//Ti.API.info("XHR RESULT TEMPO LIBERO: " + JSON.stringify(p_data));
			Alloy.Collections.tempoLibero.reset(p_data);
			Ti.API.info("SYC TEMPO LIBERO BENESSERE COLLECTION LENGTH: " + Alloy.Collections.tempoLibero.length);
			_.defer(dieci);
		});
	}

	function dieci() {
		net.getVantaggiSoci("cultura_spettacoli", function(p_data) {

			//Ti.API.info("XHR RESULT CULTURA SPETTACOLI: " + JSON.stringify(p_data));
			Alloy.Collections.culturaSpettacoli.reset(p_data);
			Ti.API.info("SYC CULTURA SPETTACOLI COLLECTION LENGTH: " + Alloy.Collections.culturaSpettacoli.length);
			_.defer(undici);
		});
	}

	function undici() {
		net.getVantaggiSoci("noleggi_trasporti", function(p_data) {

			//Ti.API.info("XHR RESULT NOLEGGI TRASPORTI: " + JSON.stringify(p_data));
			Alloy.Collections.noleggiTrasporti.reset(p_data);
			Ti.API.info("SYC NOLEGGI TRASPORTI COLLECTION LENGTH: " + Alloy.Collections.noleggiTrasporti.length);
			_.defer(dodici);
		});
	}
	
	function dodici() {
		net.getVantaggiSoci("sport_eventi", function(p_data) {

			//Ti.API.info("XHR RESULT NOLEGGI TRASPORTI: " + JSON.stringify(p_data));
			Alloy.Collections.sportEventi.reset(p_data);
			Ti.API.info("SYC SPORT EVENTI COLLECTION LENGTH: " + Alloy.Collections.sportEventi.length);
			_.defer(tredici);
		});
	}
	
	function tredici() {
		net.getVantaggiSoci("altri_servizi", function(p_data) {

			//Ti.API.info("XHR RESULT NOLEGGI TRASPORTI: " + JSON.stringify(p_data));
			Alloy.Collections.altriServizi.reset(p_data);
			Ti.API.info("SYC ALTRI SERVIZI COLLECTION LENGTH: " + Alloy.Collections.altriServizi.length);
			//_.defer(tredici);
		});
	}

}
