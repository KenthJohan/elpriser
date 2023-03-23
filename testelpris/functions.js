const cyrb53 = (str, seed = 0) => {
	let h1 = 0xdeadbeef ^ seed;
	let h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++)
	{
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function toRadians (angle)
{
	return angle * (Math.PI / 180);
}

function getScaleFromZ(camera_z_position, fov, height)
{
	let fov_height = Math.tan(toRadians(fov/2)) * camera_z_position * 2;
	let scale = height / fov_height; // Divide visualization height by height derived from field of view
	return scale;
}


function getZFromScale(fov, scale, height)
{
	let scale_height = height / scale;
	let camera_z_position = scale_height / (2 * Math.tan(toRadians(fov/2)));
	return camera_z_position;
}



function zoomHandler(camera, d3_transform, width, height)
{
	let scale = d3_transform.k;
	let x = -(d3_transform.x - width/2) / scale;
	let y = (d3_transform.y - height/2) / scale;
	let z = getZFromScale(camera.fov, scale, height);
	camera.position.set(x, y, z);
}

function setUpZoom(view, zoom, camera, width, height)
{
	view.call(zoom);    
	let initial_scale = getScaleFromZ(camera.far, camera.fov, height);
	var initial_transform = d3.zoomIdentity.translate(width/2, height/2).scale(initial_scale);    
	zoom.transform(view, initial_transform);
	camera.position.set(0, 0, camera.far);
}


function mouseToThree(mouse, width, height)
{
	let x = (mouse[0] / width) * 2 - 1;
	let y = -(mouse[1] / height) * 2 + 1;
	return new THREE.Vector3(x, y, 1);
}


function sortIntersectsByDistanceToRay(intersects)
{
	return _.sortBy(intersects, "distanceToRay");
}





