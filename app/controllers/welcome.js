var args = arguments[0] || {};


function cancel() {
    $.win.close();
}


function login() {

    var w = Alloy.createController('loginWindow').getView();
    $.win.close();

    Alloy.Globals.navMenu.openWindow(w);
}