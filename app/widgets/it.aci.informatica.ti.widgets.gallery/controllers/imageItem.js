var props = ['image', 'defaultImage', 'height', 'width'];



/**
 * Constructor function
 * Autoexecuting function which encapsulates every initialization
 * @param  object args arguments passed to the controller
 */
(function constructor(args) {

    //mirroring delle proprietà
    _(props).each(function(p) {
        if (args.hasOwnProperty(p)) {
            $.img[p] = args[p];
        }
    });

})(arguments[0] || {});