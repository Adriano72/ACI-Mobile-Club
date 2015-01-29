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


    Ti.App.addEventListener("loggedInUser", function(e) {

        Ti.API.info("GLOBAL EVENT: " + JSON.stringify(e.loggedUser));

        if (e.loggedUser = true) {
            loginLabel.text = "Logout";
        } else {
            loginLabel.text = "Login";
        }

    });

    var separator = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: 1,
        backgroundColor: "#CCCCCC"
    });

    sideMenu.add(separator);

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
    sideMenu.add(menuHeader);

    sideMenu.add(separator);

    var loginLabel = Ti.UI.createLabel({
        text: (p_auth) ? "Logout" : "Login",
        height: 40,
        width: Ti.UI.FILL,
        font: {
            fontFamily: 'PTSans-Regular',
            fontSize: '12dp'
        },
        top: 0,
        left: 5
    });

    var user = require('user');


    loginLabel.addEventListener("click", function() {



        //if (Ti.App.Properties.getBool("utenteAutenticato")) {
        if (user.isLogged) {

            //Ti.App.Properties.setBool("utenteAutenticato", false);
            //Ti.App.Properties.setObject("datiUtente", {});
            user.onLogout();

            loginLabel.text = "Login";
            alert("UTENTE DISCONNESSO");

        } else {

            var winLogin = Alloy.createController('loginWindow').getView();
            Alloy.Globals.navMenu.openWindow(winLogin);
        }
    });

    sideMenu.add(loginLabel);
    sideMenu.add(separator);

    //loginLabel.text = (Ti.App.Properties.getBool("utenteAutenticato") == true) ? "Logout" : "Login";
    loginLabel.text = (user.isLogged == true) ? "Logout" : "Login";

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