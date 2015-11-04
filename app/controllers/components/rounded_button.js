var tiACI = require('ti.aci');
var eventManager = tiACI.EventManager.createEventManager();


$.applyProperties = function applyProperties(props) {
    console.log('applyProperties', props);
    $.wrapper.applyProperties(props);
};

function onClick(e) {
    $.fireEvent('click', e);
};



(function(args) {

    //aggiungo il gestore di eventi
    tiACI.EventManager.extendObjectWithEventManager($, eventManager);

    args.borderColor = args.borderColor || args.color;


    //eseguo il proxy delle seguenti proprietà sull'elemento $.wrapper
    _(['width', 'height', 'borderWidth', 'borderColor', 'top', 'left', 'bottom', 'right', 'backgroundColor']).each(function(prop) {
        console.log(prop, args);
        if (args.hasOwnProperty(prop)) {
            $.wrapper[prop] = args[prop];
        }
    });


    //assegno i valori
    $.icon.image = args.icon;
    $.primaryText.text = args.primaryText;
    $.secondaryText.text = args.secondaryText;
    if (args.hasOwnProperty('color')) {
        $.primaryText.color = args.color;
        $.secondaryText.color = args.color;
    }

})(arguments[0] || {});