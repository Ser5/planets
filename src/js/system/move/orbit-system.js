import {ctx, pi2, rtd}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import System      from 'system';



let orbitSystem = new class extends System {
	getComponent ({spaceObject, distance, speed}) {
		let centerDistance = spaceObject.parent.sphere.radius + distance;
		let angle          = Math.random() * pi2;
		let orbitLength    = centerDistance * pi2;
		let orbitPartSize  = speed / orbitLength;
		let moveAngle      = pi2 * orbitPartSize;

		/*console.log(`Расстояние от центра: ${spaceObject.parent.sphere.radius} + ${distance} = ${centerDistance}`);
		console.log(`Начальный угол: ${angle}`);
		console.log(`Длина орбиты: ${orbitLength}`);
		console.log(`Какую часть орбиты объект проходит со скоростью ${speed}: ${orbitPartSize}`);
		console.log(`Сколько радиан объект проходит со скоростью ${speed}: ${moveAngle}`);
		console.log(`В градусах: ${360 * orbitPartSize}`);
		console.log('----------------');*/

		return {
			spaceObject,
			distance,
			speed,
			...{centerDistance, angle, moveAngle}
		};
	}



	move () {
		objectsTree.process('orbit', so => this._move(so));
	}



	_move (so) {
		let orbit = so.orbit;
		//console.log(orbit.moveAngle);
		orbit.angle += orbit.moveAngle;
		if (orbit.angle > pi2) {
			orbit.angle -= pi2;
		}
		this._setCoords(so);
	}



	_setCoords (so) {
		let orbit     = so.orbit;
		let lx        = Math.cos(orbit.angle) * orbit.centerDistance;
		let ly        = Math.sin(orbit.angle) * orbit.centerDistance;
		so.position.x = so.parent.position.x + lx;
		so.position.y = so.parent.position.y + ly;
	}
}();



export default orbitSystem;
