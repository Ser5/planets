import positionSystem from 'system/position-system';
import stillSystem    from 'system/move/still-system';
import orbitSystem    from 'system/move/orbit-system';
import sphereSystem   from 'system/exterior/sphere-system';
import discSystem     from 'system/exterior/disc-system';



let componentsFactory = new class {
	constructor () {
		this.position = positionSystem;
		this.still    = stillSystem;
		this.orbit    = orbitSystem;
		this.sphere   = sphereSystem;
		this.disc     = discSystem;
	}



	get (name, data) {
		return this[name].getComponent(data);
	}




	/*init (spaceObject, componentName) {
		return this[componentName].init(spaceObject);
	}*/
}();



export default componentsFactory;
