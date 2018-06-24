import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Link from 'redux-first-router-link';
import {getGeneratedWorlds, populateWorldSitesAndPops} from './../../../redux/modules/generatedWorlds';
import {selectInstallGeneratedWorlds, selectInstallPendingGeneratedWorlds, selectInstallErroredGeneratedWorlds} from './../../../redux/modules/sharedSelectors';
import {WorldGenList} from './../../../components/worldGen';
import {bindSelectors} from './../../../redux/selectorUtilities';

class WorldGenPage extends Component {
	static propTypes = {
		getGeneratedWorlds: PropTypes.func.isRequired,
		populateWorldSitesAndPops: PropTypes.func.isRequired,
		generatedWorlds: PropTypes.array.isRequired,
		pendingGeneratedWorlds: PropTypes.array.isRequired,
		erroredGeneratedWorlds: PropTypes.array.isRequired
	}

	componentWillMount() {
		this.props.getGeneratedWorlds();
		this.props.populateWorldSitesAndPops();
	}

	render() {
		return (
			<div>
				<Link to="/worldgen/gen-new-world">Generate New Worlds</Link>
				<WorldGenList
					generatedWorlds={this.props.generatedWorlds}
					pendingGeneratedWorlds={this.props.pendingGeneratedWorlds}
					erroredGeneratedWorlds={this.props.erroredGeneratedWorlds}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => bindSelectors({
	generatedWorlds: selectInstallGeneratedWorlds,
	pendingGeneratedWorlds: selectInstallPendingGeneratedWorlds,
	erroredGeneratedWorlds: selectInstallErroredGeneratedWorlds
}, state);

const mapDispatchToProps = (dispatch) => bindActionCreators({getGeneratedWorlds, populateWorldSitesAndPops}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WorldGenPage);
