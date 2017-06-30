import _ from 'lodash';

export function createStyleToProps(plainStyleObj = {}) {
	return () => (renderer) =>
		_.transform(plainStyleObj, (styleObj, rule, styleClass) => {
			styleObj[styleClass] = renderer.renderRule(() => rule); // eslint-disable-line no-param-reassign
		});
}
