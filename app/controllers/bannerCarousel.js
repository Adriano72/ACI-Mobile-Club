var banners = [];
var index;




function openDetail() {

    var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: banners[index],
        headerImg: "",
        isBanner: true
    }).getView();
    Alloy.Globals.navMenu.openWindow(dettConvenzione);
}

/**
 * ## constructor
 */
(function constructor(args) {

    function onData(data) {
        Alloy.Collections.banner.reset(data);
        banners = data;

        var images = _(banners).map(function(e) {
            var img = e.agreement_id.images.banner;
            var url = Alloy.Globals.bannerBaseURL + img;

            return encodeURI(url);
        });


        if (images && images.length) {
            $.gallery.setImages(images);
        } else {
            $.gallery.getView().visible = false;
        }
    }

    require('network').getBanner(onData);

    $.gallery.getView().height = Alloy.Globals.deviceWidth * 0.285;
    $.gallery.getView().width = Alloy.Globals.deviceWidth;

    function updateIndex(e) {
        index = e.index;
    }

    $.gallery.addEventListener('imageChanged', updateIndex);
    $.gallery.addEventListener('click', function(e) {
        //$.gallery.removeEventListener('imageChanged',updateIndex);
        openDetail();
    });
})(arguments[0] || {});


//
// ## Public API
// 

/**
 * ### start
 * Aziona lo scorrimento automatico
 */
$.start = $.gallery.startSlider;

/**
 * ### stop
 * Blocca lo scorrimento automatico
 */
$.stop = $.gallery.stopSlider;