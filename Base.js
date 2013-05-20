// Base
function Base(x, y) { 
	this.hp = 5;
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;

	this.exploding = false;
	this.explosionCount = 1;
	this.counter = 0;
}

Base.prototype.explode = function(maxParticles) {
	if (!maxParticles) {
		maxParticles = maxParticlesPerExplosion;
	}

	var p = Math.random()*maxParticles;
	for (var i = 0; i < p; i++) {
		particles.push(new Particle(this.x*gridSize, this.y*gridSize, Math.floor(Math.random()*maxParticleSize + 1), "green"));
	}
	
};

Base.prototype.update = function() {
	if (this.exploding) {
		if (this.explosionCount >= 20) {
			this.exploding = false;
			return;
		}
		this.counter++;
		if (this.counter == Math.floor(50/this.explosionCount)) {
			this.explosionCount++;
			this.counter = 0;
			
			this.explode(100*this.explosionCount);

		}

	}
};

Base.prototype.render = function() {
	if (this.hp > 0 || this.exploding) {
		ctx.beginPath();
		ctx.moveTo(this.pixX, this.pixY);
		ctx.fillStyle = "green";
		ctx.fillRect(this.pixX, this.pixY, gridSize, gridSize);
	}
};
