// This is a companion pen to go along with https://beta.observablehq.com/@grantcuster/using-three-js-for-2d-data-visualization. It shows a three.js pan and zoom example using d3-zoom working on 100,000 points. The code isn't very organized here so I recommend you check out the notebook to read about what is going on.

let config = {};
config.width = window.innerWidth;
config.viz_width = config.width;
config.height = window.innerHeight;
config.fov = 40;
config.near = 10;
config.far = 7000;

config.scene = new THREE.Scene();
config.scene.background = new THREE.Color(0xefefef);

config.camera = new THREE.PerspectiveCamera(
  config.fov,
  config.width / config.height,
  config.near,
  config.far 
);

config.raycaster = new THREE.Raycaster();
config.raycaster.params.Points.threshold = 10;


console.log(config.camera);

window.addEventListener('resize', () => {
	config.width = window.innerWidth;
	config.viz_width = config.width;
	config.height = window.innerHeight;
	renderer.setSize(config.width, config.height);
	config.camera.aspect = config.width / config.height;
	config.camera.updateProjectionMatrix();
})

let color_array = [
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
]

// Add canvas
let renderer = new THREE.WebGLRenderer();
renderer.setSize(config.width, config.height);
document.body.appendChild(renderer.domElement);

let zoom = d3.zoom()
	.scaleExtent([getScaleFromZ(config.far, config.fov, config.height), getScaleFromZ(config.near, config.fov, config.height)])
	.on('zoom', () =>  {
		let d3_transform = d3.event.transform;
		zoomHandler(config.camera, d3_transform, config.viz_width, config.height);
	});

view = d3.select(renderer.domElement);

setUpZoom(view, config.camera, config.viz_width, config.height);

circle_sprite = new THREE.TextureLoader().load("https://fastforwardlabs.github.io/visualization_assets/circle-sprite.png");



load_price(config);



// Three.js render loop
function animate()
{
	requestAnimationFrame(animate);
	renderer.render(config.scene, config.camera);
}
animate();





// Hover and tooltip interaction
view.on("mousemove", () => {
	let m = d3.mouse(view.node());
	if(!config.points){return;}
	checkIntersects(config.raycaster, m, config.viz_width, config.height, config.camera, config.points, config.generated_points);
});





function sortIntersectsByDistanceToRay(intersects) {
  return _.sortBy(intersects, "distanceToRay");
}

hoverContainer = new THREE.Object3D()
config.scene.add(hoverContainer);

function highlightPoint(datum)
{
  removeHighlights();
  
  let geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(
      datum.position[0],
      datum.position[1],
      0
    )
  );
  geometry.colors = [ new THREE.Color(color_array[datum.group]) ];

  let material = new THREE.PointsMaterial({
    size: 26,
    sizeAttenuation: false,
    vertexColors: THREE.VertexColors,
    map: circle_sprite,
    transparent: true
  });
  
  let point = new THREE.Points(geometry, material);
  hoverContainer.add(point);
}

function removeHighlights() {
  hoverContainer.remove(...hoverContainer.children);
}

view.on("mouseleave", () => {
  removeHighlights()
});

// Initial tooltip state
let tooltip_state = { display: "none" }

let tooltip_template = document.createRange().createContextualFragment(`<div id="tooltip" style="display: none; position: absolute; pointer-events: none; font-size: 13px; width: 120px; text-align: center; line-height: 1; padding: 6px; background: white; font-family: sans-serif;">
  <div id="point_tip" style="padding: 4px; margin-bottom: 4px;"></div>
  <div id="group_tip" style="padding: 4px;"></div>
</div>`);
document.body.append(tooltip_template);

let $tooltip = document.querySelector('#tooltip');
let $point_tip = document.querySelector('#point_tip');
let $group_tip = document.querySelector('#group_tip');

function updateTooltip() {
  $tooltip.style.display = tooltip_state.display;
  $tooltip.style.left = tooltip_state.left + 'px';
  $tooltip.style.top = tooltip_state.top + 'px';
  $point_tip.innerText = tooltip_state.name;
  $point_tip.style.background = color_array[tooltip_state.group];
  $group_tip.innerText = `Group ${tooltip_state.group}`;
}

function showTooltip(mouse_position, datum) {
  let tooltip_width = 120;
  let x_offset = -tooltip_width/2;
  let y_offset = 30;
  tooltip_state.display = "block";
  tooltip_state.left = mouse_position[0] + x_offset;
  tooltip_state.top = mouse_position[1] + y_offset;
  tooltip_state.name = datum.name;
  tooltip_state.group = datum.group;
  updateTooltip();
}

function hideTooltip() {
  tooltip_state.display = "none";
  updateTooltip();
}

