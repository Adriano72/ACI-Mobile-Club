exports.puntiAciMain = function() {

	var itemsObj = [{
		img : "/images/ic_action_aci.png",
		text : "Automobile Club",
		id_code : "AC"

	}, {
		img : "/images/ic_action_delegazioni.png",
		text : "Delegazioni",
		id_code : "DEL"

	}, {
		img : "/images/ic_action_uffici_pra.png",
		text : "Uffici PRA",
		id_code : "PRA"

	}, {
		img : "/images/ic_action_urp.png",
		text : "Uffici Relazione con il Pubblico",
		id_code : "URP"

	}, {
		img : "/images/ic_action_assistenza_tasse.png",
		text : "Assistenza tasse automobilistiche",
		id_code : "TASSE"

	}, {
		img : "/images/ic_action_demolitori.png",
		text : "Demolitori",
		id_code : "DEM"

	}];

	return itemsObj;

};

exports.categorieSyc = function() {

	var itemsObj = [{
		img : "ico_dormiremangiare_blu.png",
		long_name : "Dormire & Mangiare",
		short_name : "dormire_mangiare"
	}, {
		img : "ico_tempo_libero_blu.png",
		long_name : "Tempo Libero & Benessere",
		short_name : "tempo_libero_benessere"
	}, {
		img : "ico_musei_blu.png",
		long_name : "Cultura & Spettacoli",
		short_name : "cultura_spettacoli"
	}, {
		img : "ico_mobilita_01.png",
		long_name : "Noleggi & Trasporti",
		short_name : "noleggi_trasporti"
	}, /*{
		img : "ico_sport_01.png",
		long_name : "Sport & Eventi",
		short_name : "sport_eventi"
	}, */{
		img : "ico_altri_servizi_blu.png",
		long_name : "Altri Servizi",
		short_name : "altri_servizi"
	}];
	
	return itemsObj;

};
