/**
 * Modulo per la gestione delle push notification
 * generalizza il comportamento tra le piattaforme e tiene traccia dei token
 */

var deviceToken;

var Cloud = require("ti.cloud");

/**
 * Callback da chiamare quando ri riceve una push notification
 * @param  {[type]} e [description]
 */
function onNotification(e) {
    console.log('retrieveDeviceToken, onNotification', e);

    if (OS_IOS) {
        var badge = Math.max(0, Titanium.UI.iPhone.getAppBadge() - 1);
        Titanium.UI.iPhone.setAppBadge(badge);

        Cloud.PushNotifications.setBadge({
            device_token: deviceToken,
            badge_number: badge
        }, function(r, p) {
            console.log('setBadge', r, p);
        });
    }
}


/**
 * Metodo cross-platorm per abilitare il device a ricevere push notification
 * @return {[type]} [description]
 */
function retrieveDeviceToken(cb) {

    var types = OS_IOS ? [
        Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
        Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
        Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
    ] : undefined;


    function onSuccess(e) {
        console.log('retrieveDeviceToken, success', e);
        deviceToken = e.deviceToken;
        cb && cb(null, e);
    }

    function onError(e) {
        console.log('retrieveDeviceToken, error', e);
        cb && cb(e);

    }

    function requestToken() {
        console.log('requestToken');
        if (OS_IOS) {

            Ti.Network.registerForPushNotifications({
                success: onSuccess,
                error: onError,
                types: types,
                callback: onNotification
            });

        } else if (OS_ANDROID) {

            var cp = require('ti.cloudpush');

            cp.retrieveDeviceToken({
                success: onSuccess,
                error: onError
            });

            cp.addEventListener('callback', onNotification);

        } else {
            //non supportiamo altre piattaforme al momento
            onError('piattaforma non supportata');
        }
    }


    if (OS_IOS && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
        // Wait for user settings to be registered before registering for push notifications
        Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
            console.log('requestToken usernotificationsettings');

            // Remove event listener once registered for push notifications
            Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);

            requestToken();
        });

        console.log('requestToken registerUserNotificationSettings');

        // Register notification types to use
        Ti.App.iOS.registerUserNotificationSettings({
            types: types
        });
    } else {
        requestToken();
    }


}




function subscribeToChannel(channel) {
    // Subscribes the device to the 'news_alerts' channel
    // Specify the push type as either 'android' for Android or 'ios' for iOS
    Cloud.PushNotifications.subscribeToken({
        device_token: deviceToken,
        channel: channel,
        type: Ti.Platform.name == 'android' ? 'android' : 'ios'
    }, function(e) {
        if (e.success) {
            alert('Subscribed');
        } else {
            alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

function unsubscribeToChannel(channel) {
    // Unsubscribes the device from the 'test' channel
    Cloud.PushNotifications.unsubscribeToken({
        device_token: deviceToken,
        channel: channel,
    }, function(e) {
        if (e.success) {
            alert('Unsubscribed');
        } else {
            alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}


/**
 * Public API
 */

/**
 * Metodo cross-platorm per abilitare il device a ricevere push notification
 */
exports.retrieveDeviceToken = retrieveDeviceToken;
exports.subscribeToChannel = subscribeToChannel;
exports.unsubscribeToChannel = unsubscribeToChannel;