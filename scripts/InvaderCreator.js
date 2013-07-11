// Invader Creater
function InvaderCreator() {
	this.counter = 0;
	this.spawned = 1;
	this.level = 1;
};

InvaderCreator.prototype.update = function() {
	this.counter++;
	if (this.counter % spawningTickCount == 0) {
		var x = 19;
		var y = Math.floor(Math.random()*19);

		var invader = new Invader(x, y);
		invader.hp = this.level;
		invader.originalHp = this.level;
		
		if (this.spawned % 6 == 0) {
			this.level++;
			document.getElementById("level").innerHTML = this.level;
		
			// Make a tower killer
			var path = map.computeShortestPath(x, y, bases[0].x, bases[0].y);
			map.computePathNeighbors(path);
			invader.setPath(path);

			var options = [];
			for (var i= 0; i < path.length; i++) {
				if (path[i].neighbors != 0) {
					options.push(i);
				}
			}

			if (options.length) {
				invader.earlyExploder = true;
				invader.explodeAt = path[options[Math.floor(options.length*Math.random())]];
			}
				
			invader.image = document.getElementById("enemy5");
			invader.color = "blue";
			invader.spinRate = Math.PI/20;


		} else {
			if (this.level > 25) {
				invader.image = document.getElementById("enemy4");
				invader.color = "green";
				invader.spinRate = Math.PI/100;
				invader.reward += 10;
			} else if (this.level > 15) {
				invader.image = document.getElementById("enemy3");
				invader.color = "purple";
				invader.spinRate = 0;
				invader.reward += 10;
			} else if (this.level > 10) {
				invader.image = document.getElementById("enemy2");
				invader.color = "blue";
				invader.spinRate = Math.PI/100;
				invader.reward += 10;
			} else if (this.level > 5) {
				invader.image = document.getElementById("enemy1");
				invader.color = "red";
				invader.spinRate = Math.PI/100;
			} else {
				invader.image = document.getElementById("enemy1");
				invader.color = "red";
				invader.spinRate = 0;
			}
		
			invader.setPath(map.computeShortestPath(x, y, bases[0].x, bases[0].y));
		}


		invaders.push(invader);
		this.spawned++;
	}
};
