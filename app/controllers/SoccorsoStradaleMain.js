 var commons = require('commons');
 var locationServices = require('locationServices');

 var AciGlobal = require('aciglobal');


 function open() {
     alert('ciao');
 }


 function selectionDetail(e) {
     console.log('selection', e);
     if (!_.isUndefined(e.row)) {

         Ti.API.info("CLICKED DATA: " + e.row.id_code);
         var win_controller;

         switch (e.row.id_code) {

             case "richiedi":
                 win_controller = "SoccorsoStradale_Richiesta";
                 break;
             case "chiama":
                 win_controller = "SoccorsoStradale_Chiama";
                 break;


             default:

         }

         if (win_controller) {
             var winAC = Alloy.createController(win_controller).getView();
             Alloy.Globals.navMenu.openWindow(winAC);
         }
     }
 };



 function fill() {
     var tot = Alloy.Globals.deviceHeight * 0.8;
     tot -= $.rowRichiesta.rect.height;
     tot -= $.dettaglioRichiesta.rect.height;
     tot -= $.rowChiama.rect.height;
     tot -= $.dettaglioChiama.rect.height;
     console.log('fill', $.main.rect.height, tot);
     $.filler.height = tot;
 }







 function callPhone() {
     Titanium.Platform.openURL('tel:' + AciGlobal.NumeroVerde);
 }

 function openSend(e) {
     var winAC = Alloy.createController('SoccorsoStradale_Richiesta').getView();
     Alloy.Globals.navMenu.openWindow(winAC);
 }


 (function constructor(args) {

     //inizializzazioni comuni della Window
     var headerText = "Assistenza";
     var headerImg = "/images/ic_action_home_assistenza_blu.png";
     commons.initWindow($.win, headerText, headerImg);




 })(arguments[0] || {});