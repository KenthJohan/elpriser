// This is a companion pen to go along with https://beta.observablehq.com/@grantcuster/using-three-js-for-2d-data-visualization. It shows a three.js pan and zoom example using d3-zoom working on 100,000 points. The code isn't very organized here so I recommend you check out the notebook to read about what is going on.










function app_init(cfg)
{
	let app = {};
	app.width = cfg.width;
	app.height = cfg.height;
	app.fov = cfg.fov;
	app.near = cfg.near;
	app.far = cfg.far;
	app.scene = new THREE.Scene();
	app.scene.background = new THREE.Color(0xefefef);
	app.color_array = [
		"#1f78b4",
		"#b2df8a",
		"#33a02c",
		"#fb9a99",
		"#e31a1c",
		"#fdbf6f",
		"#ff7f00",
		"#6a3d9a",
		"#cab2d6",
		"#ffff99"
	];
	app.circle_sprite = new THREE.TextureLoader().load("https://fastforwardlabs.github.io/visualization_assets/circle-sprite.png");
	app.pointsMaterial = new THREE.PointsMaterial({
		size: 8,
		sizeAttenuation: false,
		vertexColors: THREE.VertexColors,
		map: app.circle_sprite,
		transparent: true
	});
	app.linesMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	
	app.tooltip_state = { display: "none" }
	app.tooltip_template = document.createRange().createContextualFragment(`<div id="tooltip" style="display: none; position: absolute; pointer-events: none; font-size: 13px; width: 120px; text-align: center; line-height: 1; padding: 6px; background: white; font-family: sans-serif;">
	  <div id="point_tip" style="padding: 4px; margin-bottom: 4px;"></div>
	  <div id="group_tip" style="padding: 4px;"></div>
	</div>`);
	document.body.append(app.tooltip_template);
	app.$tooltip = document.querySelector('#tooltip');
	app.$point_tip = document.querySelector('#point_tip');
	app.$group_tip = document.querySelector('#group_tip');
	
	
	app.camera = new THREE.PerspectiveCamera(
		app.fov,
		app.width / app.height,
		app.near,
		app.far 
	);
	console.log(app.camera);
	
	app.raycaster = new THREE.Raycaster();
	app.raycaster.params.Points.threshold = 10;

	app.renderer = new THREE.WebGLRenderer();
	app.renderer.setSize(app.width, app.height);
	document.body.appendChild(app.renderer.domElement);

	app.hoverContainer = new THREE.Object3D()
	app.scene.add(app.hoverContainer);


	window.addEventListener('resize', () => {
		app.width = window.innerWidth;
		app.height = window.innerHeight;
		app.renderer.setSize(app.width, app.height);
		app.camera.aspect = app.width / app.height;
		app.camera.updateProjectionMatrix();
	});
	
	let zoom = d3.zoom()
		.scaleExtent([getScaleFromZ(app.far, app.fov, app.height), getScaleFromZ(app.near, app.fov, app.height)])
		.on('zoom', () =>  {
			let d3_transform = d3.event.transform;
			zoomHandler(app.camera, d3_transform, app.width, app.height);
		});

	view = d3.select(app.renderer.domElement);

	setUpZoom(view, zoom, app.camera, app.width, app.height);

	function updateTooltip()
	{
		app.$tooltip.style.display = app.tooltip_state.display;
		app.$tooltip.style.left = app.tooltip_state.left + 'px';
		app.$tooltip.style.top = app.tooltip_state.top + 'px';
		app.$point_tip.innerText = app.tooltip_state.name;
		app.$point_tip.style.background = app.color_array[app.tooltip_state.group];
		app.$group_tip.innerText = `Group ${app.tooltip_state.group}`;
	}

	function showTooltip(mouse_position, datum)
	{
		let tooltip_width = 120;
		let x_offset = -tooltip_width/2;
		let y_offset = 30;
		app.tooltip_state.display = "block";
		app.tooltip_state.left = mouse_position[0] + x_offset;
		app.tooltip_state.top = mouse_position[1] + y_offset;
		app.tooltip_state.name = datum.name;
		app.tooltip_state.group = datum.group;
		updateTooltip();
	}

	function hideTooltip()
	{
		app.tooltip_state.display = "none";
		updateTooltip();
	}
	
	// Three.js render loop
	function animate()
	{
		requestAnimationFrame(animate);
		app.renderer.render(app.scene, app.camera);
	}
	animate();

	function highlightPoint(datum)
	{
		removeHighlights();
		let geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(datum.position[0],datum.position[1],0));
		geometry.colors = [ new THREE.Color(app.color_array[datum.group]) ];
		let material = new THREE.PointsMaterial({
			size: 26,
			sizeAttenuation: false,
			vertexColors: THREE.VertexColors,
			map: app.circle_sprite,
			transparent: true
		});
		let point = new THREE.Points(geometry, material);
		app.hoverContainer.add(point);
	}

	// Hover and tooltip interaction
	view.on("mousemove", () => {
		let m = d3.mouse(view.node());
		if(!app.points){return;}
		let mouse_vector = mouseToThree(m, app.width, app.height);
		app.raycaster.setFromCamera(mouse_vector, app.camera);
		let intersects = app.raycaster.intersectObject(app.points);
		if (intersects[0])
		{
			let sorted_intersects = sortIntersectsByDistanceToRay(intersects);
			let intersect = sorted_intersects[0];
			let index = intersect.index;
			let datum = app.generated_points[index];
			highlightPoint(datum);
			showTooltip(m, datum);
		}
		else
		{
			removeHighlights();
			hideTooltip();
		}
	});
	
	function removeHighlights()
	{
		app.hoverContainer.remove(...app.hoverContainer.children);
	}

	view.on("mouseleave", () => {
		removeHighlights()
	});
	
	return app;
}











let config = {};
config.width = window.innerWidth;
config.height = window.innerHeight;
config.fov = 40;
config.near = 10;
config.far = 7000;





let app1 = app_init(config);
load_price(app1);














