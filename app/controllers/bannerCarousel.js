var args = arguments[0] || {};
var network = require('network');

var banners = [];
var timer;
var index;




function init() {
    showRandom();
    require('network').getBanner(function(p_data) {
        Alloy.Collections.banner.reset(p_data);
        banners = p_data;
        showRandom();
    });
}

$.start = function() {
    timer = setInterval(showRandom, Alloy.CFG.BannerRotationTime);
}

$.stop = function() {
    clearInterval(timer);
}

function showRandom() {
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