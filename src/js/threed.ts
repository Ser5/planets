import * as THREE from 'three';



export class Threed {
	private _scene;
	private _renderer;

	constructor (
		{canvas}:
		{canvas: HTMLCanvasElement}
	) {
		this._scene  = new THREE.Scene();

		this._renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true,
		});
	}



	get scene ()    { return this._scene    }
	get renderer () { return this._renderer }
}
