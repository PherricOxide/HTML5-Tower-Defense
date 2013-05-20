// Particle
function Particle(x, y, size, color) {
	this.x = x;
	this.y = y;


	var min = 0;
	var max = 20;
	this.vel = Math.floor(Math.random() * (max - min + 1)) + min;

	this.color = color;
	
	this.angle = Math.floor(Math.random()*360);
	this.size = size;
}

Particle.prototype.update = function() {
	this.x += this.vel*Math.cos(this.angle);
	this.y += this.vel*Math.sin(this.angle);

	if (this.vel > 0) {
		this.vel--;
	} else if (this.vel < 0) {
		this.vel++;
	}
};

Particle.prototype.render = function() {
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.size, this.size);
};


