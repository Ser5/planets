import {Entity}  from 'ecs/import';

import {ISphereComponent}   from './i/isphere-component';
import {ISphere3dComponent} from './i/isphere3d-component';
import {SphereInit}         from './sphere-init';
import {exterior3dHelper}   from './exterior3d-helper';

import * as THREE from 'three';



export class Sphere3dInit extends SphereInit {
	private _scene;

	constructor ({scene}) {
		super();
		this._scene = scene;
	}



	initComponent (
		{entity,         size,         color,         emissive}:
		{entity: Entity, size: number, color: string, emissive?: string}
	): ISphere3dComponent {
		let sphere       = super.initComponent({entity, size, color});
		let meshGeometry = new THREE.SphereGeometry(sphere.radius, 16, 16);
		let sphere3d     =  exterior3dHelper.add3dData({exterior: sphere, scene: this._scene, color, emissive, meshGeometry}) as ISphere3dComponent;

		return sphere3d;
	}
}
