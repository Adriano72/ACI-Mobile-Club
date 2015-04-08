/**
 * Funzionalità per utilizzare i system report di debug
 */

var GESTURE_DELAY = 30 * 1000;
var GESTURE_TIMES = 2;


//riferimento alla finestra di segnalazione
var win;
//ultimo screenshot caricato
var screenshot;
//conteggio delle gesture
var shakeCount = 0;
//timer delle gesture, serve per resettare il contatore dopo un po di tempo 
var to;


/**
 * rispristina il contatore delle gestures
 * @return {[type]} [description]
 */
function reset() {
    console.log('sysReport reset');
    shakeCount = 0;
};

/**
 * handler dell'evento shake
 * @type {[type]}
 */
function onShake(e) {
    console.log('shake', shakeCount);

    if (shakeCount == 0) {
        to = setTimeout(reset, GESTURE_DELAY);
    }

    if (shakeCount == GESTURE_TIMES - 1) {
        reset();
        clearTimeout(to);
        exports.open(true);
        Ti.Media.vibrate([0, 1000]);

    } else {
        Ti.Media.vibrate([0, 500]);
        shakeCount++;
    }


};

/**
 * hanlder della chiamata take screenshot
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function onScreen(e) {
    console.log('sysReport onScreen', e);
    screenshot = e.media;
}

exports.open = function(takeScreenshot) {
    //previene che venga generato l'evento shake una volta aperta la finestra
    exports.disableShake();
    reset();

    //se richiesto, acquisisce lo screenshot corrente
    if (takeScreenshot) {
        Ti.Media.takeScreenshot(onScreen);
    }

    win = Alloy.createController('sysReport').getView();

    //alla chiusura della finestra, devo resettare un po di cose
    win.addEventListener('close', function() {
        console.log('sysReport onclose');
        exports.enableShake()
        win = null;
        screenshot = null;
    });

    win.open();
};

exports.close = function() {
    win && win.close && win.close();
};



exports.enableShake = function() {
    console.log('enableShake');
    //double check
    if (Alloy.CFG.SysReport_UseShake) {
        Ti.Gesture.addEventListener('shake', onShake);
    }
};

exports.disableShake = function() {
    Ti.Gesture.removeEventListener('shake', onShake);
};

exports.getLastScreenshot = function() {
    return screenshot;
};