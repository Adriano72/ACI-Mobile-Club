var args = arguments[0] || {};
Ti.API.info("ROW DATA: "+JSON.stringify(args));
$.leftIcon.image = "/"+args.immagine;
$.rowText.text = args.testo;