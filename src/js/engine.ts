import {IStrategist}     from 'istrategist';
import {IEngineStrategy} from 'iengine-strategy';



export class Engine implements IStrategist {
	private _strategies:     Record<string,IEngineStrategy> = {};
	private _activeStrategy: IEngineStrategy                = null;

	constructor (
		{strategies}:
		{strategies: Record<string,IEngineStrategy>}
	) {
		this._strategies = strategies;
	}



	setStrategy (name: string) {

	}
}
