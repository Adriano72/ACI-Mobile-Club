var settingsMenu = function(){

	var sideMenu = Ti.UI.createView({
		width : "60%",
		height : "100%",
		backgroundColor : "#EEEEEE",
		visible : false,
		left : Alloy.Globals.deviceWidthHalf
	});

	

	this.toggleSideMenu = function() {

		if (sideMenu.visible == false) {
			sideMenu.visible = true;
		} else {
			sideMenu.visible = false;
		}

	};

};


function Person(firstName,lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
}

Person.prototype.fullName = function() {
    return this.firstName+' '+this.lastName;
};

module.exports = Person;