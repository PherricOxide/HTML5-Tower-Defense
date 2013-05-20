// Invader Creater
function InvaderCreator() {
	this.counter = 0;
	this.spawned = 0;
	this.level = 1;
};

InvaderCreator.prototype.update = function() {
	this.counter++;
	if (this.counter % spawningTickCount == 0) {
		var x = 19;
		var y = Math.floor(Math.random()*19);

		if (this.spawned % 6 == 0) {
			this.level++;
			document.getElementById("level").innerHTML = this.level;
		}


		var invader = new Invader(x, y);
		invader.hp = this.level;
		invader.setPath(map.computeShortestPath(x, y, bases[0].x, bases[0].y));
		invaders.push(invader);
		this.spawned++;
	}
};
