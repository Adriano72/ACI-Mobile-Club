/**
 * Modulo di utility per la gestione delle tessere
 */


var TIPO_TESSERA = {
    SISTEMA: 'sistema',
    DRIVER: 'driver',
    CLUB: 'club',
    GOLD: 'gold',
    OKKEI: 'okkei',
    ONE: 'one',
    STORICO1: 'storico1',
    STORICO2: 'storico',
    VINTAGE: 'vintage',
};


var CODICI_TESSERA = {
    SISTEMA: ['FAM', 'DIP', 'SOC', 'SOG', 'SMA'],
    DRIVER: ['CON', 'DRV'],
    CLUB: ['CLN', 'CLG', 'CLO'],
    OKKEI: ['GIO', 'GIA'],
    ONE: ['UNO', 'UNG'],
    GOLD: ['GDI', 'GFA', 'GSO', 'GMA'],
    STORICO1: ['STA'],
    STORICO2: ['STF'],
    VINTAGE: ['VIN'],
};


function getTipo(code) {



    var tipo = _(CODICI_TESSERA).chain()
        .map(function(a, k) {
            var v = {
                nome: k,
                codici: a
            };
            console.log('map', v);
            return v;
        })
        .find(function(e) {
            return _(e.codici).indexOf(code) > -1;
        })
        .value();


    if (tipo && tipo.nome) {
        return TIPO_TESSERA[tipo.nome];
    }
    console.log('tipo undefined');
    return undefined;
}

/**
 * ritorna il set di immagini a disposizione per la tessera specificata dal codice
 * il set di immagini include:
 *  frontV -> frontale verticale
 *  frontH -> frontale orizzontale
 *  backV  -> retro verticale
 *  exporedV -> frontale verticale della tessera scaduta
 * @param  string code codice di tre lettere che identifica il tipo tessera
 * @return {[type]}      [description]
 */
exports.getImageSet = function(code) {

    var tipo = getTipo(code);
    console.log('TIPO TESSeRA', tipo, code);
    return {
        frontV: ['/', 'tessera_', tipo, '.jpg'].join(''),
        frontH: ['/', 'tessera_', tipo, '_h', '.jpg'].join(''),
        retroV: ['/', 'tessera_', tipo, '_retro', '.jpg'].join(''),
        expiredV: ['/', 'tessera_', tipo, '_scaduta', '.jpg'].join('')
    };

};



/**
 * elenco dei serivzi disponibili per la tessera
 * persona, casa, auto
 * @param  {[type]} code [description]
 * @return {[type]}        [description]
 */
exports.getTesseraAssitenza = function(code) {


    var a1 = 'auto';
    var a2 = 'persone';
    var a3 = 'casa';


    var tipo = getTipo(code);


    var servizi;
    switch (tipo) {

        case TIPO_TESSERA.SISTEMA:
            servizi = [a1, a2];
            break;

        case TIPO_TESSERA.DRIVER:
            servizi = [];
            break;
        case TIPO_TESSERA.ONE:
        case TIPO_TESSERA.OKKEI:
            servizi = [a1];
            break;

        case TIPO_TESSERA.CLUB:
        case TIPO_TESSERA.GOLD:
            servizi = [a1, a2, a3];
            break;

        case TIPO_TESSERA.STORICO1:
        case TIPO_TESSERA.STORICO2:
        case TIPO_TESSERA.VINTAGE:
            servizi = [a1, a2];
            break;

        default:
            servizi = [];
    }

    return servizi;

};