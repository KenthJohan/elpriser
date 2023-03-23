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


async function async_fetch_json(urlv)
{
	let fv = [];
	for(u of urlv)
	{
		fv.push(fetch(u));
	}
    const rv = await Promise.all(fv);
	let dv = [];
	for(r of rv)
	{
		dv.push(await r.json());
	}
	return dv;
}


function load_price(app)
{
    const urlv = 
	[
		"https://www.elprisetjustnu.se/api/v1/prices/2023/03-22_SE2.json",
		"https://www.elprisetjustnu.se/api/v1/prices/2023/03-22_SE3.json"
	];
	
	async_fetch_json(urlv).then((values) =>
	{
		console.log(values);
		
		app.generated_points = elpris_to_points(values[0]);
		app.points = gen_THREE_Points(app.generated_points, app.color_array, app.pointsMaterial);
		console.log(app.points);
		app.scene.add(app.points);
	});
	
	/*
	fetch("https://www.elprisetjustnu.se/api/v1/prices/2023/03-22_SE3.json")
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
	});
	*/
	

}






function gen_THREE_Points(generated_points, color_array, pointsMaterial)
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
	let points = new THREE.Points(pointsGeometry, pointsMaterial);
	return points;
}

