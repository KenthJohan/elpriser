function elpris_to_points(data, group)
{
	let data_points = [];
	for (let i = 0; i < data.length; i++)
	{
		let position = [i*100, data[i].SEK_per_kWh*100];
		let name = 'ÖRE_per_kWh ' + data[i].SEK_per_kWh*100;
		let point = { position, name, group };
		data_points.push(point);
	}
	return data_points;
}


function elpriser_to_points(v)
{
	let p = [];
	for (let i in v)
	{
		console.log(i);
		p.push(...elpris_to_points(v[i], i));
	}
	return p;
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
		"https://www.elprisetjustnu.se/api/v1/prices/2023/03-21_SE3.json",
		"https://www.elprisetjustnu.se/api/v1/prices/2023/03-22_SE3.json"
	];
	
	
	
	
	async_fetch_json(urlv).then((values) =>
	{
		console.log(values);
		
		app.generated_points = elpriser_to_points(values);
		
		let g = gen_THREE_Points(app.generated_points, app.color_array);
		app.points = new THREE.Points(g, app.pointsMaterial);
		app.lines = new THREE.Line(g, app.linesMaterial);
		
		console.log(app.points);
		app.scene.add(app.points);
		app.scene.add(app.lines);
	});
	
	/*
	fetch("https://www.elprisetjustnu.se/api/v1/prices/2023/03-22_SE3.json")
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
	});
	*/
	

}






function gen_THREE_Points(generated_points, color_array)
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
	return pointsGeometry;
	

}

