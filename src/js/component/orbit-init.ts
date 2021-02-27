import {Entity}  from 'ecs/import';

import {IComponentInit}   from 'ecs/import';
import {IOrbitComponent}  from './i/iorbit-component';
import {ISphereComponent} from './i/isphere-component';

import {pi2} from 'utils';



export class OrbitInit implements IComponentInit {
	get componentName () { return 'orbit' };



	initComponent (
		{entity,         distance = 0,     speed = 0}:
		{entity: Entity, distance: number, speed: number}
	): IOrbitComponent {
		let centerDistance = (entity.parent.c('sphere') as ISphereComponent).radius + distance;
		let angle          = Math.random()  * pi2;
		let orbitLength    = centerDistance * pi2;
		let orbitPartSize  = speed / orbitLength;
		let moveAngle      = pi2   * orbitPartSize;

		/*console.log(`Расстояние от центра: ${entity.parent.sphere.radius} + ${distance} = ${centerDistance}`);
		console.log(`Начальный угол: ${angle}`);
		console.log(`Длина орбиты: ${orbitLength}`);
		console.log(`Какую часть орбиты объект проходит со скоростью ${speed}: ${orbitPartSize}`);
		console.log(`Сколько радиан объект проходит со скоростью ${speed}: ${moveAngle}`);
		console.log(`В градусах: ${360 * orbitPartSize}`);
		console.log('----------------');*/

		return {
			entity,
			distance,
			speed,
			...{centerDistance, angle, moveAngle}
		};
	}
}
