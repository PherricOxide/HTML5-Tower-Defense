function Bullet(x, y, target, color, dmg) {
	this.x = x;
	this.y = y;
	this.target = target;
	this.dmg = 1;
	this.size = 4;
	this.bulletColor = color;
	
	this.vel = 5;
	this.counter = 0;
	this.dmg = dmg;
}

Bullet.prototype.explode = function() {
	var p = Math.random()*(maxParticlesPerExplosion);
	for (var i = 0; i < p; i++) {
		particles.push(new Particle(this.x, this.y, Math.floor(Math.random()*this.size/2 + 1), this.bulletColor));
	}
}

Bullet.prototype.update = function() {
	if (Math.floor(distance(this.target.pixX, this.x, this.target.pixY, this.y)) <= this.vel) {
		this.explode();
		return true;
	}
	var deltaX = this.target.pixX - this.x;
	var deltaY = this.target.pixY - this.y;
	this.angle = computeAngle(this.target.pixX, this.x, this.target.pixY, this.y);

	this.x += this.vel*Math.cos(this.angle);
	this.y += this.vel*Math.sin(this.angle);

	if (this.x >= (this.target.x - 1)*gridSize && this.x <= (this.target.x)*gridSize && this.y >= (this.target.y - 1)*gridSize && this.y <= (this.target.y)*gridSize) {
		this.explode();
		return true;
	}

	return false;
};

Bullet.prototype.render = function() {
	ctx.fillStyle = this.bulletColor;
	ctx.fillRect(this.x, this.y, this.size, this.size);

	/* Render path to target
	ctx.strokeStyle = "grey";
	ctx.beginPath();;
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.target.pixX, this.target.pixY);
	ctx.stroke();
	*/

};
