import {Entity, EntitiesTree} from 'ecs/import';
import {View}                 from 'view';

import {DrawSystemStrategy}   from './draw-system-strategy';
import {IDrawSystemExterior}  from './idraw-system-exterior';

import * as THREE             from 'three';



export class Canvas3d extends DrawSystemStrategy {
	private _scene:    any;
	private _camera:   any;
	private _renderer: any;

	constructor (
		{entitiesTree, exteriors, canvas, view}:
		{
			entitiesTree: EntitiesTree,
			exteriors:    Record<string, IDrawSystemExterior>,
			canvas:       HTMLCanvasElement,
			view:         View,
		}
	) {
		super({entitiesTree, exteriors, canvas, view});

		this._scene  = new THREE.Scene();

		this._camera = new THREE.OrthographicCamera(-200, 200, 100, -100, 1, 2000);
		this._camera.position.z = 200;
		this._scene.add(this._camera);

		this._renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
		});

		let light = new THREE.PointLight(0xffffff, 1, 0, 0);
		light.castShadow = true;
		//light.position.set(100, 100, 100);
		this._scene.add(light);
	}



	get centerX () { return 0 }
	get centerY () { return 0 }
	get vertical() { return 1 }



	/*getComponent (
		{spaceObject}:
		{spaceObject: Entity}
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
		//console.log(geometry, material);

		let mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow    = true;
		mesh.receiveShadow = true;
		this._scene.add(mesh);
		return {spaceObject, mesh, x:0, y:0};
	}*/



	run () {
		super.run();

		let view = this.view;

		if (this._camera.zoom != view.zoom) {
			this._camera.zoom = view.zoom;
			this._camera.updateProjectionMatrix();
		}
		this._camera.position.x = view.x;
		this._camera.position.y = view.y;
		this._renderer.render(this._scene, this._camera);
	}



	onViewResize (width: number, height: number) {
		this._camera.left   = -width  / 2;
		this._camera.right  =  width  / 2;
		this._camera.top    =  height / 2;
		this._camera.bottom = -height / 2;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}



	clear () {}



	/*drawSphere (so: Entity) {
		let mesh = so.draw3d.mesh;
		mesh.position.x = so.draw.x;
		mesh.position.y = so.draw.y;
		//console.log(`${mesh.position.x}:${mesh.position.y}:${mesh.position.z}`);
	}



	drawDisc (so: Entity) {
		let mesh = so.draw3d.mesh;
		mesh.position.x = so.draw.x;
		mesh.position.y = so.draw.y;
		//console.log(`${mesh.position.x}:${mesh.position.y}:${mesh.position.z}`);
	}*/
}
