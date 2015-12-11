/**
 * @author Antonio Polifemi
 */

var obj = arguments[0];

$.poiTitle.text = obj.name;
$.poiAddress.text = obj.address.formatted;
Ti.API.info('telefono: ' + obj.contacts.tel.length);
Ti.API.info('fax: ' + obj.contacts.fax.length);
if (obj.contacts.tel.length > 0 || obj.contacts.fax.length > 0) {
	if (obj.contacts.tel.length > 0 && obj.contacts.tel[0] != null )
		$.telephone.text = obj.contacts.tel[0];
	else
		$.telephoneView.hide();
	if (obj.contacts.fax.length > 0 && obj.contacts.fax[0] != null)
		$.fax.text = obj.contacts.fax[0];
	else
		$.faxView.hide();
} else {
	$.contattiView.hide();
}
Ti.API.info('email: ' + obj.contacts.email.length);
if (obj.contacts.email.length > 0 && obj.contacts.email[0] != null)
	$.email.text = obj.contacts.email[0];
else
	$.emailView.hide();
