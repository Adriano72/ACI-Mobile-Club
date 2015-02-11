/*
 params = {
 	index: 0,
 	labels: [ 'one', 'two', 'three' ],
 	styles: {}
 }
 * */



exports.init = function(params) {
    if (params.styles) {
        $.tabbedBar.applyProperties(params.styles);
        delete params.styles;
    }

    if (OS_IOS) {
        $.tabbedBar.applyProperties(params);
    } else {

        $.tabbedBar.removeAllChildren();

        var labels = params.labels,
            index = params.index;

        for (var i = 0, ii = labels.length; i < ii; i++) {
            var classes = 'tabbed-bar-button';
            (i === index) && (classes += ' tabbed-bar-button-active');

            var style = $.createStyle({
                classes: classes,
                apiName: 'Button'
            });

            var button = Ti.UI.createButton({
                buttonIndex: i,
                title: '  ' + labels[i] + '  '
            });


            button.applyProperties(style);

            _.each(classes.split(' '), function(c) {

                $.addClass(button, c);
            });



            $.tabbedBar.add(button);
        };

        $.tabbedBar.lastIndex = index;

    }
};


function onChange(i) {
    fireEvent('click', {
        index: i
    });
}



var tabbedBarClicked;

if (OS_IOS) {
    tabbedBarClicked = function(e) {
        console.log("tabbedBarClicked", e);
        onChange(e.index.index);

    }
} else if (OS_ANDROID) {
    tabbedBarClicked = function(e) {
        var button = e.source,
            index = button.buttonIndex,
            lastIndex = $.tabbedBar.lastIndex;
        //   console.log("tabbedBarClicked e", e);
        //   console.log("tabbedBarClicked ", index, lastIndex);
        if (index != null && index != lastIndex) {
            $.addClass(button, 'tabbed-bar-button-active');
            var prev = $.tabbedBar.children[lastIndex];
            //       console.log("prev", prev);
            $.removeClass(prev, 'tabbed-bar-button-active');
            $.tabbedBar.lastIndex = index;
            onChange(index);
        }

    }
}


exports.getIndex = function() {
    return OS_IOS ? $.tabbedBar.index : $.tabbedBar.lastIndex;
};

/*
Object.defineProperty(exports, 'index', {
    get: function() {
        if (OS_IOS) {
            return $.tabbedBar.index;
        } else {
            return $.tabbedBar.lastIndex;
        }
    },
    set: function(v) {
        console.log("set settings:ricercaPerProssimita", v);

        Ti.App.Properties.setBool("settings:ricercaPerProssimita", v);
    }
});
*/





/**
 * GESTIONE CUSTOM DEGLI EVENTI PER IL WIDGET
 */


/**
 * Scaffold degli eventi
 * @type {Object}
 */
var eventHandlers = {};

/**
 * Bridge per gli eventi interni al widget
 * http://www.slideshare.net/MartinHudson1/ticonfeu
 * @param {string} eventName    evento da collegaro
 * @param {Function} eventHandler handler dell'evento
 */
exports.addEventListener = function(eventName, eventHandler) {
    eventHandlers[eventName] = eventHandler;
};

/**
 * Custom fire event function
 * @param  {[type]} name    [description]
 * @param  {[type]} context [description]
 * @param  {[type]} params  [description]
 * @return {[type]}         [description]
 */
function fireEvent(name, params) {
    var c = this;
    var h = eventHandlers[name];
    console.log('call: ' + name);
    if (h) return h.call(this, params);
    return h;
}