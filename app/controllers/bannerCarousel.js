var args = arguments[0] || {};
var network = require('network');

var banners = Alloy.Collections.banner;
var timer;
var index;




function init() {
    showRandom();
    banners.fetchRandom(showRandom);
}

$.start = function() {
    timer = setInterval(showRandom, Alloy.CFG.BannerRotationTime);
}

$.stop = function() {
    clearInterval(timer);
}

function showRandom() {
    new_index = Math.floor(Math.random() * banners.length);

    var banner = banners.models[new_index];
    console.log('banners.models', banners.models);
    console.log('new_index', new_index);
    if (new_index != index && banner) {
        index = new_index;
        // console.log('banner', banner);
        console.log('banners.length', banners.length);
        console.log('index', index);
        if (banner && banner.toJSON) {
            banner = banner.toJSON();
            console.log('banner ', banner);
            console.log('banner.agreement_id ', banner.agreement_id);
            console.log('banner.agreement_id.images ', banner.agreement_id.images);

            var img = banner.agreement_id.images.banner;
            console.log('img', img);
            $.bannerImage.image = Alloy.Globals.bannerBaseURL + img;
        }
    }
}

function openDetail() {

    var dettConvenzione = Alloy.createController('VantaggiSoci_Dettaglio_Convenzione', {
        data: banners.models[new_index],
        headerImg: "",
        isBanner: true
    }).getView();
    Alloy.Globals.navMenu.openWindow(dettConvenzione);
}

_.defer(init);