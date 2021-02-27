import {ComponentsManager} from 'ecs/components-manager';
import * as c              from 'component/import';



export class ComponentsInitializer {
	private _componentsManager: ComponentsManager;
	private _scene:             any;

	constructor (
		{componentsManager,                    scene}:
		{componentsManager: ComponentsManager, scene: any})
	{
		this._componentsManager = componentsManager;
		this._scene             = scene;
	}



	init () {
		this._componentsManager.registerInitializersList([
			new c.PositionInit(),
			new c.StillInit(),
			new c.OrbitInit(),
			new c.Sphere3dInit({scene: this._scene}),
			new c.Disc3dInit(  {scene: this._scene}),
			new c.DrawInit(),
		]);
	}
}
