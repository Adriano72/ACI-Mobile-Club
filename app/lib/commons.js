/**
 * Questo modulo raccoglie tutte le funzionalità di inizializzazione della UI che si possono condividere tra differenti controller
 *
 */


/**
 * Esegue le inizializzazioni comuni a tutte le Window, specialmente la parte della barra di intestazione
 * Da eseguire all'inzio del controller della Window
 * @param  {Ti.UI.Window} win       Window da inizializzare
 * @param  {String} title     titolo da assegnare alla window
 * @param  {String} icon      icona della Window
 * @param  {Array} menuItems  Array di oggetti che descrivono i menuItem da aggiungere. Gli elementi sono tuple contenenti
 *                            {
 *                            	title: eventuale testo dell'etichetta dell'elemento
 *                            	icon: icona dell'elemento
 *                            	onClick: handler dell'evento click
 *                            }
 *                            Su iOS si prende in considerazione solo il primo elemento (come RightNavButton)
 */
exports.initWindow = function(win, title, icon, menuItems) {

    //valori comuni
    // li mettiamo in Alloy.Globals?
    var font = "ACI Type Regular";
    var color = Alloy.Globals.palette.blu;

    /**
     * Subroutine che crea un elemento del menu
     * se Android crea un MenuItem
     * se iOS crea una ImageView
     * @param  {Object} item  hashset con le opzioni dell'elemento
     * @return {Ti.Android.MenuItem|Ti.UI.ImageView}      elemento del menu, a seconda della piattaforma
     */
    function createMenuItem(params) {
        var menuItem;
        if (OS_ANDROID) {
            menuItem = {
                title: params.title,
                showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS,
                icon: params.icon
            };
        } else {
            menuItem = Ti.UI.createImageView({
                image: params.icon
            });


            menuItem.addEventListener("click", params.onClick);
        }

        return menuItem;
    }


    //se android, utilizzo le estensioni della actionbar
    if (OS_ANDROID) {
        var abx = require('com.alcoapps.actionbarextras');
        abx.window = win;
    };


    win.addEventListener('open', function(e) {

        if (OS_ANDROID) {

            //imposto il titolo, il colore e il font 
            abx.displayHomeAsUp = true;
            abx.title = {
                text: title,
                font: font + '.otf',
                color: color
            }

            //l'inizializzazione dell'activity devo posiciparla, per dargli il tempo di inizializzarsi
            _(function initActivity() {
                var activity = win.activity;
                if (activity) {

                    //imposto l'icona della ActionBar
                    activity.actionBar.setIcon(icon);

                    //ora creo gli elementi del menu
                    activity.invalidateOptionsMenu();
                    activity.onCreateOptionsMenu = function(e) {
                        console.log('onCreateOptionsMenu ', e);

                        _(menuItems).each(function(i) {
                            e.menu.add(createMenuItem(i)).addEventListener("click", i.onClick);
                        });

                    };

                }
            }).defer();


        } else {

            //carica il controllo del titolo
            // questa è una view senza controller
            // http://docs.appcelerator.com/titanium/3.0/#!/guide/Views_without_Controllers
            var titleControl = Alloy.createController('titleControl');
            titleControl.updateViews({

                "#icon": {
                    image: icon
                },
                "#text": {
                    font: {
                        fontFamily: font
                    },
                    color: color,
                    text: title
                }
            });


            /*titleControl = Ti.UI.createLabel({
                text: 'titolo'
            }); */

            /*   var v = Ti.UI.createView({
                height: 30,
                backgroundColor: "red"
            });

            v.add(titleControl.getView()); */

            var v = titleControl.getView();
            v.width = Ti.UI.SIZE;
            console.log('titleC', v);

            win.setTitleControl(v);



            //aggiunge il rightnavbutton
            var item = menuItems[0];
            var rightNavButton = createMenuItem(item);
            win.setRightNavButton(rightNavButton);
        }

    });

};


/**
 * Apre il navigatore della piattaforma
 * Funziona in due modalità: passando (lat,lon) oppure come handler del click su un elemento
 *  in questo caso si aspetta un elemento e.source contenetente lat e lon
 * @param  {} e [description]
 * @return {[type]}   [description]
 */
exports.openNavigation = function(e) {
    if (e.source) {
        e.cancelBubble = true;

        e = e.source;
    }
    var lat = e.lat;
    var lon = e.lon;

    //Alloy.Globals.loading.show('stiamo calcolando la posizione');
    require('locationServices').getUserLocation(function(userLoc) {
        //Alloy.Globals.loading.hide();

        var mapsServiceURL = (OS_ANDROID) ? 'http://maps.google.com/maps?t=m&saddr=' : 'http://maps.apple.com/maps?t=m&saddr=';
        console.log("NAVIGATION DATA", lat, lon, userLoc.latitude, userLoc.longitude);

        Ti.Platform.openURL(mapsServiceURL + userLoc.latitude + ',' + userLoc.longitude + '&daddr=' + lat + ',' + lon);
    });

};


/**
 * Apre la finestra della mappa
 * @param  {Vackbone.Collection|Array} collection la collezione backbone di riferimento, oppure un array di poi
 * @param  {String} title      titolo della window
 * @param  {String} icon       icona della window
 * @param  {String} pin        (opzionale) immagine del pin delle annotations. se non specificato, la mappa prova a determinare il giusto pin in base ai dati del poi
 */
exports.openMapWindow = function(collection, title, icon, pin) {
    var mapWin = Alloy.createController('mapView', {
        collection: _.isFunction(collection.toJSON) ? collection.toJSON() : collection,
        titolo: title,
        homeIcon: icon,
        pin: pin

    }).getView();
    Alloy.Globals.navMenu.openWindow(mapWin);
}