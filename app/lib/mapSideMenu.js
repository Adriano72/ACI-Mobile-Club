exports.openMapSideMenu = function(_callback) {

	var sideMenu = Ti.UI.createView({
		width : "60%",
		top : 0,
		height : Ti.UI.SIZE,
		backgroundColor : "#EEEEEE",
		visible : false,
		layout : "vertical",
		left : Alloy.Globals.deviceWidthHalf
	});


	var separator = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : 1,
		backgroundColor : Alloy.Globals.palette.grigio_chiaro
	});

	sideMenu.add(separator);

	var menuHeader = Ti.UI.createLabel({
		text : " MOSTRA IN MAPPA",
		font : {
			fontFamily : 'PTSans-Regular',
			fontSize : '10dp'
		},
		height : 40,
		width : Ti.UI.FILL,
		backgroundColor : "#295F95",
		color : '#fff'

	});
	sideMenu.add(menuHeader);

	sideMenu.add(separator);

	var loginLabel = Ti.UI.createLabel({
		text : "Test",
		height : 40,
		width : Ti.UI.FILL,
		font : {
			fontFamily : 'PTSans-Regular',
			fontSize : '12dp'
		},
		top : 0,
		left : 5
	});

	loginLabel.addEventListener("click", function() {
		
		Ti.API.info("*** MAP MENU CLICK ***");
		_callback();
		
	});

	sideMenu.add(loginLabel);
	sideMenu.add(separator);
	

	return sideMenu;
};

exports.toggleMenu = function(p_obj) {

	if (p_obj.visible == false) {
		p_obj.visible = true;
	} else {
		p_obj.visible = false;
	}

};

exports.hideMenu = function(p_obj) {

		p_obj.visible = false;

};

