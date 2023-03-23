function toRadians (angle)
{
	return angle * (Math.PI / 180);
}

function getScaleFromZ(camera_z_position, fov, height)
{
	let half_fov = fov/2;
	let half_fov_radians = toRadians(half_fov);
	let half_fov_height = Math.tan(half_fov_radians) * camera_z_position;
	let fov_height = half_fov_height * 2;
	let scale = height / fov_height; // Divide visualization height by height derived from field of view
	return scale;
}


function getZFromScale(fov, scale, height)
{
	let half_fov = fov/2;
	let half_fov_radians = toRadians(half_fov);
	let scale_height = height / scale;
	let camera_z_position = scale_height / (2 * Math.tan(half_fov_radians));
	return camera_z_position;
}



function zoomHandler(camera, d3_transform, viz_width, height)
{
	let scale = d3_transform.k;
	let x = -(d3_transform.x - viz_width/2) / scale;
	let y = (d3_transform.y - height/2) / scale;
	let z = getZFromScale(camera.fov, scale, height);
	camera.position.set(x, y, z);
}

function setUpZoom(view, zoom, camera, viz_width, height)
{
	view.call(zoom);    
	let initial_scale = getScaleFromZ(camera.far, camera.fov, height);
	var initial_transform = d3.zoomIdentity.translate(viz_width/2, height/2).scale(initial_scale);    
	zoom.transform(view, initial_transform);
	camera.position.set(0, 0, camera.far);
}


function mouseToThree(mouse, viz_width, height)
{
	return new THREE.Vector3(
	mouse[0] / viz_width * 2 - 1,
	-(mouse[1] / height) * 2 + 1,
	1
	);
}


function sortIntersectsByDistanceToRay(intersects)
{
	return _.sortBy(intersects, "distanceToRay");
}





