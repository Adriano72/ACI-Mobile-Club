var value = false;

function render() {

    $.checkbox.value = value;

    if (value) {
        $.checkbox.title = '\u2713';
        //	    $.checkbox.backgroundColor = '#aaa';
    } else {
        $.checkbox.title = '';
        //	    $.checkbox.backgroundColor = '#000';
    }
}

function setValue(val) {
    value = !!val;
    console.log('checkbox set value', val, value);
    render();
}


function getValue() {
    console.log('checkbox getValue', value);
    return value;
}


function clickCheckbox(e) {
    setValue(!value);
    $.checkbox.fireEvent('change', {
        value: value
    });
}



//
// ## PUBLIC API
//

Object.defineProperty(exports, "value", {
    get: getValue,
    set: setValue
});

(function constructor(args) {

    // init from text attribute value
    setValue(args.value == 'true');


})(arguments[0] || {});