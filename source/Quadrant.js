var $ = require('jquery');
var _ = require('lodash');
var config = require('./config');

require('./Quadrant.css');

function cardInView(left, top, cardWidth, cardHeight, windowWidth, windowHeight) {
	return ((left + cardWidth) < ((-1 * config.globalXOffset) + windowWidth + (2 * (Quadrant.SIZE + Quadrant.BORDER)))) &&
		((top + cardHeight) < ((-1 * config.globalYOffset) + windowHeight + (2 * (Quadrant.SIZE + Quadrant.BORDER)))) &&
		(left > ((-1 * config.globalXOffset) - (2 * (Quadrant.SIZE + Quadrant.BORDER)))) &&
		(top > ((-1 * config.globalYOffset) - (2 * (Quadrant.SIZE + Quadrant.BORDER))));
}

var Quadrant = function(x, y) {
	this.objects = [];
	this.renderQueue = [];
	this.x = x || 1;
	this.y = y || 1;
	if (x > 0 && y > 0) this.mos = 'br';
	if (x > 0 && y < 0) this.mos = 'tr';
	if (x < 0 && y > 0) this.mos = 'bl';
	if (x < 0 && y < 0) this.mos = 'tl';
	this.rendering = false;
};

Quadrant.prototype.renderView = function() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var height = (windowHeight) + Math.abs(config.globalYOffset);
	var width = (windowWidth) + Math.abs(config.globalXOffset);

	var columns = Math.ceil(width / Quadrant.SIZE);
	var rows = Math.ceil(height / Quadrant.SIZE);

	var scope = this;
	var count = 0;

	_.times(columns, function(x) {

		if (!scope.objects[x]) scope.objects[x] = [];
		if (!scope.objects[x + 1]) scope.objects[x + 1] = [];

		_.times(rows, function(y) {
			var def;

			if (scope.objects[x][y] == "PLACEHOLDER") {
				return;
			}

			def = scope.objects[x][y] ||
				(scope.objects[x][y] = scope.getRandomObject(x, y));

			if (def.h > 1 && def.w > 1) {
				scope.objects[x][y + 1] = "PLACEHOLDER";
				scope.objects[x + 1][y] = "PLACEHOLDER";
				scope.objects[x + 1][y + 1] = "PLACEHOLDER";
			} else if (def.h > 1) {
				// if(scope.y > 0) {
				scope.objects[x][y + 1] = "PLACEHOLDER";
				// } else {
				// 	scope.objects[x+1][y] = "PLACEHOLDER";	
				// }
			} else if (def.w > 1) {
				// if(scope.x > 0) {
				scope.objects[x + 1][y] = "PLACEHOLDER";
				// } else {
				// 	scope.objects[x][y+1] = "PLACEHOLDER";						
				// }
			}


			if (scope.renderObject(def.id, x, y, def.w * Quadrant.SIZE, def.h * Quadrant.SIZE, scope.mos, windowWidth, windowHeight)) {
				count++;
			} else {
				$('#' + def.id).remove();
			}

		});
	});
	console.log('images appended', count, this.renderQueue.length, $('.card').length, scope.rendering);

	var i = this.renderQueue.length;

	setTimeout(function() {
		if (scope.renderQueue.length) {
			scope.rendering = true;
			var item = scope.renderQueue.splice(0, 1);
			$('#' + item[0]).show('fade', {}, 50, arguments.callee);
		}
	})

}

Quadrant.prototype.renderObject = function(id, x, y, width, height, mos, windowWidth, windowHeight) {
	var left = x * Quadrant.SIZE * this.x;
	var top = y * Quadrant.SIZE * this.y;

	if (this.x < 0) left -= width;
	if (this.y < 0) top -= height;

	if (cardInView(left, top, width, height, windowWidth, windowHeight)) {
		if (!$('#' + id).length) {
			$('.card-container').append('<div id="' + id + '" class="card" style="width: ' + width + 'px; height: ' + height + 'px; left:' + left + 'px; top:' + top + 'px;" data-x="' + x + '" data-y="' + y + '" data-mosaic="' + mos + '" data-width="' + width + '" data-height="' + height + '"> ' +
				'<img src="http://placekitten.com/' + (width - Quadrant.BORDER) + '/' + (height - Quadrant.BORDER) + '">' +
				'</div>');

			this.renderQueue.push(id);
		}

		return true;
	}
}

Quadrant.prototype.getRandomObject = function(x, y) {
	var o;

	while (true) {
		o = this.getRandomObjectType();

		if (o.h > 1 && o.w > 1) {
			if (!this.objects[x][y + 1] && !this.objects[x][y + 1] && !this.objects[x + 1][y + 1]) {
				break;
			}
		} else if (o.h > 1) {
			// if(this.y > 0) {
			if (!this.objects[x][y + 1]) break;
			// } else {
			// 	if(!this.objects[x + 1][y]) break;
			// }
		} else if (o.w > 1) {
			// if(this.x > 0) {
			if (!this.objects[x + 1][y]) break;
			// } else {
			// 	if(!this.objects[x][y + 1]) break;
			// }
		} else {
			break;
		}
	}

	o.id = _.uniqueId();

	return o;
}

Quadrant.SIZE = 300;
Quadrant.BORDER = 16;

Quadrant.prototype.getRandomObjectType = function() {
	return {
		h: Math.ceil(Math.random() * 2),
		w: Math.ceil(Math.random() * 2)
	}
}

module.exports = Quadrant;
