/**
 * INTERFACCIA PUBBLICA
 */

var inputController = $.field;
var wrapper = $.fieldWrapper;

$.focus = function() {
    $.field.focus();
}

$.blur = function() {
    $.field.blur();
}

Object.defineProperty($, 'value', {
    get: function() {
        console.log('field get value', $.field.value);
        return $.field.value;
    },
    set: function(v) {
        console.log('field set value', v);

        $.field.value = v;
    }
});

var isValid = true;
Object.defineProperty($, 'isValid', {
    get: function() {
        return isValid;
    },
    set: function(v) {
        isValid = v;
        //qui gestisco la visualizzazione del bordo rosso
        if (isValid) {
            //resetta il controller
            //
            $.fieldWrapper.borderColor = "transparent";
        } else {
            $.fieldWrapper.borderColor = "red";
        }
    }
});

/**
 * EVENTI
 */
//bridge degli eventi del textfield
_(['return', 'blur', 'focus']).each(function(name) {
    $.field.addEventListener(name, function(e) {
        $.trigger(name, e);
    });
});


$.applyProperties = function(props) {
    $.fieldWrapper.applyProperties(props);
};

(function constructor(args) {

    console.log('field', args);

    /**
     * INIZIALIZZAZIONI
     */

    $.field.hintText = args.hintText || args.fieldId;
    $.field.keyboardType = args.keyboardType || Ti.UI.KEYBOARD_DEFAULT;
    $.field.passwordMask = args.passwordMask || false;
    if (args.prefix) {
        $.fieldPrefix.text = args.prefix;
        var style = $.createStyle({
            classes: ['withPrefix'],
            apiName: 'TextField'
        });
        $.field.applyProperties(style);
    }
    $.fieldPrefix.visible = Boolean($.fieldPrefix.text);
    if (args.postfix) {
        $.fieldPostfix.text = args.postfix;
        var style = $.createStyle({
            classes: ['withPostfix'],
            apiName: 'TextField'
        });
        $.field.applyProperties(style);
    }
    $.fieldPostfix.visible = Boolean($.fieldPostfix.text);
    $.value = args.value;


    $.applyProperties(args);




})(arguments[0] || {});