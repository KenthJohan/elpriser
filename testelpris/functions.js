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

function setUpZoom(view, camera, viz_width, height)
{
	view.call(zoom);    
	let initial_scale = getScaleFromZ(far, camera.fov, height);
	var initial_transform = d3.zoomIdentity.translate(viz_width/2, height/2).scale(initial_scale);    
	zoom.transform(view, initial_transform);
	camera.position.set(0, 0, far);
}


// Random point in circle code from https://stackoverflow.com/questions/32642399/simplest-way-to-plot-points-randomly-inside-a-circle
function randomPosition(radius)
{
	var pt_angle = Math.random() * 2 * Math.PI;
	var pt_radius_sq = Math.random() * radius * radius;
	var pt_x = Math.sqrt(pt_radius_sq) * Math.cos(pt_angle);
	var pt_y = Math.sqrt(pt_radius_sq) * Math.sin(pt_angle);
	return [pt_x, pt_y];
}


function gen_circle_random(radius)
{
	let data_points = [];
	for (let i = 0; i < point_num; i++)
	{
		let position = randomPosition(radius);
		let name = 'Point ' + i;
		let group = Math.floor(Math.random() * 6);
		let point = { position, name, group };
		data_points.push(point);
	}
	return data_points;
}



function mouseToThree(mouse, viz_width, height)
{
	return new THREE.Vector3(
	mouse[0] / viz_width * 2 - 1,
	-(mouse[1] / height) * 2 + 1,
	1
	);
}





