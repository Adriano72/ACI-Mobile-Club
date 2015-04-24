var args = arguments[0] || {};


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

/**
if (OS_IOS && ($.field.keyboardType == Ti.UI.KEYBOARD_PHONE_PAD || $.field.keyboardType == Ti.UI.KEYBOARD_NUMBER_PAD)) {
    numberpadWithReturnHack();
}
**/





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

/**

//hack per avere il return sul tastierino numerico
function numberpadWithReturnHack() {
    var done = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.DONE
    });

    done.addEventListener('click', function(e) {
        this.activeFld.blur();
        this.activeFld.trigger('return');
    });

    var flexSpace = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });

    $.field.keyboardToolbar = [flexSpace, done];
    $.field.keyboardToolbarColor = '#333';
    $.field.keyboardToolbarHeight = 40;
   
    $.field.addEventListener('focus', function(e) {
        $.field.keyboardToolbar = [flexSpace, done];
        done.activeFld = $.field;
    });
 

}

*/