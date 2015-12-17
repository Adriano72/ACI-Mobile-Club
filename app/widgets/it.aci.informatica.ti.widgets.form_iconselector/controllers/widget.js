/**
 * 
 */


var items = [];


function fit(){
    var n = items.length;
    var margin = 2;
    var width = 100/n - margin*2 - 0.1;
        console.log('fit', width);
    _(items).each(function(e){
        var view = e.getView();
        view.setWidth(width + '%');
        view.setLeft(margin + '%');
        view.setRight(margin + '%');
    });
}


/**
 * Handle inner controls
 */
$.add = function(e){
	$.addItem(e.image, e.selected, e.value);
};

$.remove = $.content.remove;
$.applyProperties = $.content.applyProperties;

$.applyProperties = function(props) {
    $.wrapper.applyProperties(props);
};


$.addItem = function(icon, selected, value){
	var item = Widget.createController('item', {
		icon: icon,
		selected : !!selected,
        value: value
	});


	items.push(item);

	$.content.add(item.getView());

    _(fit).debounce(750)();

    item.on('click', _(select).partial(items.length -1));

};


$.focus = function() {
   // $.field.focus();
}

$.blur = function() {
   // $.field.blur();
}

Object.defineProperty($, 'value', {
    get: read,
    set: select
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
            $.content.borderColor = "transparent";
        } else {
            $.content.borderColor = "red";
        }
    }
});


function select(index){
	_(items).each(function(item, i){
		if(i==index){
			item.select();
		} else {
			item.deselect();
		}
	});
}

function read(){



	for (var i = items.length - 1; i >= 0; i--) {
		var item = items[i];
        console.log('item', item.isSelected, item.value);
		if(item.isSelected) return item.value;
	};
	return '';
}




/**
 * Constructor function
 * Autoexecuting function which encapsulates every initialization
 * @param  object args arguments passed to the controller
 */
(function constructor(args) {
    
    //if we use Inner Controls, we need to manually add children 
    _.each(args.children, function(child) {
        $.add(child);
    });

    _(args.items).each(function(e){
		$.addItem(e.image, e.selected, e.value);
    });

    $.applyProperties(args);
    
})(arguments[0] || {});