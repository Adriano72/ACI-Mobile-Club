exports.formattaOrari = function(obj) {
	
	Ti.API.info("CIAO");

	var orari = [];

	var dayArray = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

	_.each(dayArray, function(day) {
		Ti.API.info("DAY: " + JSON.stringify(day));
		var daySchedule = _.find(obj, function(value, key) {
			return key == day;
		});
		//Ti.API.info("DAY SCHEDULE: " + JSON.stringify(obj));

		if (!_.isUndefined(daySchedule[0])) {
			/*
			 Ti.API.info("DAY SCHEDULE: " + JSON.stringify(daySchedule));
			 Ti.API.info("DAY SCHEDULE FROM: " + daySchedule[0].from);
			 Ti.API.info("DAY SCHEDULE TO: " + daySchedule[0].to);
			 */

			switch(day) {

			case "mon":
				orari.push("Lunedì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
				break;
			case "tue":
				orari.push("Martedì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
				break;
			case "wed":
				orari.push("Mercoledì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
				break;
			case "thu":
				orari.push("Giovedì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
				break;
			case "fri":
				orari.push("Venerdì: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
				break;
			case "sat":
				orari.push("Sabato: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
				break;
			case "sun":
				orari.push("Domenica: dalle " + daySchedule[0].from + " alle: " + daySchedule[0].to + "\n");
				break;
			default:

			};

		};

	});

	//Ti.API.info("ORARI: " + orari.toString());
	return orari.join("");

};
