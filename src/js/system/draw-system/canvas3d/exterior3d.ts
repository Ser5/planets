import {IComponent, Entity} from 'ecs/import';
import {IPositionComponent, IExterior3dComponent} from 'component/import';

import {DrawSystemExterior}  from '../draw-system-exterior';



export abstract class Exterior3d extends DrawSystemExterior {
	draw (so: Entity) {
		let cName = this.exteriorComponentName;
		let ext   = so.c(cName)  as IExterior3dComponent;
		let draw  = so.c('draw') as IPositionComponent;
		let mesh  = ext.mesh;

		mesh.position.x = draw.x;
		mesh.position.y = draw.y;

		//console.log(`${mesh.position.x}:${mesh.position.y}:${mesh.position.z}`);
	}



	protected abstract get exteriorComponentName (): string;
}
