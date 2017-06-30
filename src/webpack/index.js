import path from 'path';
import _ from 'lodash';
import webpack from 'webpack';
import {spawn} from 'child_process';
import {dependencies as externals} from './../../package.json';

const {PORT: port, START_HOT: startHot} = process.env;
const publicPath = `http://localhost:${port}/`;

export default async function webpackConfiguration() {
	return {
		target: 'electron-renderer',
		entry: [
			'babel-polyfill',
			// 'react-hot-loader/patch',
			`webpack-dev-server/client?http://localhost:${port}`,
			'webpack/hot/only-dev-server',
			path.join(__dirname, '../app/index.js')
		],
		output: {
			filename: 'bundle.js',
			path: path.resolve(__dirname, '../../build'),
			publicPath
		},
		devtool: 'inline-source-map',
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					use: [
						'babel-loader'
					],
					exclude: /node_modules/
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
					test: /\.(eot|svg|ttf|woff|woff2)$/,
					use: [
						{loader: 'file-loader'}
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
			setup() {
				if (startHot) {
					spawn('npm', ['run', 'start-dev-electron'], {shell: true, env: process.env, stdio: 'inherit'})
						.on('close', (code) => process.exit(code))
						.on('error', (err) => console.error(err)); // eslint-disable-line no-console
				}
			}
		}
	};
}
