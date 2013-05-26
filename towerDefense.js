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

var ctx, canvas, ctxFinal, canvasBuffer;

var map, bases, invaders, invaderCreator, particles;
var towers = [];
var bullets = [];

var ticker = -1;

var gridSize = 32;
var width = 640;
var height = 640;

var money = 0;

var lastMouseLocation = {x: 0, y: 0};
var mouseInCanvas = false;

function isInMap(x, y) {
	return !(x < 0 || y < 0 || x >= width || y >= height);
}

$(document).ready(function() {
	SelectTower("cannon");
	canvas = document.getElementById("c");
	canvas.addEventListener("mousedown", doMouseDown, false);
	ctxFinal = canvas.getContext("2d");

	canvas.onmousemove = function(e) {
		var x = Math.floor((e.pageX - canvas.offsetLeft)/gridSize);
		var y = Math.floor((e.pageY - canvas.offsetTop)/gridSize);
		lastMouseLocation = {x: x, y: y};
		mouseInCanvas = true;
	}

	$("#c").mouseleave(function() {
		lastMouseLocation = {x: 0, y: 0};
		mouseInCanvas = false;
	});

	canvasBuffer = document.createElement("canvas");
	canvasBuffer.width = width;
	canvasBuffer.height = height;
	ctx = canvasBuffer.getContext("2d");

	map = new Map(width, height, gridSize);
	invaderCreator = new InvaderCreator();
	AddMoney(200);
	Reset();
});

function SelectTower(type) {
	currentTower = type;
	$(".towerSelect").each(function() {this.style.color = "black";});
	if (type == "cannon") {
		$("#cannon").each(function() {this.style.color = "blue";});
		currentCost = 100;
	} else if (type == "blank") {
		$("#blank").each(function() {this.style.color = "blue";});
		currentCost = 50;
	} else if (type == "gatlingcannon") {
		$("#gatlingcannon").each(function() {this.style.color = "blue";});
		currentCost = 200;
	} else if (type == "machinegun") {
		$("#machinegun").each(function() {this.style.color = "blue";});
		currentCost = 400;
	}

}


function Reset() {
	maxParticlesPerExplosion = document.getElementById("maxParticlesPerExplosion").value;
	maxParticleSize = document.getElementById("maxParticleSize").value;
	spawningTickCount = document.getElementById("spawningTickCount").value;
	spawningHP = document.getElementById("spawningHP").value;


	clearInterval(ticker);


	bases = [];
	bases.push(new Base(10, 10));
	document.getElementById("HP").innerHTML = bases[0].hp;

	invaders = [];
	particles = [];

	ticker = setInterval(function() {
		updateAll();
		renderAll();
	}, 20);
}

var mq = [];
function doMouseDown(e) {
	var x = Math.floor((e.pageX - canvas.offsetLeft)/gridSize);
	var y = Math.floor((e.pageY - canvas.offsetTop)/gridSize);
	mq.push({x: x, y: y});
};

function handleMouseEvents() {
	var callMapChanged = false;
	for (var i = 0; i < mq.length; i++) {

		// Can we afford a tower?
		if (currentCost > money) {
			continue;
		}
	
		var x = mq[i].x;
		var y = mq[i].y;

		if (x == Math.floor(width/gridSize - 1)) {
			continue;
		}

		// If something is already there
		if (map.grid[x][y]) {
			continue;
		}

		map.grid[x][y] = true;
		
		// If we'd block all the paths to the base
		if (map.computeShortestPath(Math.floor(width/gridSize) - 1, Math.floor(height/gridSize) - 1, bases[0].x, bases[0].y).length == 0) {
			map.grid[x][y] = false;
			continue;
		}
		for (var i = 0; i < invaders.length; i++) {
			if (invaders[i].nextX == x && invaders[i].nextY == y) {
				map.grid[x][y] = false;
				break;
			}
		}

		if (map.grid[x][y]) {
			towers.push(CreateTower(x, y, currentTower));
			SpendMoney(currentCost);
			callMapChanged = true;
		}
	}

	mq = [];
	if (callMapChanged) mapChanged();

}

function mapChanged() {
	for (var i = 0; i < invaders.length; i++) {
		var newPath = map.computeShortestPath(invaders[i].nextX, invaders[i].nextY, bases[0].x, bases[0].y);
		if (invaders[i].earlyExploder) {
			map.computePathNeighbors(newPath);
		}
		invaders[i].setPath(newPath);
	}

};


function renderAll() {
	ctxFinal.save();
	ctxFinal.setTransform(1,0,0,1,0,0);
	ctxFinal.clearRect(0, 0, width, height);
	ctxFinal.restore();
	
	ctx.save();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0, 0, width, height);
	ctx.restore();


	map.render();	


	if (mouseInCanvas) {
		if (map.grid[lastMouseLocation.x][lastMouseLocation.y]) {
			ctx.strokeStyle =  "rgba(255, 0, 0, .8)";
		} else {
			ctx.strokeStyle =  "rgba(0, 255, 0, .8)";
		}
		
		ctx.beginPath();
		ctx.arc(lastMouseLocation.x*gridSize + gridSize/2, lastMouseLocation.y*gridSize+gridSize/2, 5*gridSize, 0, 2 * Math.PI, false);
		ctx.lineWidth = 1;
		ctx.stroke();
		
		if (map.grid[lastMouseLocation.x][lastMouseLocation.y]) {
			ctx.fillStyle =  "rgba(255, 0, 0, .2)";
		} else {
			ctx.fillStyle =  "rgba(0, 255, 0, .2)";
		}
		ctx.fillRect(lastMouseLocation.x*gridSize, lastMouseLocation.y*gridSize, gridSize, gridSize);

	}
	for (var i = 0; i < bases.length; i++) {bases[i].render();}
	for (var i = 0; i < towers.length; i++) {towers[i].render();}
	for (var i = 0; i < invaders.length; i++) {invaders[i].render()};
	for (var i = 0; i < particles.length; i++) {particles[i].render()};
	for (var i = 0; i < bullets.length; i++) {bullets[i].render()};

	ctxFinal.drawImage(canvasBuffer, 0,0);
}

function updateAll() {
	var gameOver = false;
	var callMapChanged = false;

	for (var i = 0; i < bases.length; i++) {
		bases[i].update();
		if (bases[i].hp <= 0) {
			gameOver = true;
		}
	}

	if (!gameOver) {
		invaderCreator.update();
		for (var i = 0; i < towers.length; i++) {towers[i].update();}
		handleMouseEvents();
	} else {
		if (bases[0].exploding == false) {
			// Explode all the invaders
			for (var i = 0; i < invaders.length; i++) {
				invaders[i].explode();
			};
			invaders = [];
		}
	}
	
	for (var i = 0; i < bullets.length; i++) {
		if (bullets[i].target.hp <= 0) {
			// Target already destroyed. Get rid of the bullet.
			bullets.splice(i, 1);
			i--;
			continue;
		}

		if (bullets[i].update()) {

			bullets[i].target.hp -= bullets[i].dmg;
			if (bullets[i].target.hp <= 0) {
				bullets[i].target.explode();
				var invaderIndex = invaders.indexOf(bullets[i].target);
				if (invaderIndex == -1) {continue;}

				AddMoney(invaders[invaderIndex].reward);
				invaders.splice(invaderIndex, 1);
			}
			bullets.splice(i, 1);
			i--;

		}
	};
	if (!gameOver) {
		for (var i = 0; i < invaders.length; i++) {
			invaders[i].update();

			if (invaders[i].earlyExploder && invaders[i].x == invaders[i].explodeAt.x && invaders[i].y == invaders[i].explodeAt.y) {
				invaders[i].explode();

				// Explode the towers
				for (var t = 0; t < towers.length; t++) {
					if (adjacent({x: towers[t].x, y: towers[t].y}, invaders[i].explodeAt)) {
						map.grid[towers[t].x][towers[t].y] = false;
						towers.splice(t, 1);
						t--;
					}
				}

				invaders.splice(i, 1);
				i--;

				callMapChanged = true;
			}
		};
	}
	for (var i = 0; i < particles.length; i++) {
		particles[i].update();
		if (!isInMap(particles[i].x, particles[i].y) || (particles[i].vel == 0)) {
			particles.splice(i, 1);
			i--;
		}


	};

	if (callMapChanged) {mapChanged();}

	checkHits();
}

function AddMoney(amount) {
	money += amount;
	document.getElementById("money").innerHTML = money;
}

function SpendMoney(amount) {
	money -= amount;
	document.getElementById("money").innerHTML = money;
}

function checkHits() {
	for (var i = 0; i < invaders.length; i++) {
		for (var b = 0; b < bases.length; b++) {
			if (invaders[i].x == bases[b].x && invaders[i].y == bases[b].y) {
				invaders[i].explode();
				invaders.splice(i, 1);
				
				bases[b].hp--;
				bases[b].explode();
				document.getElementById("HP").innerHTML = bases[b].hp;
				if (bases[b].hp <= 0) {
					bases[b].exploding = true;
					return;
				}

				break;
			}
		}
	}
}


