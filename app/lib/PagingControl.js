// I was unhappy about there was close to no control over the "pageControl" 
// in scrollableViews, so I hacked my own
// -----

// Configuration
var pageColor = Alloy.Globals.palette.nero;
var pageColorSelected = Alloy.Globals.palette.bianco;
var xxx = 0;
var PagingControl = function(scrollableView) {
    var container = Titanium.UI.createView({
        height: Ti.UI.SIZE,
        width: Ti.UI.SIZE
    });
    // Keep a global reference of the available pages
    var numberOfPages = scrollableView.getViews().length;

    var pages = []; // without this, the current page won't work on future references of the module

    // Go through each of the current pages available in the scrollableView
    for (var i = 0; i < numberOfPages; i++) {

        /*
		var page = Titanium.UI.createView({
			borderRadius: 4,
			width: 8,
			height: 8,
			left: 15 * i,
			backgroundColor: pageColor,
			opacity: 0.5
		});
*/
        var page = createNavPage(i, i==0 ? pageColorSelected : pageColor, pageColor, true, "circle");
        // Store a reference to this view
        pages.push(page);
        // Add it to the container
        container.add(page);
    }

    // Mark the initial selected page
   // pages[scrollableView.getCurrentPage()].setOpacity(1);

    // Callbacks
    onScroll = _.throttle(function(event) {

        // Bump the opacity of the new current page
      //  console.log('e ' + xxx++, event);

        if (event && !_.isNull(event.currentPage) && !_.isUndefined(event.currentPage)) {

            pages[event.currentPage].setBackgroundColor(pageColorSelected);
            // Go through each and reset it's opacity
            for (var i = 0; i < numberOfPages; i++) {
                i != event.currentPage && pages[i].setBackgroundColor(pageColor);
            }
        }

    }, 500);

    // Attach the scroll event to this scrollableView, so we know when to update things
    scrollableView.addEventListener("scroll", onScroll);

    return container;
};

function createNavPage(index, color, borderColor, showBorder, style) {
    return Ti.UI.createView({

        borderRadius: 4,
        width: 8,
        height: 8,
        left: 15 * index,
        opacity: 1,
        backgroundColor: color,

        borderWidth: 1,
        borderColor: showBorder ? borderColor : color,
        borderRadius: (style === "circle") ? 4 : 0
    });
}



module.exports = PagingControl;