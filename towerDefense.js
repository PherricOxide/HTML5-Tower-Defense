/**
 *
 * @source: https://github.com/PherricOxide/HTML5-Tower-Defense
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013 David Clark (PherricOxide)
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */

var ctx, canvas;

var map, bases, invaders, invaderCreator, particles;
var towers = [];

var ticker = -1;

var gridSize = 20;
var width = 400;
var height = 400;

function isInMap(x, y) {
	return !(x < 0 || y < 0 || x >= width || y >= height);
}

$(document).ready(function() {
	canvas = document.getElementById("c");
	canvas.addEventListener("mousedown", doMouseDown, false);
	ctx = canvas.getContext("2d");

	Reset();
});

function Reset() {
	maxParticlesPerExplosion = document.getElementById("maxParticlesPerExplosion").value;
	maxParticleSize = document.getElementById("maxParticleSize").value;
	spawningTickCount = document.getElementById("spawningTickCount").value;


	clearInterval(ticker);

	map = new Map(width, height, gridSize);
	invaderCreator = new InvaderCreator();

	bases = [];
	bases.push(new Base(10, 10));

	invaders = [];
	particles = [];

	ticker = setInterval(function() {
		updateAll();
		renderAll();
	}, 20);
}

var mq = [];
function doMouseDown(e) {
	var x = Math.floor((e.clientX - canvas.offsetLeft)/gridSize);
	var y = Math.floor((e.clientY - canvas.offsetTop)/gridSize);
	mq.push({x: x, y: y});
};

function handleMouseEvents() {
	var callMapChanged = false;
	for (var i = 0; i < mq.length; i++) {
	
		var x = mq[i].x;
		var y = mq[i].y;

		console.log(x);
		console.log(y);
		
		if (x == Math.floor(width/gridSize - 1)) {
			console.log("On grid edge");
			continue;
		}

		// If something is already there
		if (map.grid[x][y]) {
			console.log("already taken");
			continue;
		}

		map.grid[x][y] = true;
		
		// If we'd block all the paths to the base
		if (map.computeShortestPath(Math.floor(width/gridSize) - 1, Math.floor(height/gridSize) - 1, bases[0].x, bases[0].y).length == 0) {
			console.log("Blockign path");
			map.grid[x][y] = false;
			continue;
		}
		for (var i = 0; i < invaders.length; i++) {
			if (invaders[i].nextX == x && invaders[i].nextY == y) {
				console.log("On invader path");
				map.grid[x][y] = false;
				break;
			}
		}

		if (map.grid[x][y]) {
			towers.push(new Tower(x, y));
			callMapChanged = true;
		}
	}

	mq = [];
	if (callMapChanged) mapChanged();

}

function mapChanged() {
	for (var i = 0; i < invaders.length; i++) {
		var newPath = map.computeShortestPath(invaders[i].nextX, invaders[i].nextY, bases[0].x, bases[0].y);
		invaders[i].setPath(newPath);
	}

};

// Tower
function Tower(x, y) {
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;

}

Tower.prototype.update = function() {};

Tower.prototype.render = function() {
	ctx.beginPath();
	ctx.moveTo(this.pixX, this.pixY);
	ctx.fillStyle = "brown";
	ctx.fillRect(this.pixX, this.pixY, gridSize, gridSize);
};

function renderAll() {
	ctx.save();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0, 0, width, height);
	ctx.restore();


	map.render();	
	for (var i = 0; i < bases.length; i++) {bases[i].render();}
	for (var i = 0; i < towers.length; i++) {towers[i].render();}
	for (var i = 0; i < invaders.length; i++) {invaders[i].render()};
	for (var i = 0; i < particles.length; i++) {particles[i].render()};
}

function updateAll() {
	handleMouseEvents();
	invaderCreator.update();
	for (var i = 0; i < invaders.length; i++) {invaders[i].update()};
	for (var i = 0; i < particles.length; i++) {
		particles[i].update();
		if (!isInMap(particles[i].x, particles[i].y) || (particles[i].vel == 0)) {
			particles.splice(i, 1);
			i--;
		}


	};

	checkHits();
}

function checkHits() {
	for (var i = 0; i < invaders.length; i++) {
		for (var b = 0; b < bases.length; b++) {
			if (invaders[i].x == bases[b].x && invaders[i].y == bases[b].y) {
				invaders[i].explode();
				invaders.splice(i, 1);
				break;
			}
		}
	}
}

// Invader Creater
function InvaderCreator() {
	this.counter = 0;
};

InvaderCreator.prototype.update = function() {
	this.counter++;
	if (this.counter == spawningTickCount) {
		this.counter = 0;

		var x = 19;
		var y = Math.floor(Math.random()*19);

		var invader = new Invader(x, y);
		invader.setPath(map.computeShortestPath(x, y, bases[0].x, bases[0].y));

		invaders.push(invader);
	}
};

// Particle
function Particle(x, y, size) {
	this.x = x;
	this.y = y;


	var min = 0;
	var max = 20;
	this.vel = Math.floor(Math.random() * (max - min + 1)) + min;
	
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
	ctx.fillStyle = "red";
	ctx.fillRect(this.x, this.y, this.size, this.size);
};

// Invader
function Invader(x, y) {
	this.x = x;
	this.y = y;
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
		particles.push(new Particle(this.x*gridSize, this.y*gridSize, Math.floor(Math.random()*maxParticleSize + 1)));
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


// Base
function Base(x, y) { 
	this.x = x;
	this.y = y;
	this.pixX = x*gridSize;
	this.pixY = y*gridSize;
}

Base.prototype.render = function() {
	ctx.beginPath();
	ctx.moveTo(this.pixX, this.pixY);
	ctx.fillStyle = "green";
	ctx.fillRect(this.pixX, this.pixY, gridSize, gridSize);
};


// Map
function Map(width, height, gridSize) {
	this.width = width;
	this.height = height;
	this.gridSize = gridSize;

	this.grid = [];
	for (var x = 0; x < this.width/this.gridSize; x++) {
		this.grid.push([]);
		for (var y = 0; y < this.width/this.gridSize; y++) {
			this.grid[x].push(false);
		}
	}
}

Map.prototype.computeShortestPath = function(x1, y1, x2, y2) {
	var q = [];
	var qi = 0;

	var visited = this.grid.slice(0);
	for (var i = 0; i < this.grid.length; i++) {
		visited[i] = this.grid[i].slice(0);
	}
	q.push({x: x1, y: y1, mom: null});

	while (q.length > qi) {
		var c = q[qi];
		qi++;

		if (c.x < 0 || c.x >= this.width/gridSize || c.y < 0 || c.y >= this.height/gridSize) {
			continue;
		}

		if (visited[c.x][c.y]) {continue;}
		visited[c.x][c.y] = true;

		if (c.x == x2 && c.y == y2) {
			var path = [c];

			while (c.mom != null) {
				path.push(c.mom);
				c = c.mom;
			}

			path.pop();
			return path.reverse();
		}

		q.push({x: c.x + 1 , y: c.y     , mom: c});
		q.push({x: c.x	   , y: c.y + 1 , mom: c});
		q.push({x: c.x - 1 , y: c.y     , mom: c});
		q.push({x: c.x	   , y: c.y - 1 , mom: c});

		
	}
	
	return [];
};

Map.prototype.render = function() {
	ctx.beginPath();
	for (var x = this.gridSize; x < this.width; x += this.gridSize) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, this.height);
			ctx.lineWidth = 1;
			ctx.strokeStyle = "grey";
			ctx.stroke();
	}
	
	for (var y = this.gridSize; y < this.height; y += this.gridSize) {
			ctx.moveTo(0, y);
			ctx.lineTo(this.width, y);
			ctx.lineWidth = 1;
			ctx.strokeStyle = "grey";
			ctx.stroke();
	}
};

