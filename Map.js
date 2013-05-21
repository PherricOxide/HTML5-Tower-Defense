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
	ctx.lineWidth = 1;
	ctx.strokeStyle = "grey";
	for (var x = this.gridSize; x < this.width; x += this.gridSize) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, this.height);
	}
	
	for (var y = this.gridSize; y < this.height; y += this.gridSize) {
			ctx.moveTo(0, y);
			ctx.lineTo(this.width, y);
	}
	ctx.stroke();
};

