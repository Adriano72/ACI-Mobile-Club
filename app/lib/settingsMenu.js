exports.openSideMenu = function() {

	var sideMenu = Ti.UI.createView({
		width : "60%",
		top: 0,
		height : Ti.UI.SIZE,
		backgroundColor : "#EEEEEE",
		visible : false,
		layout : "vertical",
		left : Alloy.Globals.deviceWidthHalf
	});
	
	var separator = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : 1,
		backgroundColor : "#CCCCCC"
	});
	
	sideMenu.add(separator);

	var menuHeader = Ti.UI.createLabel({
		text : " IMPOSTAZIONI",
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
		text : "Login",
		height: 40,
		width: Ti.UI.FILL,
		font : {
			fontFamily : 'PTSans-Regular',
			fontSize : '12dp'
		},
		top : 0,
		left : 5
	});

	loginLabel.addEventListener("click", function() {
		var winLogin = Alloy.createController('loginWindow').getView();
		Alloy.Globals.navMenu.openWindow(winLogin);
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

