// Invader
function Invader(x, y) {
	this.x = x;
	this.y = y;
	this.hp = 2;
	this.reward = 20;
	this.nextX = x;
	this.nextY = y;

	this.pixX = x*gridSize;
	this.pixY = y*gridSize;

	this.path = [];

	this.velocity = 1;
	this.counter = 0;
	this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

Invader.prototype.setPath = function(path) {
	this.path = path;
}

Invader.prototype.explode = function() {
	var p = Math.random()*maxParticlesPerExplosion;
	for (var i = 0; i < p; i++) {
		particles.push(new Particle(this.x*gridSize, this.y*gridSize, Math.floor(Math.random()*maxParticleSize + 1), "red"));
	}
	
};

Invader.prototype.render = function() {
	ctx.fillStyle = "red";
	ctx.fillRect(this.pixX, this.pixY, gridSize, gridSize);
	
	/* path debugging
	ctx.fillStyle = "orange";
	ctx.fillRect(this.nextX*gridSize, this.nextY*gridSize, gridSize, gridSize);

	ctx.fillStyle = this.color;
	for( var i = 0; i < this.path.length; i++) {
		ctx.fillRect(this.path[i].x*gridSize, this.path[i].y*gridSize, gridSize, gridSize);	
	}
	*/
};

Invader.prototype.update = function() {
	this.counter++;

	if (this.counter == gridSize) {
		this.counter = 0;
		this.x = this.nextX;
		this.y = this.nextY;

		if (this.path.length) {

			this.nextX = this.path[0].x;
			this.nextY = this.path[0].y;	

			this.path.splice(0, 1);
		}
	}

	if (this.nextX > this.x) {
		this.pixX++;
	} else if (this.nextX < this.x) {
		this.pixX--;
	} else if (this.nextY > this.y) {
		this.pixY++;
	} else if (this.nextY < this.y) {
		this.pixY--;
	}
};
