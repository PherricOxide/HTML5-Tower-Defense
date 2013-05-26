// TowerFactory
function CreateTower(x, y, type) {
	if (type == "blank") {
		return new Blank(x, y);
	} else if (type == "cannon") {
		return new Cannon(x, y);
	} else if (type == "gatlingcannon") {
		return new GatlingCannon(x, y);
	} else if (type == "machinegun") {
		return new MachineGun(x, y);
	}
}


function Tower(x, y) {
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;
	
	this.counter = 0;
	
	this.angle = 0;
	this.desiredAngle = 0;
}

Tower.prototype.update = function() {
	var closestInvader = -1;
	var closestInvaderDist = 0;
	for (var i = 0; i < invaders.length; i++) {
		var invader = invaders[i];

		var dist = distance(this.x, invader.nextX, this.y, invader.nextY);
		if (closestInvader == -1 || dist < closestInvaderDist) {
			closestInvaderDist = dist;
			closestInvader = i;
			this.targetX = invader.x;
			this.targetY = invader.y;
		}
	}

	if (closestInvader != -1 && closestInvaderDist < this.range) {
		this.desiredAngle = computeAngle(
			gridSize*this.x + gridSize/2, 
			invaders[closestInvader].pixX + gridSize/2, 
			gridSize*this.y + gridSize/2, 
			invaders[closestInvader].pixY+gridSize/2
		);
	}

	var rotationRate = Math.PI/50;
	if (Math.abs(this.angle - this.desiredAngle) > rotationRate) {
		var d = (this.desiredAngle - this.angle) % (2*Math.PI);
		if (d < 0) {
			d = 2*Math.PI + this.angle;
		}
		if (d < Math.PI) {
			this.angle += rotationRate;
		} else {
			this.angle -= rotationRate;
		}

		this.angle = this.angle % (2*Math.PI);
		if (this.angle < 0) {
			this.angle = 2*Math.PI + this.angle;
		}

	}
	
	if (this.counter == 0) {
		if (closestInvader != -1 && closestInvaderDist < this.range) {
			bullets.push(new Bullet(this.pixX + gridSize/2, this.pixY + gridSize/2, invaders[closestInvader], this.bulletColor, this.dmg));
			this.counter = this.rate;
		}
	} else {
		this.counter--;
	}
};

Tower.prototype.render = function() {
	ctx.drawImage(this.image, this.x*gridSize, this.y*gridSize);
	ctx.save();
	ctx.translate(this.x*gridSize + gridSize/2, this.y*gridSize + gridSize/2);
	ctx.rotate(this.angle);
	ctx.translate(-1* (this.x*gridSize+ gridSize/2), -1* (this.y*gridSize+gridSize/2));
	ctx.drawImage(this.imageMuzzle, this.x*gridSize, this.y*gridSize);
	ctx.restore();
};

Tower.prototype.explode = function() {
	var p = 2*Math.random()*maxParticlesPerExplosion;
	for (var i = 0; i < p; i++) {
		particles.push(new Particle(this.x*gridSize, this.y*gridSize, Math.floor(Math.random()*maxParticleSize + 1), this.bulletColor));
	}
	
};

// Blank
function Blank(x, y) {
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;

	this.range = 0;
	this.cost = 50;
}

Blank.prototype.update = function() {};

Blank.prototype.render = function() {
	ctx.beginPath();
	ctx.moveTo(this.pixX, this.pixY);
	ctx.fillStyle = "grey";
	ctx.fillRect(this.pixX, this.pixY, gridSize, gridSize);
};

// Cannon
function Cannon(x, y) {
	Tower.apply(this, [x,y]);
	this.bulletColor = "brown";
	this.image = document.getElementById("imageCannon");
	this.imageMuzzle = document.getElementById("imageCannonMuzzle");

	this.cost = 100;
	this.rate = 100;
	this.range = 5;
	this.dmg = 1;
}
Cannon.prototype = new Tower();

// Machine Gun
function GatlingCannon(x, y) {
	Tower.apply(this, [x,y]);
	this.bulletColor = "#660033";
	this.image = document.getElementById("imageCannon");
	this.imageMuzzle = document.getElementById("imageGatlingCannonMuzzle");

	this.cost = 200;
	this.rate = 45;
	this.range = 5;
	this.dmg = 1;	
}
GatlingCannon.prototype = new Tower();


// Machine Gun
function MachineGun(x, y) {
	Tower.apply(this, [x,y]);
	this.bulletColor = "blue";
	this.image = document.getElementById("imageCannon");
	this.imageMuzzle = document.getElementById("imageMachineGunMuzzle");

	this.cost = 400;
	this.rate = 20;
	this.range = 5;
	this.dmg = 1;
}
MachineGun.prototype = new Tower();

