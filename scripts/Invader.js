// Invader
function Invader(x, y) {
	this.x = x;
	this.y = y;
	this.hp = 2;
	this.originalHp = 2;
	this.reward = 20;
	this.nextX = x;
	this.nextY = y;

	this.pixX = x*gridSize;
	this.pixY = y*gridSize;

	this.path = [];

	this.spinRate = 0;
	this.angle = 0;
	this.image = document.getElementById("enemy1");

	this.color = "red";
	this.velocity = 1;
	this.counter = 0;
	this.color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

	// Only used for the early exploders, maybe split it off somewhere else
	this.earlyExploder = false;
	this.explodeAt = {};
}

Invader.prototype.setPath = function(path) {
	this.path = path;
}

Invader.prototype.explode = function() {
	var p = Math.random()*maxParticlesPerExplosion;
	for (var i = 0; i < p; i++) {
		particles.push(new Particle(this.x*gridSize, this.y*gridSize, Math.floor(Math.random()*maxParticleSize + 1), this.color));
	}
	
};

Invader.prototype.render = function() {
	ctx.save();
	ctx.translate(this.pixX+ gridSize/2, this.pixY + gridSize/2);
	ctx.rotate(this.angle);
	ctx.translate(-1* (this.pixX+ gridSize/2), -1* (this.pixY+gridSize/2));
	ctx.drawImage(this.image, this.pixX, this.pixY);
	ctx.restore();

	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.rect(this.pixX, this.pixY - 10, gridSize, 5);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.fillStyle = "green";
	ctx.rect(this.pixX, this.pixY - 10, Math.round(gridSize*(this.hp/this.originalHp)), 5);
	ctx.fill();
	
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

	this.angle += this.spinRate;
	if (this.angle > 2*Math.PI) {
		this.angle = 2*Math.PI + this.angle;
	}

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
