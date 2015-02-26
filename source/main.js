var $ = require('jquery');
var Quadrant = require('./Quadrant');
var config = require('./config');

require('jquery-ui');
require('./main.css');

$('body').mousedown(function(e) {

	if ($(e.target).closest('.screen,.hud').length) return;

	var anchorX = e.pageX;
	var anchorY = e.pageY;

	$(this).mousemove(function(e) {
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
	if(config.globalXOffset <= 0 || config.globalYOffset <= 0) bottomRight.renderView();
	if(config.globalXOffset >= 0 || config.globalYOffset <= 0) bottomLeft.renderView();
	if(config.globalXOffset >= 0 || config.globalYOffset >= 0) topLeft.renderView();
	if(config.globalXOffset <= 0 || config.globalYOffset >= 0) topRight.renderView();

	// imageCleanup();
}, 500);

$(window).mouseup(function(e) {
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
	e.stopPropagation();
	if (!hudDisplayed) {
		$('body')
			.append('<div class="screen"></div>')
			.append('<div class="hud" style="background: transparent url(\'http://placekitten.com/1400/1000\') no-repeat center;">' +
				'<i class="fa fa-times-circle-o fa-3x"></i>' +
				"<div class='caption'><h1>My little kitten</h1>Meow kittens meow litter box eat, meow give me fish sleep in the sink shed everywhere litter box. Puking jump on the table biting chase the red dot, feed me hairball attack your ankles jump sniff lick chase the red dot. Give me fish hairball stuck in a tree purr, sleep in the sink lick eat the grass hairball run rip the couch claw jump on the table. I don't like that food give me fish stuck in a tree I don't like that food attack feed me, biting run climb the" +
				"curtains jump jump. </div>" +
				'<div class="actions">' +
				'<i class="fa fa-twitter fa-3x"></i><i class="fa fa-pinterest fa-3x"></i><i class="fa fa-google-plus fa-3x"></i><i class="fa fa-facebook fa-3x"></i><i class="fa fa-download fa-3x"></i>' +
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
