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
