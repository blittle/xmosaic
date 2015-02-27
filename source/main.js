var $ = require('jquery');
var Quadrant = require('./Quadrant');
var config = require('./config');

window.objects = config.objectCache;

require('jquery-ui');
require('./main.css');

var moving = false;

$('body').mousedown(function(e) {

	if ($(e.target).closest('.screen,.hud').length) return;

	var anchorX = e.pageX;
	var anchorY = e.pageY;

	$('body').mousemove(function(e) {
			var p = $('.card-container').position();

			config.globalXOffset = p.left - (anchorX - e.pageX);
			config.globalYOffset = p.top - (anchorY - e.pageY);

			$('.card-container').css({
				left: config.globalXOffset,
				top: config.globalYOffset
			});

			anchorX = e.pageX;
			anchorY = e.pageY;
	});
});

var rerenderMosaic = _.throttle(function() {
	if (config.globalXOffset <= 0 || config.globalYOffset <= 0) bottomRight.renderView();
	if (config.globalXOffset >= 0 || config.globalYOffset <= 0) bottomLeft.renderView();
	if (config.globalXOffset >= 0 || config.globalYOffset >= 0) topLeft.renderView();
	if (config.globalXOffset <= 0 || config.globalYOffset >= 0) topRight.renderView();
}, 500);

$('body').mouseup(function(e) {
	rerenderMosaic();
	$('body').off('mousemove');
});

var bottomRight = new Quadrant(1, 1);
var topRight = new Quadrant(1, -1);
var topLeft = new Quadrant(-1, -1);
var bottomLeft = new Quadrant(-1, 1);

bottomRight.renderView();

$('body').on('dragstart', 'img', function(event) {
	event.preventDefault();
});

var hudDisplayed = false;

$('body').on('click', '.card', function(e) {
	var o = _.find(config.objectCache, {
		id: $(this).closest('.card').attr('id')
	});
	e.stopPropagation();
	$('body').off('mousemove');
	if (!o || !o.json || !o.json.description) return;
	if (!hudDisplayed) {
		var fullImageUrl = "http://apod.nasa.gov/apod/" + o.json.image.hiRes;
		var sourceUrl = "http://" + o.json.url;
		var imageTitle = o.json.title;
		$('body')
			.append('<div class="screen"></div>')
			.append('<div class="hud" style="background: transparent url(\'http://104.236.165.92:8080/' + o.json.localImages.fullPath +
				'\') no-repeat center; background-size: 100%; ">' +
				'<i class="fa fa-times-circle-o fa-3x"></i>' +
				"<div class='caption'><h1>" + o.json.title + "</h1>" +
				o.json.description +
				"</div>" +
				'<div class="actions">' +
				'<a href="https://twitter.com/home?status=' + encodeURI(sourceUrl) + '" onclick="javascript:window.open(this.href, \'_blank\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\'); return false;"><i class="fa fa-twitter fa-3x"></i></a>' +
				'<a href="https://pinterest.com/pin/create/button/?url=' + encodeURI(sourceUrl) + '&media=' + encodeURI(fullImageUrl) + '&description=' + encodeURI(imageTitle) + '" onclick="javascript:window.open(this.href, \'_blank\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\'); return false;"><i class="fa fa-pinterest fa-3x"></i></a>' +
				'<a href="https://plus.google.com/share?url=' + encodeURI(sourceUrl) + '" onclick="javascript:window.open(this.href, \'_blank\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\'); return false;"><i class="fa fa-google-plus fa-3x"></i></a>' +
				'<a href="http://www.facebook.com/sharer.php?u=' + encodeURI(sourceUrl)  + '&t=' + encodeURI(imageTitle) + '" onclick="javascript:window.open(this.href, \'_blank\', \'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600\'); return false;"><i class="fa fa-facebook fa-3x"></i></a>' +
				'<a download="' + imageTitle  + '" href="' + fullImageUrl + '"><i class="fa fa-download fa-3x"></i></a>' +
				'</div>' +
				'</div>');
		$('.hud,.screen').show('fade', {}, 200);
		$('.card-container').addClass('blur');
	}
	hudDisplayed = !hudDisplayed;
});

$('body').on('click', '.fa-times-circle-o,.screen', function() {
	$('.card-container').removeClass('blur');
	$('.hud,.screen').hide('fade', {}, 200, function() {
		$('.hud,.screen').remove();
	});
	hudDisplayed = false;
});

$('body').on('click', '.hud', function() {
	$('.hud').toggleClass('hide');
});
