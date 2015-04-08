var args = arguments[0] || {};

/**
 * id univoco della segnalazione
 */
var id_segnalazione = require('utility').uuid.v4();



function loadData() {



    var info = require('environment').snapshot();
    info['generale'] = {
        segnalazione: id_segnalazione,
        data: new Date()
    }


    $.sysinfo.text = formatInfo(info);


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


function formatInfo(i) {
    return JSON.stringify(i, null, '  ');
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