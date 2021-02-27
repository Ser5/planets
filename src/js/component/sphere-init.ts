import {Entity}  from 'ecs/import';

import {IComponentInit}   from 'ecs/import';
import {ISphereComponent} from './i/isphere-component';



export class SphereInit implements IComponentInit {
	get componentName () { return 'sphere' };



	initComponent (
		{entity,         size,         color}:
		{entity: Entity, size: number, color: string}
	): ISphereComponent {
		return {
			entity,
			size,
			color,
			...{radius: size / 2},
		};
	}
}
