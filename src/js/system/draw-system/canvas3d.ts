import {Entity, EntitiesTree} from 'ecs/import';
import {View}                 from 'view';

import {DrawSystemStrategy} from './draw-system-strategy';
import {TExteriors}         from './texteriors';

import * as THREE from 'three';



export class Canvas3d extends DrawSystemStrategy {
	private _scene:    any;
	private _camera:   any;
	private _renderer: any;

	private _componentInitParams;

	constructor (
		{entitiesTree, exteriors, canvas, view}:
		{
			entitiesTree: EntitiesTree,
			exteriors:    TExteriors,
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

		this._componentInitParams = {scene: this._scene};
	}



	get centerX () { return 0 }
	get centerY () { return 0 }
	get vertical() { return 1 }



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



	getComponentInitParams () {
		return this._componentInitParams;
	}



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
