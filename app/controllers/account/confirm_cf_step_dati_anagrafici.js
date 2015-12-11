function optionsDataNascita() {

}


$.setData = function(data) {
    $.nomeValue.text = data.nome;
    $.cognomeValue.text = data.cognome;
    $.datanascitaValue.text = data.datanascita;
    $.luogoValue.text = data.luogo;
    $.sessoValue.text = data.sesso;
};


$.getData = function() {
    return {
        nome: $.nomeValue.text,
        cognome: $.cognomeValue.text,
        datanascita: $.datanascitaValue.text,
        luogo: $.luogoValue.text,
        sesso: $.sessoValue.text
    };
};


/**
 * ### constructor
 * @param  {[type]} args [description]
 * @return {[type]}      [description]
 */
(function(args) {

})(arguments[0] || {});