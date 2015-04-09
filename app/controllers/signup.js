var args = arguments[0] || {};
var utility = require('utility');
var commons = require('commons');




//inizializzazioni comuni della Window
commons.initWindow($.win, 'Registrazione', null, []);

var currentPage = 0;
var pageNumber = 3;

function render() {
    $.secondaryButton.visible = currentPage > 0;
    $.primaryButton.text = currentPage == 2 ? 'Fine' : 'Continua';

}

function primaryAction(e) {
    var next = currentPage + 1;
    if (next < pageNumber) {
        $.formWizard.scrollToView(next);
    }
}

function secondaryAction(e) {
    var next = currentPage - 1;

    if (next >= 0) {
        $.formWizard.scrollToView(next);
    }
}

function onScroll(e) {
    currentPage = e.currentPage;
    render();

}


render();