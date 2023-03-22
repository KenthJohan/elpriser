function zoomHandler(camera, d3_transform)
{
	let scale = d3_transform.k;
	let x = -(d3_transform.x - viz_width/2) / scale;
	let y = (d3_transform.y - height/2) / scale;
	let z = getZFromScale(scale);
	camera.position.set(x, y, z);
}