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
            img: "/images/ic_action_dormire_mangiare_blu.png",
            long_name: "Dormire & Mangiare",
            short_name: "dormire_mangiare",
            pin : "pin_DormireMangiare.png"
        }, {
            img: "/images/ic_action_benessere_salute_blu.png",
            long_name: "Benessere & Salute",
            short_name: "benessere_e_salute",
            pin : "pin_Benessere.png"
        }, {
            img: "/images/ic_action_casa_blu.png",
            long_name: "Casa",
            short_name: "casa",
            pin : "pin_Casa.png"
        }, {
            img: "/images/ic_action_cultura_blu.png",
            long_name: "Cultura",
            short_name: "cultura",
            pin : "pin_Cultura.png"
        }, {
            img: "/images/ic_action_mobilita_blu.png",
            long_name: "Mobilità",
            short_name: "noleggi_trasporti",
            pin : "pin_Mobilita.png"
        }, {
            img: "/images/ic_action_shopping_blu.png",
            long_name: "Shopping",
            short_name: "shopping",
            pin : "pin_Shopping.png"
        },
        /* {
            img: "ico_sport_01.png",
            long_name: "Sport & Eventi",
            short_name: "sport_eventi"
        },*/
        {
            img: "/images/ic_action_tempo_libero_blu.png",
            long_name: "Tempo Libero",
            short_name: "tempo_libero_benessere",
            pin : "pin_TempoLibero.png"
        }, {
            img: "/images/ic_action_tutto_per_auto_blu.png",
            long_name: "Tutto per l'auto",
            short_name: "tutto_per_lauto",
            pin : "pin_Tuttoxauto.png"
        }, {
            img: "/images/ic_action_altri_servizi_blu.png",
            long_name: "Altri Servizi",
            short_name: "altri_servizi",
            pin : "pin_altriServizi.png"
        }

    ];

    return itemsObj;

};