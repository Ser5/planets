import {ctx, pi2}  from 'init';
import objectsTree from 'objects-tree';
import view        from 'view';
import System      from 'system';



let orbitSystem = new class extends System {
	getComponent ({spaceObject, distance, speed}) {
		return {
			spaceObject,
			distance,
			speed,
			...{centerDistance: 0, angle: 0, moveAngle: 0}
		};
	}



	initValues (so) {
		let centerDistance = so.parent.sphere.radius + so.orbit.distance;
		let angle          = Math.random() * pi2;
		let orbitLength    = centerDistance * pi2;
		let orbitPartSize  = orbitLength / so.orbit.speed;
		let moveAngle      = pi2 / orbitPartSize;

		so.orbit = {...so.orbit, centerDistance, angle, moveAngle};
	}



	move () {
		objectsTree.process('orbit', so => this._move(so));
	}



	_move (so) {
		let orbit = so.orbit;
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
