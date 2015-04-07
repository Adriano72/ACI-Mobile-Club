var args = arguments[0] || {};


function loadData() {
    var info = ['Date: ' + new Date()];

    for (var property in Ti.Platform) {
        if (Ti.Platform.hasOwnProperty(property)) {
            info.push(property + ': ' + Ti.Platform[property]);
        }
    }

    $.sysinfo.value = info.join('\n');

}


loadData();


function cancel() {}

function send() {}