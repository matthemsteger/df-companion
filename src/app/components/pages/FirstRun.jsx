import React from 'react';
import {back} from 'redux-first-router';
import R from 'ramda';
import {createComponent} from 'react-fela';
import CreateInstallContainer from './../containers/CreateInstallContainer';
import Styler from './../Styler';

const CreateInstallFormHeading = createComponent(R.always({}), 'h1');

const style = {
	display: 'grid'
};

export default function FirstRun() {
	return (
		<Styler style={style}>
			{({className}) => (
				<section className={className}>
					<div>
						<CreateInstallContainer onSave={back}>
							<CreateInstallFormHeading>
								Add your first Dwarf Fortress installation
							</CreateInstallFormHeading>
						</CreateInstallContainer>
					</div>
				</section>
			)}
		</Styler>
	);
}
