var args = arguments[0] || {};
var network = require('network');

var banners = [];
var timer;
var index;


banners = Alloy.Collections.banner.models;

network.getBanner(function(p_data) {
	Alloy.Collections.banner.reset(p_data);
    banners = p_data;
    showRandom();
    console.log("BANNER DATA: ", p_data);
});



$.start = function() {
    timer = setInterval(showRandom, Alloy.CFG.BannerRotationTime);
}

$.stop = function() {
    clearInterval(timer);
}

function showRandom() {
    new_index = Math.floor(Math.random() * banners.length);

    var banner = banners[new_index];
    if (new_index != index && banner) {
    	index = new_index;
        // console.log('banner', banner);
        console.log('banners.length', banners.length);
        console.log('index', index);
        if (banner) {
            var img = banner.agreement_id.images.banner;
            console.log('img', img);
            $.bannerImage.image = Alloy.Globals.bannerBaseURL + img;
        }
    }
}

function openDetail() {

    var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: banners[index],
        headerImg: "",
        isBanner: true
    }).getView();
    Alloy.Globals.navMenu.openWindow(dettConvenzione);
}