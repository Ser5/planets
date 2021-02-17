import {pi2} from 'utils';
import {Entity, ComponentsManager} from 'ecs/import';
import {IPositionComponent, IStillComponent, IOrbitComponent, ISphereComponent, IDiscComponent, IDrawComponent} from 'component/import';



export class ComponentsRegistrator {
	private _componentsManager;

	constructor ({componentsManager}: {componentsManager: ComponentsManager}) {
		this._componentsManager = componentsManager;
	}



	register () {
		let componentsManager = this._componentsManager;

		componentsManager.register('position', function (
			{entity,         x = 0,     y = 0}:
			{entity: Entity, x: number, y: number}
		): IPositionComponent {
			return {entity, x, y};
		});


		componentsManager.register('still', function ({entity}: {entity: Entity}): IStillComponent {
			return {entity};
		});


		componentsManager.register('orbit', function (
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
		});


		componentsManager.register('sphere', function (
			{entity,         size,         color,         emissive}:
			{entity: Entity, size: number, color: string, emissive?: string}
		): ISphereComponent {
			return {
				entity,
				size,
				color,
				emissive,
				...{radius: size / 2},
			};
		});


		componentsManager.register('disc', function (
			{entity,         distance,         size,         color}:
			{entity: Entity, distance: number, size: number, color: string}
		): IDiscComponent {
			return {
				entity,
				distance,
				size,
				color,
			};
		});


		componentsManager.register('draw', function (
			{entity}:
			{entity: Entity}
		): IDrawComponent {
			return {
				entity,
				x:    0,
				y:    0,
				mesh: null,
			};
		});


		componentsManager.register('focus', function ({entity}: {entity: Entity}): IPositionComponent {
			return {entity, x: 0, y: 0};
		});
	}
}
