export interface IDIC {
	[key:string]: any;
	set (key: string, value: any);
}



export class DIC implements IDIC {
	set (key: string, value: any) {
		if (typeof value === 'function') {
			this._defineFunctionProperty(key, value);
		} else {
			this._defineRealValueProperty(key, value);
		}
	}



	private _defineFunctionProperty (key: string, value: any) {
		let dic = this;
		Object.defineProperty(this, key, {
			configurable: true,
			enumerable:   true,
			get () {
				let realValue = value(dic);
				dic._defineRealValueProperty(key, realValue);
				return realValue;
			}
		});
	}



	private _defineRealValueProperty (key: string, value: any) {
		Object.defineProperty(this, key, {
			configurable: true,
			enumerable:   true,
			value
		});
	}
}
