function toggle(select) {
    console.log('gallery pagingItem toggle', select);

    $.selectedView.visible = select;
    $.unselectedView.visible = !select;
}


var select = _(toggle).partial(true);
var unselect = _(toggle).partial(false);


/**
 * Constructor function
 * Autoexecuting function which encapsulates every initialization
 * @param  object args arguments passed to the controller
 */
(function constructor(args) {


    toggle(args.selected);

})(arguments[0] || {});



/*
    Public API
 */

exports.select = _(toggle).partial(true);
exports.unselect = _(toggle).partial(false);