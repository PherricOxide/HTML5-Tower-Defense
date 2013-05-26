function distance(x1, x2, y1, y2)
{
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function computeAngle(x1, x2, y1, y2)
{
	var a = Math.atan2(y2 - y1, x1 - x2);
	if(a < 0)	
		a = Math.abs(a);
	else
		a = 2*Math.PI - a;
	return a;
}


function adjacent(p1, p2) {
	if (p1.x == p2.x) {
		if (p1.y == p2.y + 1 || p1.y == p2.y - 1) {
			return true;
		} else {
			return false;
		}
	}

	if (p1.y == p2.y) {
		if (p1.x == p2.x + 1 || p1.x == p2.x -1) {
			return true;
		} else {
			return false;
		}
	}
}
