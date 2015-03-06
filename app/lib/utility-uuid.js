/**
 * Modulo di utility per la creazione di uuid
 */




/**
 * generate a random UUIDv4
 * http://www.javascriptoo.com/application/html/js/makeable/uuid-v4.js/uuid-v4.min.js
 * @return {String} random UUIDv4
 */
exports.v4 = function() {
    var a = [];
    for (var i = 0; i <= 15; i++) a[i] = i.toString(16);

    var b = "";
    for (var c = 1; c <= 36; c++) c === 9 || c === 14 || c === 19 || c === 24 ? b += "-" : c === 15 ? b += 4 : c === 20 ? b += a[Math.random() * 4 | 8] : b += a[Math.random() * 15 | 0];
    return b;

};