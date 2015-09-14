
/**
 * Funzioni locali
 */


/**
 * Callback da chiamare quando ri riceve una push notification
 * @param  {[type]} e [description]
 */
function onNotification(e){}


/**
 * Metodo cross-platorm per abilitare il device a ricevere push notification
 * @return {[type]} [description]
 */
function retrieveDeviceToken(){

	function onSuccess(e){

	}

	function onError(e){

	}

	if(OS_IOS){

		Ti.Network.registerForPushNotifications({
			success: onSuccess,
			error: onError,
			callback: onNotification
		});

	} else if(OS_ANDROID) {

	} else {
		//non supportiamo altre piattaforme al momento
		onError('piattaforma non supportata');
	}

}


/**
 * Public API
 */




exports.retrieveDeviceToken = function(){}