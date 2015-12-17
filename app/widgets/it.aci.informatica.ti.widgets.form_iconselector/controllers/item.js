/**
 * 
 */

var isSelected, value;

function toggle(){
	/*console.log('toggle');
	if(isSelected) $.deselect();
	else $.select(); */

}


$.select = function(){
	$.addClass($.icon_wrapper, 'selected');
	$.removeClass($.icon_wrapper, 'unselected');
	isSelected = true;
};


$.deselect = function(){
	$.addClass($.icon_wrapper, 'unselected');
	$.removeClass($.icon_wrapper, 'selected');
	isSelected = false;
};


Object.defineProperty($, 'isSelected', {
    get: function() {
        return isSelected;
    }
});

Object.defineProperty($, 'value', {
    get: function() {
        return value;
    }
});


(function(args){

	$.icon.image = args.icon;

	if(args.selected){
		_.defer($.select);
	}

	value = args.value;

	$.icon.addEventListener('click',function(){
		$.trigger('click');
	})

})(arguments[0] || 0);