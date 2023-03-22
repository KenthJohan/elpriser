function elpris_to_points(data)
{
	let data_points = [];
	for (let i = 0; i < n; i++)
	{
		let position = [i, data[i].SEK_per_kWh];
		let name = 'Point ' + i;
		let group = Math.floor(Math.random() * 6);
		let point = { position, name, group };
		data_points.push(point);
	}
	return data_points;
}


function load_price(scene)
{
	fetch("https://www.elprisetjustnu.se/api/v1/prices/2023/03-22_SE3.json")
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		let p = elpris_to_points(data);
	});
}




function gen_circle_random(radius, n)
{
	let data_points = [];
	for (let i = 0; i < n; i++)
	{
		let position = randomPosition(radius);
		let name = 'Point ' + i;
		let group = Math.floor(Math.random() * 6);
		let point = { position, name, group };
		data_points.push(point);
	}
	return data_points;
}


function gen_THREE_Points(generated_points)
{
	let pointsGeometry = new THREE.Geometry();
	let colors = [];
	for (let datum of generated_points)
	{
		// Set vector coordinates from data
		let vertex = new THREE.Vector3(datum.position[0], datum.position[1], 0);
		pointsGeometry.vertices.push(vertex);
		let color = new THREE.Color(color_array[datum.group]);
		colors.push(color);
	}
	pointsGeometry.colors = colors;
	let pointsMaterial = new THREE.PointsMaterial({
		size: 8,
		sizeAttenuation: false,
		vertexColors: THREE.VertexColors,
		map: circle_sprite,
		transparent: true
	});
	let points = new THREE.Points(pointsGeometry, pointsMaterial);
	return points;
}

