var args = arguments[0] || {};

/**
 * id univoco della segnalazione
 */
var id_segnalazione = require('utility').uuid.v4();


/**
 * Proprietà di app
 * @type {Array}
 */
var app = ['accessibilityEnabled',
    'deployType',
    'disableNetworkActivityIndicator',
    'forceSplashAsSnapshot',
    'guid',
    'id',
    'idleTimerDisabled',
    'installId',
    'keyboardVisible',
    'name',
    'proximityDetection',
    'proximityState',
    'sessionId',
    'version'
];

/**
 * Proprietà di piattaforma
 * @type {Array}
 */
var platform = ['BATTERY_STATE_CHARGING',
    'BATTERY_STATE_FULL',
    'BATTERY_STATE_UNKNOWN ',
    'BATTERY_STATE_UNPLUGGED',
    'address',
    'architecture',
    'availableMemory',
    'batteryLevel',
    'batteryMonitoring',
    'batteryState',
    'displayCaps',
    'id',
    'locale',
    'macaddress',
    'manufacturer',
    'model',
    'name',
    'netmask',
    'osname',
    'ostype',
    'processorCount',
    'runtime',
    'username',
    'version'
];

var displayCaps = ['density',
    'dpi',
    'logicalDensityFactor',
    'platformHeight',
    'platformWidth',
    'xdpi',
    'ydpi'
];


function loadData() {
    var info = [];

    //sezione info generali
    info.push('### GENERALE');
    info.push('Segnalazione: ' + id_segnalazione);
    info.push('Date: ' + new Date());


    //sezione app
    info.push('### APP');
    _(app).each(function(e) {
        var v = Ti.App[e];

        info.push(e + ': ' + v);


    });


    //sezione piattaforma
    info.push('### DEVICE');
    _(platform).each(function(e) {
        var v = Ti.Platform[e];
        if (e == 'displayCaps') {
            var v1 = [];
            _(displayCaps).each(function(d) {

                v1.push('\n  ' + d + ': ' + v[d]);
            });
            v = v1.join('');
        }
        info.push(e + ': ' + v);


    });



    $.sysinfo.text = info.join('\n');


    //precarico il segnalatore
    $.name.value = Ti.App.Properties.getString('sysreport_name');

}


loadData();
//_(fit).defer();

function cancel() {
    $.win.close();
}

function send() {
    var segnalatore = $.name.value;


    if (!segnalatore) {
        alert('inserire il nome del segnalatore');
    } else {

        Ti.App.Properties.setString('sysreport_name', $.name.value);
        console.log('send 1');

        var emailDialog = Ti.UI.createEmailDialog();
        console.log('send 2');
        emailDialog.toRecipients = [Alloy.CFG.SysReport_Email];
        console.log('send 3');
        emailDialog.subject = 'Segnalazione ACI Mobile Club - ' + segnalatore;
        console.log('send 4');
        emailDialog.messageBody = ['Messaggio', $.message.value, 'Info di sistema', $.sysinfo.text].join('\n')
        console.log('send 5');
        var attachment = require('sysReportCommon').getLastScreenshot();
        console.log('send 6');
        if (attachment) {
            console.log('attachment', attachment);
            emailDialog.addAttachment(attachment);
        }
        console.log('send 7');
        emailDialog.open();

        /*  emailDialog.addEventListener('complete', function(e) {
            console.log('email send complete');
            $.win.close();
        }) */

    }


}


function fit() {
    var container = $.win;
    var toFit = $.contentWrapper;
    var h = 0;
    _(container.getChildren()).each(function(c) {
        if (c != toFit) {
            h += c.rect.height;
            //  h += c.rect.top || 0;
            //  h += c.rect.bottom || 0;
            console.log('fit', h);

        }
    });
    if (OS_ANDROID) {
        h += 30;
    }
    toFit.height = container.rect.height - h;

}