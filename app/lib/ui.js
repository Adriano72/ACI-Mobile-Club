/**
 * Elementi UI custom - estende gli elementi di Ti.UI
 */



exports.createLabel = function(params) {

    var lb = Ti.UI.createLabel(params);
    var loading;
    var orig;

    lb.startLoading = function() {
    	if(loading) return;
        var i = 0;
        var s = '...';
        orig = this.text;

        function step() {
            i = (++i % s.length);
            console.log('step', i);
            lb.setText(orig + s.substring(0, i + 1) + '   '.substring(0, s.length - i));
            console.log('lb.text', lb.text);
            loading = setTimeout(step, 500)
        }


        step();


    }

    lb.stopLoading = function() {
        clearTimeout(loading);
        lb.text = orig;
    }

    return lb;
};