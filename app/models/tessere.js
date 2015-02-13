exports.definition = {
    config: {
        columns: {
            "name": "text",
            "slogan": "text",
            "abstract": "text",
            "price": "float",
            "code": "text"
        },
        adapter: {
            type: "sql",
            collection_name: "tessere"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {
            // extended functions and properties go here

            /**
             * ritorna l'immagine corretta per la tessera
             * @return {string} path/url dell'immagine
             */
            getImage: function() {
                var utility = require('utility');
                var t = utility.getTesseraImage(this.get('code'), true);
                console.log('getImage', t);
                return t;
            },

            /**
             * ottiene la url del sito da chiamare per comprare la tessera
             * @return {string} url del sito aci
             */
            getBuyUrl: function() {
                return "http://www.aci.it/index.php?id=5311&rich=a&codiceProdotto=I" + this.get('code');
            },


            /**
             * ottiene la url del sito per visualizzare i dettagli della tessera
             * @return {string} url del sito aci
             */
            getDetailUrl: function() {
                var strip = this.get('name').replace(' ', '-').toLowerCase();
                return "http://www.aci.it/il-club/il-club-e-i-suoi-vantaggi/le-tessere-aci/" + strip + ".html"
            }
        });

        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            // extended functions and properties go here
        });

        return Collection;
    }
};