import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getInProgressOperations, triggerAction } from '../containers/helpers'
import { OPERATIONS } from '../services/flights/sagas'
import FlightEditionContainer from '../containers/FlightEditionContainer'

const {FLIGHT_EDITION} = OPERATIONS

class OperationsContainer extends React.Component {
	render () {
		return (
			<div>
				<div>
					<button
						onClick={() => this.props.dispatch({type: FLIGHT_EDITION.name, payload: {}})}>{FLIGHT_EDITION.name}</button>
				</div>
				{Object.values(this.props.inProgress).map((p, k) =>
					<FlightEditionContainer dispatch={this.props.dispatch} id={p.id} key={k}/>
				)}
			</div>
		)
	}
}
OperationsContainer.propTypes = {
	inProgress: PropTypes.object,
}

const mapStateToProps = (state) => ({
	inProgress: getInProgressOperations(state),
})

export default connect(mapStateToProps)(OperationsContainer)
