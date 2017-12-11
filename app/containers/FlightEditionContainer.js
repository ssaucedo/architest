import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { OPERATIONS } from '../services/flights/sagas'
import { getOperationInfo, triggerAction } from '../containers/helpers'
import { or, equals } from 'ramda'
import { FlightEdition } from '../components/FlightEdition'

class FlightEditionContainer extends React.Component {
	render () {
		const {dispatch} = this.props
		const {FLIGHT_EDITION} = OPERATIONS
		const id = this.props.id
		return (
			<div>
				<h2>{id}</h2>
				<FlightEdition
					id={id}
					FLIGHT_EDITION={FLIGHT_EDITION}
					{...this.props.flightEdition}
					triggerAction={triggerAction(id, dispatch)}/>
			</div>
		)
	}
}

FlightEditionContainer.propTypes = {
	dispatch: PropTypes.func.isRequired,
	id: PropTypes.string.isRequired,
	flightEdition: PropTypes.shape({
		operation: PropTypes.object,
		succeed: PropTypes.object,
		failed: PropTypes.object,
		step: PropTypes.string,
		steps: PropTypes.string,
	}),

}

const mapStateToProps = (state, props) => {
	const {id} = props
	return {
		flightEdition: {
			...getOperationInfo(id, OPERATIONS.FLIGHT_EDITION.name, state.operations),
		},
	}
}

export default connect(mapStateToProps)(FlightEditionContainer)
