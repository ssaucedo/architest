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

		/*  {flightComponent}
		 const flightComponent = <Flights
		 BOOK_FLIGHT={BOOK_FLIGHT}
		 {...this.props.bookFlight}
		 triggerAction={triggerAction(dispatch)}/>

		 <FlowTreeGraph step={or(this.props.bookFlight.step, '')} steps={BOOK_FLIGHT.steps}/>
		 */
		return (
			<div>
				<FlightEdition
					FLIGHT_EDITION={FLIGHT_EDITION}
					{...this.props.flightEdition}
					triggerAction={triggerAction(dispatch)}/>
			</div>
		)
	}
}

FlightEditionContainer.propTypes = {
	dispatch: PropTypes.func.isRequired,
	bookFlight: PropTypes.shape({
		operation: PropTypes.object,
		locations: PropTypes.any,
		succeed: PropTypes.object,
		failed: PropTypes.object,
		step: PropTypes.string,
		steps: PropTypes.string,
	}),
	flightEdition: PropTypes.shape({
		operation: PropTypes.object,
		succeed: PropTypes.object,
		failed: PropTypes.object,
		step: PropTypes.string,
		steps: PropTypes.string,
	}),

}

const mapStateToProps = ({operations}) => {
	const bookFlightOperation = or(or(operations.inProgress, {})[OPERATIONS.BOOK_FLIGHT.name], {})
	return {
		bookFlight: {
			...getOperationInfo(OPERATIONS.BOOK_FLIGHT.name, operations),
			locations: equals(bookFlightOperation.step, OPERATIONS.BOOK_FLIGHT.steps.SELECT_ORIGIN) ? bookFlightOperation.state.locations : [],
		},
		flightEdition: {
			...getOperationInfo(OPERATIONS.FLIGHT_EDITION.name, operations),
		},
	}
}

export default connect(mapStateToProps)(FlightEditionContainer)
