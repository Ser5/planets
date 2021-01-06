let objectsTree = new class {
	constructor () {
		this.root = null;
	}

	process (componentFilter, callback) {
		//console.log(this.root);
		this._process(componentFilter, this.root, callback);
	}

	_process (componentFilter, spaceObject, callback) {
		if (componentFilter && spaceObject[componentFilter]) {
			callback(spaceObject);
		}
		if (spaceObject.children.length) {
			for (let so of spaceObject.children) {
				this._process(so, callback);
			}
		}
	}
}();



export default objectsTree;
