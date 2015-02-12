exports.openSideMenu = function(p_auth) {

    var sideMenu = Ti.UI.createView({
        width: "60%",
        top: 0,
        height: Ti.UI.SIZE,
        backgroundColor: "#EEEEEE",
        visible: false,
        layout: "vertical",
        left: Alloy.Globals.deviceWidthHalf
    });



    var separator = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: 1,
        backgroundColor: Alloy.Globals.palette.grigio_chiaro
    });



    var user = require('user');

    function createLabel(text, onclick) {
        var l = Ti.UI.createLabel({
            text: text,
            height: 40,
            width: Ti.UI.FILL,
            font: {
                fontFamily: 'PTSans-Regular',
                fontSize: '12dp'
            },
            top: 0,
            left: 5
        });
        if (onclick, _.isFunction(onclick)) {
            l.addEventListener('click', onclick)
        }

        return l;
    }

    function appendLabel(lb) {

        sideMenu.add(lb);
        sideMenu.add(separator);
    }


    var menuHeader = Ti.UI.createLabel({
        text: " IMPOSTAZIONI",
        font: {
            fontFamily: 'PTSans-Regular',
            fontSize: '10dp'
        },
        height: 40,
        width: Ti.UI.FILL,
        backgroundColor: "#295F95",
        color: '#fff'

    });


    var loginLabel = createLabel((user.isLogged == true) ? "Logout" : "Login", function() {
        if (user.isLogged) {
            user.onLogout();

            loginLabel.text = "Login";
            alert("UTENTE DISCONNESSO");

        } else {

            var winLogin = Alloy.createController('loginWindow').getView();
            Alloy.Globals.navMenu.openWindow(winLogin);
        }
    });


    function notImplemented() {
        alert('funzionalità non ancora implementata');
    }


    var searchLabel = createLabel('Cambia provincia', function() {
        var w = Alloy.createController('SelettoreProvincia_List').getView();
        Alloy.Globals.navMenu.openWindow(w);
    })
    var privacyLabel = createLabel('Informativa sulla privacy', notImplemented)
    var condizioniLabel = createLabel('Condizioni d\'uso', notImplemented)

    _.each([menuHeader, loginLabel, searchLabel, condizioniLabel, privacyLabel], appendLabel);

    /* searchLabel.addEventListener("click", function() {
        var win = Alloy.createController('Impostazioni_Posizione').getView();
        Alloy.Globals.navMenu.openWindow(win);
    }); */


    Ti.App.addEventListener("loggedInUser", function(e) {

        Ti.API.info("GLOBAL EVENT: " + JSON.stringify(e.loggedUser));

        if (e.loggedUser = true) {
            loginLabel.text = "Logout";
        } else {
            loginLabel.text = "Login";
        }

    });


    return sideMenu;
};

exports.toggleMenu = function(p_obj) {

    if (p_obj.visible == false) {
        p_obj.visible = true;
    } else {
        p_obj.visible = false;
    }

};

exports.hideMenu = function(p_obj) {

    p_obj.visible = false;

};