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

function Cannon(x, y) {
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;
	this.color = "brown";
	this.bulletColor = "brown";

	this.cost = 100;
	this.rate = 100;
	this.counter = 0;
	this.dmg = 1;
	this.range = 5;
}

Cannon.prototype.update = function() {
	if (this.counter == 0) {
		this.counter = 0;

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
			bullets.push(new Bullet(this.pixX, this.pixY, invaders[closestInvader], this.bulletColor, this.dmg));
			this.counter = this.rate;
		}
	} else {
		this.counter--;
	}
};

Cannon.prototype.render = function() {
	// TODO do this only when we hover over the tower
	/*
	ctx.strokeStyle =  "rgba(255, 0, 0, .2)";
	ctx.beginPath();
	ctx.arc(this.x*gridSize + gridSize/2, this.y*gridSize+gridSize/2, this.range*gridSize, 0, 2 * Math.PI, false);
	ctx.lineWidth = 1;
	ctx.stroke();
	*/
	
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x*gridSize + gridSize/2, this.y*gridSize+gridSize/2, gridSize/2, 0, 2 * Math.PI, false);
	ctx.fill();
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

// Machine Gun
function GatlingCannon(x, y) {
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;
	this.color = "#660033";
	this.bulletColor = "#660033";
	this.counter = 0;

	this.cost = 200;
	this.range = 5;
	this.rate = 20;
	this.dmg = 0.25;
}

GatlingCannon.prototype.update = Cannon.prototype.update;
GatlingCannon.prototype.render = Cannon.prototype.render;


// Machine Gun
function MachineGun(x, y) {
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;
	this.color = "blue";
	this.bulletColor = "blue";
	this.counter = 0;

	this.cost = 400;
	this.range = 5;
	this.rate = 10;
	this.dmg = 0.28;
}

MachineGun.prototype.update = Cannon.prototype.update;
MachineGun.prototype.render = Cannon.prototype.render;
