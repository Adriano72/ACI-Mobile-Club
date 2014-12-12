exports.getPuntiAci = function(type_code, _callback) {

	Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {

		var json = JSON.parse(this.responseText);

		Ti.API.info("RISPOSTA: " + json.message);

		if (json.message == "200 OK") {
			Ti.API.info("RISPOSTA: "+type_code+" " + JSON.stringify(json));
			_callback(json.result);

		} else {
			Alloy.Globals.loading.hide();
			alert("Errore nella comunicazione col server.");
		};

	};

	xhr.onerror = function() {
		Alloy.Globals.loading.hide();
		Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
	};

	Ti.API.info("CHIAMATA HTTP: "+ Alloy.Globals.baseURL + '/aci/pos?query={"_type":"' + type_code + '", "status": "ok", "address.location": { "$near": [' + Alloy.Globals.userPosition.longitude + ',' + Alloy.Globals.userPosition.latitude + '], "$maxDistance": 1 } }&limit=15');

	xhr.open('GET', Alloy.Globals.baseURL + '/aci/pos?query={"_type":"' + type_code + '", "status": "ok", "address.location": { "$near": [' + Alloy.Globals.userPosition.longitude + ',' + Alloy.Globals.userPosition.latitude + '], "$maxDistance": 0.2 } }&limit=100');

	xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

	xhr.send();

};

exports.getDemolitori = function(type_code, _callback) {

	Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {

		var json = JSON.parse(this.responseText);

		Ti.API.info("RISPOSTA: " + json.message);

		if (json.message == "200 OK") {

			_callback(json.result);

		} else {
			Alloy.Globals.loading.hide();
			alert("Errore nella comunicazione col server.");
		};

	};

	xhr.onerror = function() {
		Alloy.Globals.loading.hide();
		Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
	};

	Ti.API.info("CHIAMATA HTTP: "+ Alloy.Globals.baseURL + '/aci/dem?query={"_type":"' + type_code + '", "status": "ok", "address.location": { "$near": [' + Alloy.Globals.userPosition.longitude + ',' + Alloy.Globals.userPosition.latitude + '], "$maxDistance": 1 } }&limit=15');

	xhr.open('GET', Alloy.Globals.baseURL + '/aci/dem?query={"_type":"' + type_code + '", "status": "ok", "address.location": { "$near": [' + Alloy.Globals.userPosition.longitude + ',' + Alloy.Globals.userPosition.latitude + '], "$maxDistance": 0.2 } }&limit=100');

	xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

	xhr.send();

};

exports.getVantaggiSoci = function(type_code, _callback) {

	Ti.API.info("**TYPE CODE: " + type_code);

	var xhr = Ti.Network.createHTTPClient();
	
	xhr.clearCookies('http://www.aci.it');

	xhr.onload = function() {

		var json = JSON.parse(this.responseText);

		//Ti.API.info("RISPOSTA: "+type_code+" " + JSON.stringify(json));

		if (json.message == "200 OK") {
			
			//Ti.API.info("RISPOSTA: "+type_code+" " + JSON.stringify(json));

			_callback(json.result);

		} else {
			Alloy.Globals.loading.hide();
			alert("Errore nella comunicazione col server.");
		};

	};

	xhr.onerror = function() {
		Alloy.Globals.loading.hide();
		Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
	};

	Ti.API.info("CHIAMATA HTTP: "+ Alloy.Globals.baseURL + '/aci/syc?query={"agreement_id.categories.short_name":"'+type_code+'", "status": "ok", "address.location": { "$near": ['+Alloy.Globals.userPosition.longitude+','+Alloy.Globals.userPosition.latitude+'], "$maxDistance": 1 } }&limit=15');

	xhr.open('GET', Alloy.Globals.baseURL + '/aci/syc?query={"agreement_id.categories.short_name":"' + type_code + '", "status": "ok", "address.location": { "$near": [' + Alloy.Globals.userPosition.longitude + ',' + Alloy.Globals.userPosition.latitude + '], "$maxDistance": 0.2 } }&limit=100');

	xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

	xhr.send();

};

exports.getSSOID = function(p_username, p_password, _callback) {

	Ti.API.info("GET SSOID");

	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {

		var json = JSON.parse(this.responseText);

		Ti.API.info("RISPOSTA: " + json);

		if (json[0] == "success") {

			Ti.API.info("SUCCESS!");
			
			xhr.clearCookies('http://login.aci.it');

			_callback(json[1]);
			
			

		} else {
			Alloy.Globals.loading.hide();
			alert("LOGIN FALLITO - UTENTE NON AUTORIZZATO");
		};

	};

	xhr.onerror = function() {
		Alloy.Globals.loading.hide();
		Ti.API.error("LOGIN: ERRORE RISPOSTA SERVER: " + this.message);
	};

	//Ti.API.info("CHIAMATA HTTP: "+ Alloy.Globals.baseURL + '/api/aci/pos?query={"agreement_id.categories.short_name":"'+type_code+'", "status": "ok", "address.location": { "$near": ['+Alloy.Globals.userPosition.longitude+','+Alloy.Globals.userPosition.latitude+'], "$maxDistance": 1 } }&limit=15');

	xhr.open('GET', 'http://login.aci.it/index.php?do=login&application_key=mobile&id=login&username=' + p_username + '&password=' + p_password + '');

	xhr.send();

};

exports.getUserInfo = function(p_ssoid, _callback) {

	var xhr = Ti.Network.createHTTPClient();
	
	xhr.clearCookies('http://login.aci.it');
			

	xhr.onload = function() {

		var json = JSON.parse(this.responseText);

		Ti.API.info("RISPOSTA: " + JSON.stringify(json));

		if (json.result == "success") {
			_callback(json);
			//Ti.API.info("USER INFO: " + JSON.stringify(json.data));

		} else {
			Alloy.Globals.loading.hide();
			alert("LOGIN FALLITO - UTENTE NON AUTORIZZATO");
		};

	};

	xhr.onerror = function() {
		Alloy.Globals.loading.hide();
		Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
	};

	Ti.API.info("CHIAMATA HTTP: "+ 'https://login.aci.it/index.php?do=getCustomUserInfo&application_key=mobile&keypass=0my6o9t6&sso-id=' + p_ssoid + '');

	xhr.open('GET', 'http://login.aci.it/index.php?do=getCustomUserInfo&application_key=mobile&keypass=0my6o9t6&sso-id=' + p_ssoid + '');

	xhr.send();
};

exports.getBanner = function(_callback) {

	//Ti.API.info("**GLOBAL POSITION: " + JSON.stringify(Alloy.Globals.userPosition));

	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {

		var json = JSON.parse(this.responseText);

		Ti.API.info("RISPOSTA: " + json.message);

		if (json.message == "200 OK") {

			_callback(json.result);

		} else {
			Alloy.Globals.loading.hide();
			alert("Errore nella comunicazione col server.");
		};

	};

	xhr.onerror = function() {
		Alloy.Globals.loading.hide();
		Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
	};

	Ti.API.info("CHIAMATA HTTP: "+ 'http://www.aci.it/geo/v2/aci/syc?query={"address.location":{"$near":['+Alloy.Globals.userPosition.longitude+', '+Alloy.Globals.userPosition.latitude+'],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}&populate=1&limit=1&sort={"random":1}');

	xhr.open('GET', 'http://www.aci.it/geo/v2/aci/syc?query={"address.location":{"$near":['+Alloy.Globals.userPosition.longitude+', '+Alloy.Globals.userPosition.latitude+'],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}&populate=1&limit=1&sort={"random":1}');
	//'http://www.aci.it/geo/v2/aci/syc?query={"address.location":{"$near":['+Alloy.Globals.userPosition.longitude+', '+Alloy.Globals.userPosition.latitude+'],"$maxDistance":1},"agreement_id.images.banner":{"$gt":""},"status":"ok"}&populate=1&limit=1&sort={"random":1}'
	xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

	xhr.send();

};


