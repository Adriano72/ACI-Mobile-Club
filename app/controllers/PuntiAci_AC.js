var args = arguments[0] || {};

Ti.API.info("END SIDE COLLECTION LENGTH: "+JSON.stringify(Alloy.Collections.automobileClub));

var automobileClub = Alloy.Collections.automobileClub;
automobileClub.fetch();

function dataTransform(model){
	var attrs = model.toJSON();
	attrs.indirizzo2 = attrs.cap + " " + attrs.citta;
	return attrs	
};
