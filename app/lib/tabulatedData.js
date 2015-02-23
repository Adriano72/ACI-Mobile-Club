exports.puntiAciMain = function() {

    var itemsObj = [{
            img: "/images/ic_action_aci.png",
            text: "Automobile Club",
            id_code: "AC"

        }, {
            img: "/images/ic_action_delegazioni.png",
            text: "Delegazioni",
            id_code: "DEL"

        }, {
            img: "/images/ic_action_uffici_pra.png",
            text: "Uffici PRA",
            id_code: "PRA"

        }, {
            img: "/images/ic_action_urp.png",
            text: "Uffici Relazione con il Pubblico",
            id_code: "URP"

        }, {
            img: "/images/ic_action_assistenza_tasse.png",
            text: "Assistenza tasse automobilistiche",
            id_code: "TASSE"

        }, {
            img: "/images/ic_action_demolitori.png",
            text: "Demolitori",
            id_code: "DEM"

        }

    ];

    //tengo questa fino a che non risolgo il problema di disaccoppiare ricerca e tabella su android
    if (OS_ANDROID) {
        itemsObj.push({
            img: "/images/ic_action_cerca_per_servizio_blu.png",
            text: "Ricerca per servizio",
            id_code: "RIC"

        });
    }

    return itemsObj;


};
/*
Nome completo	Etichetta
Dormire & Mangiare	dormire_mangiare
Tempo Libero	tempo_libero_benessere
Mobilità	noleggi_trasporti
Sport & Eventi	sport_eventi
Altri Servizi	altri_servizi
Benessere e Salute	benessere_e_salute
Tutto per l'auto	tutto_per_lauto
Shopping	shopping
Casa	casa
Cultura	cultura
*/
exports.categorieSyc = function() {

    var itemsObj = [{
            img: "/images/ic_action_dormire_mangiare.png",
            long_name: "Dormire & Mangiare",
            short_name: "dormire_mangiare"
        }, {
            img: "/images/ic_action_tempo_libero.png",
            long_name: "Tempo Libero & Benessere",
            short_name: "tempo_libero_benessere"
        }, {
            img: "/images/ic_action_cultura.png",
            long_name: "Cultura & Spettacoli",
            short_name: "cultura_spettacoli"
        }, {
            img: "/images/ic_action_noleggi.png",
            long_name: "Noleggi & Trasporti",
            short_name: "noleggi_trasporti"
        },
        /*{
		img : "ico_sport_01.png",
		long_name : "Sport & Eventi",
		short_name : "sport_eventi"
	}, */
        {
            img: "/images/ic_action_altri_servizi.png",
            long_name: "Altri Servizi",
            short_name: "altri_servizi"
        }
    ];

    return itemsObj;

};