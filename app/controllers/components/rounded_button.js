//
// ## PUBLIC API
//


$.applyProperties = function applyProperties(props) {
    console.log('applyProperties', props);
    $.wrapper.applyProperties(props);
};

/*
$.addEventListener = $.on;
$.removeEventListener = $.off;
*/
// ### onClick
// Semplice proxy che gestice il click sull'elemento wrapper e lo espone come evento pubblico
var onClick = function(e) {
    $.trigger('click', e);
};


/**
 * ### constructor
 * @param {object} args parametri di costruzione del controller
 */
(function constructor(args) {

    //se il bordo non è specificato, assumo che sia lo stesso colore del testo
    args.borderColor = args.borderColor || args.color;


    //eseguo il proxy delle seguenti proprietà sull'elemento $.wrapper
    _(['width', 'height', 'borderWidth', 'borderColor', 'top', 'left', 'bottom', 'right', 'backgroundColor']).each(function(prop) {
      //  console.log(prop, args);
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