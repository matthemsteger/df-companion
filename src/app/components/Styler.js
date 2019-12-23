import React, {Fragment} from 'react';
import {FelaComponent} from 'react-fela';
import PropTypes from 'prop-types';
import {combineMultiRules} from 'fela-tools';
import {curry, map} from 'ramda';

const generateClassNames = curry((styles, props, renderer, theme) => {
	if (!styles) return undefined;

	const combinedRules = combineMultiRules(...[styles]);
	const preparedRules = combinedRules({theme, ...props}, renderer);
	return map(
		(rule) => renderer.renderRule(rule, {...props, theme}),
		preparedRules
	);
});

export default function Styler(
	{children, style, styles, rule, ...otherProps},
	{renderer}
) {
	const makeClassNames = generateClassNames(styles, otherProps, renderer);

	return (
		<FelaComponent
			style={style}
			rule={rule}
			render={({className, theme}) => (
				<Fragment>
					{children({
						className,
						theme,
						classNames: makeClassNames(theme)
					})}
				</Fragment>
			)}
			{...otherProps}
		/>
	);
}

Styler.propTypes = {
	children: PropTypes.func.isRequired,
	style: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	styles: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	rule: PropTypes.func
};

Styler.contextTypes = {
	renderer: PropTypes.object.isRequired
};

Styler.defaultProps = {
	style: {},
	styles: undefined,
	rule: undefined
};
