function elpris_to_points(data)
{
	let data_points = [];
	for (let i = 0; i < data.length; i++)
	{
		let position = [i, data[i].SEK_per_kWh];
		let name = 'SEK_per_kWh ' + data[i].SEK_per_kWh;
		let group = Math.floor(Math.random() * 6);
		let point = { position, name, group };
		data_points.push(point);
	}
	return data_points;
}


function load_price(app)
{
	fetch("https://www.elprisetjustnu.se/api/v1/prices/2023/03-22_SE3.json")
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
		app.generated_points = elpris_to_points(data);
		app.points = gen_THREE_Points(app.generated_points);
		app.scene.add(app.points);
	});
}

let circle_sprite = new THREE.TextureLoader().load("https://fastforwardlabs.github.io/visualization_assets/circle-sprite.png");
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

