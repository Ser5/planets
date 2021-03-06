import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript    from '@rollup/plugin-typescript';

export default {
	input: 'src/js/main.ts',
	external: [
		'three',
	],
	output: {
		file:   'dist/bundle.js',
		format: 'iife',
		globals: {
			three: 'THREE',
		},
	},
	watch: {},
	plugins: [
		nodeResolve({
			moduleDirectories: ['src/js/'],
			extensions:        ['.js', '.ts']
		}),
		typescript({
			include: [
				//'.js',       '.ts',
				'./**/*.js', './**/*.ts',
			],
			exclude: [
				'./dist/**/*',
			],
		}),
	]
};
