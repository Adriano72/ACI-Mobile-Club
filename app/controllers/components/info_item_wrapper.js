
$.add = function(e){
	$.contentWrapper.add(e);
};


(function(args){

	$.itemWrapper.applyProperties(args);

	$.itemWrapper.addEventListener('click',function(e){
		$.trigger('click', e);
	})

})(arguments[0] || {});