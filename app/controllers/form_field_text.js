var args = arguments[0] || {};


/**
 * INIZIALIZZAZIONI
 */

$.field.hintText = args.hintText || args.fieldId;
$.field.keyboardType = args.keyboardType || Ti.UI.KEYBOARD_DEFAULT;
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
$.fieldPostfix.visible = Boolean($.fieldPrefix.text);




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
        return $.field.value;
    },
    set: function(v) {
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
            $.fieldWrapper.color = "transparent";
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
