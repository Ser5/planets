import SpaceObject       from 'space-object';
import componentsFactory from 'components-factory';



let spaceObjectsManager = new class {
	create (
		{parent = null,        components = {}}:
		{parent?: SpaceObject, components?: object}
	): SpaceObject
	{
		let spaceObject = new SpaceObject();

		if (parent) {
			parent.addChild(spaceObject);
			spaceObject.parent = parent;
		}

		for (let [name, data] of Object.entries(components)) {
			let c = componentsFactory.get(name, {...data, spaceObject});
			spaceObject.setComponent(name, c);
			//componentsFactory.init(spaceObject, name);
		}

		return spaceObject;
	}
}();



export default spaceObjectsManager;