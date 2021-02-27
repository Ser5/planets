import {Entity}  from 'ecs/import';

import {DiscInit}         from './disc-init';
import {IDiscComponent}   from './i/idisc-component';
import {IDisc3dComponent} from './i/idisc3d-component';
import {ISphereComponent} from './i/isphere-component';
import {exterior3dHelper} from './exterior3d-helper';

import * as THREE from 'three';



export class Disc3dInit extends DiscInit {
	private _scene;

	constructor ({scene}) {
		super();
		this._scene = scene;
	}



	initComponent (
		{entity,         distance,         size,         color,         emissive}:
		{entity: Entity, distance: number, size: number, color: string, emissive?: string}
	): IDisc3dComponent {
		let disc         = super.initComponent({entity, distance, size, color});
		let parentSphere = entity.parent.c('sphere') as ISphereComponent;

		let innerRadius  = parentSphere.radius + disc.distance;
		let outerRadius  = innerRadius + disc.size;

		let meshGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 16);
		let sphere3d     =  exterior3dHelper.add3dData({exterior: disc, scene: this._scene, color, emissive, meshGeometry}) as IDisc3dComponent;

		return sphere3d;
	}
}
