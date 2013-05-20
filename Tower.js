// TowerFactory
function CreateTower(x, y, type) {
	if (type == "blank") {
		return new Blank(x, y);
	} else if (type == "archer") {
		return new Archer(x, y);
	}
}

// Archer
function Archer(x, y) {
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;

	this.cost = 100;
	this.rate = 100;
	this.counter = 0;
	this.range = 5;
}

Archer.prototype.update = function() {
	this.counter++;
	if (this.counter == this.rate) {
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
			bullets.push(new Bullet(this.pixX, this.pixY, invaders[closestInvader]));
		}
	}
};

Archer.prototype.render = function() {
	// TODO do this only when we hover over the tower
	ctx.strokeStyle =  "rgba(255, 0, 0, .2)";
	ctx.beginPath();
	ctx.arc(this.x*gridSize + gridSize/2, this.y*gridSize+gridSize/2, this.range*gridSize, 0, 2 * Math.PI, false);
	ctx.lineWidth = 1;
	ctx.stroke();
	
	ctx.fillStyle = "brown";
	ctx.beginPath();
	ctx.arc(this.x*gridSize + gridSize/2, this.y*gridSize+gridSize/2, gridSize/2, 0, 2 * Math.PI, false);
	ctx.fill();

	//ctx.fillRect(this.pixX, this.pixY, gridSize, gridSize);
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
