import React, {Fragment} from 'react';
import {FelaComponent} from 'react-fela';
import PropTypes from 'prop-types';

export default function Styler({children, style, rule, ...otherProps}) {
	return (
		<FelaComponent
			style={style}
			rule={rule}
			render={({className, theme}) => (
				<Fragment>
					{children({className, theme})}
				</Fragment>
			)}
			{...otherProps}
		/>
	);
}

Styler.propTypes = {
	children: PropTypes.func.isRequired,
	style: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
	rule: PropTypes.func
};

Styler.defaultProps = {
	style: {},
	rule: undefined
};
