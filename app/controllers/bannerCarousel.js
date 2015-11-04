var banners = [];
var timer;
var index;


// $.gallery.getView().height = Alloy.Globals.deviceWidth * (600 / 1024);
//    $.gallery.getView().width = Alloy.Globals.deviceWidth;
//    $.gallery.setImages(modelGot.images);

function init() {
    showRandom();


    require('network').getBanner(function(p_data) {
        Alloy.Collections.banner.reset(p_data);
        banners = p_data;
        console.log('banners', banners);
        if (banners && banners.length) {
            showRandom();

        } else {
            $.bannerImage.visible = false;

        }
    });

    $.bannerImage.height = Alloy.Globals.deviceWidth * 0.285;

}

$.start = function() {
    timer = setInterval(showRandom, Alloy.CFG.BannerRotationTime);
}

$.stop = function() {
    clearInterval(timer);
}

function showRandom() {
    $.bannerImage.visible = true;
    new_index = Math.floor(Math.random() * banners.length);

    var banner = banners[new_index];
    console.log('new_index', new_index);
    if (new_index != index && banner) {
        index = new_index;
        // console.log('banner', banner);
        console.log('banners.length', banners.length);
        console.log('index', index);
        if (banner) {
            console.log('banner ', banner);
            console.log('banner.agreement_id ', banner.agreement_id);
            console.log('banner.agreement_id.images ', banner.agreement_id.images);

            var img = banner.agreement_id.images.banner;
            var url = Alloy.Globals.bannerBaseURL + img;
            console.log('img', url);

            $.bannerImage.image = encodeURI(url);
        }
    }
}

function openDetail() {

    var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: banners[new_index],
        headerImg: "",
        isBanner: true
    }).getView();
    Alloy.Globals.navMenu.openWindow(dettConvenzione);
}

_.defer(init);

/**
 * ## constructor
 */
(function constructor(args) {
    showRandom();

    function onData(data) {
        Alloy.Collections.banner.reset(p_data);
        banners = p_data;


        if (banners && banners.length) {
            showRandom();

        } else {
            $.gallery.getView().visible = false;

        }
    }

    require('network').getBanner(function(p_data) {

    });

    $.gallery.getView().height = Alloy.Globals.deviceWidth * 0.285;
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