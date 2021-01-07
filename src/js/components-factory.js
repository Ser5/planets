import positionSystem from 'system/position-system';
import orbitSystem    from 'system/move/orbit-system';
import sphereSystem   from 'system/exterior/sphere-system';



let componentsFactory = new class {
	constructor () {
		this.position = positionSystem;
		this.orbit    = orbitSystem;
		this.sphere   = sphereSystem;
	}



	get (name, data) {
		return this[name].getComponent(data);
	}
}();



export default componentsFactory;
