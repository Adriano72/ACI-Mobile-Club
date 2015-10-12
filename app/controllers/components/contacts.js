var contacts;

$.applyProperties = function applyProperties(props) {
    $.list.applyProperties(props);
};

$.setContacts = function setContacts(value) {
    console.log('contacts ', value);

    contacts = value;
    console.log('contacts 1', contacts);


    if (contacts) {

        var c = _(['web', 'telefono', 'fax']).chain()
            .filter(function(x) {
                return !_.isEmpty(contacts[x] && contacts[x][0]);
            })
            .map(function(type) {
                var a = [];
                _(contacts[type]).each(function(target) {
                    a.push({
                        type: {
                            text: type
                        },
                        target: {
                            text: target,
                            href: (function formatHREF(type) {
                                if (type == 'web' && target.indexOf('http') < 0) return 'http://' + target;
                                else if (type == 'tel' || type == 'fax') return 'tel:' + target;
                                else return target;
                            })(type)
                        }
                    });
                });
                return a;
            })
            .reduce(function(memo, e) {
                console.log('reduce', memo, e);
                return memo.concat(e);
            }, [])
            .sortBy(function(e) {
                console.log('e', e);
                return e.type.text;
            })
            .value();


        console.log('contacts 2', c);
        _.defer(function() {
            $.ls.setItems(c);

        });

    }

    //$.list.visible = !!contacts.length;


};

$.getContacts = function getContacts() {
    return contacts;
};

Object.defineProperty($, 'contacts', {
    get: $.getContacts,
    set: $.setContacts
});

function openUrl(e) {
    console.log('openUrl', e);
    var source = OS_IOS ? e.source : e.section.items[e.itemIndex].target;
    if (e.bindId == 'target' && source.href) {
        Ti.Platform.openURL(source.href);
    }
}



(function constructor(args) {})(arguments[0] || {});