import System         from 'system';
import positionSystem from 'system/position-system';
import stillSystem    from 'system/move/still-system';
import orbitSystem    from 'system/move/orbit-system';
import sphereSystem   from 'system/exterior/sphere-system';
import discSystem     from 'system/exterior/disc-system';



let componentsFactory = new class {
	private position: System;
	private still:    System;
	private orbit:    System;
	private sphere:   System;
	private disc:     System;

	constructor () {
		this.position = positionSystem;
		this.still    = stillSystem;
		this.orbit    = orbitSystem;
		this.sphere   = sphereSystem;
		this.disc     = discSystem;
	}



	get (name: string, data: object) {
		return this[name].getComponent(data);
	}
}();



export default componentsFactory;
