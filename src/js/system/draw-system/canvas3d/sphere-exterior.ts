import {pi2}    from 'utils';
import {Entity} from 'ecs/import';
import {IPositionComponent, ISphere3dComponent} from 'component/import';

import {Exterior} from './exterior';

import * as THREE from 'three';



export class SphereExterior extends Exterior {
	draw (so: Entity) {
		let sphere = so.c('sphere') as ISphere3dComponent;
		let draw   = so.c('draw')   as IPositionComponent;
		let mesh   = sphere.mesh;

		mesh.position.x = draw.x;
		mesh.position.y = draw.y;

		//console.log(`${mesh.position.x}:${mesh.position.y}:${mesh.position.z}`);
	}
}
