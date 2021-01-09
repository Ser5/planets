import SpaceObject from 'space-object';

interface ICallback {
	(so: SpaceObject);
};



let objectsTree = new class {
	public root: SpaceObject;

	constructor () {
		this.root = null;
	}

	process (componentFilter: string|false, callback: ICallback) {
		//console.log(this.root);
		this._process(componentFilter, this.root, callback);
	}

	_process (componentFilter: string|false, spaceObject: SpaceObject, callback: ICallback) {
		if (!componentFilter || spaceObject[componentFilter]) {
			callback(spaceObject);
		}
		if (spaceObject.children.length) {
			for (let so of spaceObject.children) {
				this._process(componentFilter, so, callback);
			}
		}
	}
}();



export default objectsTree;
