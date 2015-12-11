(function(args) {


    function proxyProperty(ctrl, pList) {
        ctrl.applyProperties(_(args).pick(pList));
    }


    //eseguo il proxy delle seguenti proprietà sull'elemento $.title
    //idealmente, posso cambiare solo il testo
    proxyProperty($.title, ['font', 'color', 'text', 'width', 'height', 'borderWidth', 'borderColor', 'top', 'left', 'bottom', 'right', 'backgroundColor', 'backgroundGradient', 'onClick']);




})(arguments[0] || {});