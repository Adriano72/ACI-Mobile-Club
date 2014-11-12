
exports.getPuntiAci = function(type_code, _callback){
	
	Ti.API.info("**GLOBAL POSITION: "+JSON.stringify(Alloy.Globals.userPosition));
	
	
	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {
		
		var json = JSON.parse(this.responseText);

		Ti.API.info("RISPOSTA: "+json.message);

		

		if (json.message == "200 OK") {
			
			_callback(json.result);
		
		} else {
			alert("Errore nella comunicazione col server.");
		};

	};

	xhr.onerror = function() {
		Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
	};
	
	//Ti.API.info("CHIAMATA HTTP: "+ Alloy.Globals.baseURL + '/api/aci/pos?query={"_type":"'+type_code+'", "status": "ok", "address.location": { "$near": ['+Alloy.Globals.userPosition.longitude+','+ Alloy.Globals.userPosition.latitude+'], "$maxDistance": 1 } }&limit=5');
	
	xhr.open('GET', Alloy.Globals.baseURL + '/api/aci/pos?query={"_type":"'+type_code+'", "status": "ok", "address.location": { "$near": ['+Alloy.Globals.userPosition.longitude+','+Alloy.Globals.userPosition.latitude+'], "$maxDistance": 1 } }&limit=15');

	xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

	xhr.send();
	
	
};

exports.getVantaggiSoci = function(type_code, _callback){
	
	Ti.API.info("**GLOBAL POSITION: "+JSON.stringify(Alloy.Globals.userPosition));
	
	
	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {
		
		var json = JSON.parse(this.responseText);

		Ti.API.info("RISPOSTA: "+json.message);

		

		if (json.message == "200 OK") {
			
			_callback(json.result);
		
		} else {
			alert("Errore nella comunicazione col server.");
		};

	};

	xhr.onerror = function() {
		Ti.API.error("ERRORE RISPOSTA SERVER: " + this.message);
	};
	
	//Ti.API.info("CHIAMATA HTTP: "+ Alloy.Globals.baseURL + '/api/aci/pos?query={"agreement_id.categories.short_name":"'+type_code+'", "status": "ok", "address.location": { "$near": ['+Alloy.Globals.userPosition.longitude+','+Alloy.Globals.userPosition.latitude+'], "$maxDistance": 1 } }&limit=15');
	
	xhr.open('GET', Alloy.Globals.baseURL + '/api/aci/syc?query={"agreement_id.categories.short_name":"'+type_code+'", "status": "ok", "address.location": { "$near": ['+Alloy.Globals.userPosition.longitude+','+Alloy.Globals.userPosition.latitude+'], "$maxDistance": 1 } }&limit=15');

	xhr.setRequestHeader('Authorization', 'Basic YWNpbW9iaWxlY2x1YjpJbml6aWFsZSQwMQ==');

	xhr.send();
	
	
};
