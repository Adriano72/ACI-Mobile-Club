    /**
     * Modulo che contiene i metodi di accesso alle impostazioni dell'utente
     */



    /**
     * Property
     * Ci dice se usare la posizione dell'utente, o la provincia, come riferimento nelle liste
     * @return {Boolean}
     */
    Object.defineProperty(exports, 'ricercaPerProssimita', {
        get: function() {
            var v = Ti.App.Properties.getBool("settings:ricercaPerProssimita");

            if (!v) {
                //se la provincia è vuota, allora forzo i settings
                var p = exports.provinciaDiRiferimento;
                console.log("provincia", p);
                if (!p || _.isEmpty(p)) {
                    v = true;
                }
            }

            console.log("get settings:ricercaPerProssimita", v);
            return v;
        },
        set: function(v) {
            console.log("set settings:ricercaPerProssimita", v);

            Ti.App.Properties.setBool("settings:ricercaPerProssimita", v);
        }
    });

    /**
     * Property
     * Ci dice se usare la posizione dell'utente, o la provincia, come riferimento nelle liste
     * ATTENZIONE: QUESTA PROPERTY E' UN WRAPPER DI ricercaPerProssimita, serve a facilitare la lettura
     * @return {Boolean}
     */
   /* Object.defineProperty(exports, 'ricercaPerProvincia', {
        get: function() {
            return !exports.ricercaPerProssimita;
        },
        set: function(v) {
            exports.ricercaPerProssimita = !v;
        }
    }); */


    /**
     * Property
     * Ci dice se usare la posizione dell'utente, o la provincia, come riferimento nelle liste
     * ATTENZIONE: QUESTA PROPERTY E' UN WRAPPER DI ricercaPerProssimita, serve a facilitare la lettura
     * @return {Boolean}
     */
    Object.defineProperty(exports, 'provinciaDiRiferimento', {
        get: function() {
            return Ti.App.Properties.getObject("settings:provinciaDiRiferimento");
        },
        set: function(v) {
            Ti.App.Properties.setObject("settings:provinciaDiRiferimento", v);
        }
    });