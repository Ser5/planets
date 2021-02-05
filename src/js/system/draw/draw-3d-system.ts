import {canvas3d, pi2} from 'init';
import * as THREE      from 'three';
import objectsTree     from 'objects-tree';
import view            from 'view';
import SpaceObject     from 'space-object';
import System          from 'system';
import DrawSystemBase  from './draw-system-base';
import IDraw3D         from './i/idraw-3d';
import IDraw           from './i/idraw';



let draw3DSystem = new class extends DrawSystemBase {
	vertical = 1;

	private _scene:    any;
	private _camera:   any;
	private _renderer: any;

	constructor () {
		super();
		this._scene  = new THREE.Scene();

		this._camera = new THREE.OrthographicCamera(-200, 200, 100, -100, 1, 2000);
		this._camera.position.z = 200;
		this._scene.add(this._camera);

		this._renderer = new THREE.WebGLRenderer({
			canvas:    canvas3d,
			antialias: true,
		});

		let light = new THREE.PointLight(0xffffff, 1, 0, 0);
		light.castShadow = true;
		//light.position.set(100, 100, 100);
		this._scene.add(light);
	}



	getComponent (
		{spaceObject}:
		{spaceObject: SpaceObject}
	): IDraw3D {
		let geometry;
		let color;
		let opacity;

		let form    = spaceObject.sphere ? spaceObject.sphere : spaceObject.disc;
		let soColor = form.color;
		//console.log(soColor);
		if (soColor.startsWith('#')) {
			let colorHex = soColor;
			if (soColor.length == 7) {
				color   = soColor;
				opacity = 1;
			} else {
				color   = soColor.substr(0, 7);
				opacity = 1 / 256 * parseInt(soColor.substr(7), 16);
				//console.log(color, opacity);
			}
		} else {
			color = soColor;
		}

		if (spaceObject.sphere) {
			geometry = new THREE.SphereGeometry(spaceObject.sphere.radius, 16, 16);
		} else {
			let innerRadius = spaceObject.parent.sphere.radius + spaceObject.disc.distance;
			let outerRadius = innerRadius + spaceObject.disc.size;
			geometry = new THREE.RingGeometry(innerRadius, outerRadius, 16);
		}

		let material = new THREE.MeshPhysicalMaterial({
			color,
			opacity,
			emissive:          (spaceObject.sphere?.emissive ?? color),
			emissiveIntensity: (spaceObject.sphere?.emissive ? 1 : 0.2),
			metalness: 0.3,
			roughness: 0.65,
		});
		//console.log((spaceObject.sphere));
		/*let material = new THREE.MeshBasicMaterial({
			color,
			opacity,
		});*/
		//console.log(geometry, material);

		let mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow    = true;
		mesh.receiveShadow = true;
		this._scene.add(mesh);
		return {spaceObject, mesh, x:0, y:0};
	}



	onViewResize (width: number, height: number) {
		canvas3d.width  = width;
		canvas3d.height = height;

		this._camera.left   = -canvas3d.width  / 2;
		this._camera.right  =  canvas3d.width  / 2;
		this._camera.top    =  canvas3d.height / 2;
		this._camera.bottom = -canvas3d.height / 2;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}



	draw () {
		super.draw();
		if (this._camera.zoom != view.zoom) {
			this._camera.zoom = view.zoom;
			this._camera.updateProjectionMatrix();
		}
		this._camera.position.x = view.x;
		this._camera.position.y = view.y;
		this._renderer.render(this._scene, this._camera);
	}



	updateCoords (so: SpaceObject) {
		let pos     = so.position;
		so.draw3d.x = pos.x;
		so.draw3d.y = pos.y;
		so.draw.x   = pos.x;
		so.draw.y   = pos.y;
		//console.log(`(${view.y} * ${v}) + (${pos.y} * ${v}) = ${draw.y}`);
		//console.log(`${draw.x}:${draw.y}`);
	}



	clear () {}



	drawSphere (so: SpaceObject) {
		let mesh = so.draw3d.mesh;
		mesh.position.x = so.draw.x;
		mesh.position.y = so.draw.y;
		//console.log(`${mesh.position.x}:${mesh.position.y}:${mesh.position.z}`);
	}



	drawDisc (so: SpaceObject) {
		let mesh = so.draw3d.mesh;
		mesh.position.x = so.draw.x;
		mesh.position.y = so.draw.y;
		//console.log(`${mesh.position.x}:${mesh.position.y}:${mesh.position.z}`);
	}



	getSpaceObjectDrawComponent (so: SpaceObject): IDraw {
		return so.draw3d;
	}



	updateFocusCoords () {
		objectsTree.process('focus', so => {
			so.focus.x = (canvas3d.width  / 2) - (view.x * view.zoom) + (so.position.x * view.zoom);
			so.focus.y = (canvas3d.height / 2) + (view.y * view.zoom) - (so.position.y * view.zoom);
		});
	}
}



export default draw3DSystem;
