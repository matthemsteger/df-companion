import path from 'path';
import _ from 'lodash';
import webpack from 'webpack';
import {spawn} from 'child_process';
import {dependencies as externals} from './../../package.json';

const {PORT: port, START_HOT: startHot} = process.env;
const publicPath = `http://localhost:${port}/`;

export default [
	{
		mode: 'none',
		target: 'electron-renderer',
		entry: {
			bundle: [
				'babel-polyfill',
				// 'react-hot-loader/patch',
				`webpack-dev-server/client?http://localhost:${port}`,
				'webpack/hot/only-dev-server',
				path.join(__dirname, '../app/index.js')
			]
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, '../../build'),
			publicPath
		},
		devtool: 'inline-source-map',
		resolve: {
			extensions: ['*', '.js', '.jsx', '.json']
		},
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[
										'env',
										{
											targets: {electron: '1.6.10'},
											useBuiltIns: true,
											modules: false
										}
									],
									'react'
								],
								plugins: [
									'transform-class-properties',
									'transform-object-rest-spread'
								],
								babelrc: false
							}
						}
					],
					exclude: [/node_modules/, /df-tools/, /formik/]
				},
				{
					test: /\.scss$/,
					use: [
						{loader: 'style-loader'},
						{loader: 'css-loader'},
						{loader: 'sass-loader'}
					]
				},
				{
					test: /\.(eot|ttf|woff|woff2)$/,
					use: [{loader: 'file-loader'}]
				},
				{
					test: /\.svg$/,
					use: [
						{
							loader: 'babel-loader'
						},
						{
							loader: 'react-svg-loader',
							options: {
								jsx: true
							}
						}
					]
				}
			]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),
			new webpack.NoEmitOnErrorsPlugin(),
			new webpack.ExternalsPlugin('commonjs', _.keys(externals || {}))
		],
		devServer: {
			port,
			publicPath,
			hot: true,
			headers: {'Access-Control-Allow-Origin': '*'},
			contentBase: path.resolve(__dirname, '../../build'),
			historyApiFallback: {
				verbose: true,
				disableDotRule: false
			},
			before() {
				if (startHot) {
					spawn('npm', ['run', 'start-dev-electron'], {
						shell: true,
						env: process.env,
						stdio: 'inherit'
					})
						.on('close', (code) => process.exit(code))
						.on('error', (err) => console.error(err)); // eslint-disable-line no-console
				}
			}
		}
	}
];
