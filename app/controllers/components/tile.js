


$.applyProperties = function applyProperties(props) {
    console.log('applyProperties', props);
    $.wrapper.applyProperties(props);
};

function onClick(e) {
    $.trigger('click', e);
};


$.addEventListener = $.on;
$.removeEventListener = $.off;


(function(args) {

    //aggiungo il gestore di eventi


    function proxyProperty(ctrl, pList) {
        ctrl.applyProperties(_(args).pick(pList));
    }


    //eseguo il proxy delle seguenti proprietà sull'elemento $.wrapper
    proxyProperty($.wrapper, ['width', 'height', 'borderWidth', 'borderColor', 'top', 'left', 'bottom', 'right', 'backgroundColor', 'backgroundGradient', 'onClick']);

    //eseguo il proxy delle seguenti proprietà sull'elemento $.title
    proxyProperty($.title, ['font', 'color', 'text']);

    //eseguo il proxy delle seguenti proprietà sull'elemento $.icon
    _(['icon', 'iconHeight']).each(function(prop) {
        if (args.hasOwnProperty(prop)) {
            var realProp;
            if (prop == 'icon') {
                realProp = 'image';
            } else if (prop == 'iconHeight') {
                realProp = 'height';
            }
            $.icon[realProp] = args[prop];
        }
    });



})(arguments[0] || {});