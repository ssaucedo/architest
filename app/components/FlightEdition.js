import React from 'react'
import PropTypes from 'prop-types'
import { equals, isEmpty } from 'ramda'
import './style.css'
import { EditFlight } from './EditFlight'
import SelectMealContainer from '../containers/SelectMealContainer'

export const FlightEdition = props => {
	const {id, step, steps, triggerAction, operation, FLIGHT_EDITION} = props
	const {SELECT_FLIGHT, SELECT_OPERATION, EDIT_FLIGHT_DECISION} = steps
	const {EDIT_FLIGHT_DATE_OPERATION, SELECT_FLIGHT_MEAL_OPERATION} = EDIT_FLIGHT_DECISION
	const {children} = operation
	const inProgress = !isEmpty(operation)
	return (
		<div>
			<div className='commands-container blue'>
				<div className='commands'>
					{ !inProgress &&
					<div>
						<button onClick={() => triggerAction(FLIGHT_EDITION.name, {})}>{FLIGHT_EDITION.name}</button>
					</div>
					}
					{
						equals(step, SELECT_FLIGHT) &&
						<div>
							<div>
								<button onClick={() => triggerAction(SELECT_FLIGHT, {})}>{SELECT_FLIGHT}</button>
							</div>
						</div>
					}
					{
						equals(step, SELECT_OPERATION) &&
						<div>
							<div>
								<button
									onClick={() => triggerAction(EDIT_FLIGHT_DATE_OPERATION, {})}>{EDIT_FLIGHT_DATE_OPERATION}</button>
								<button
									onClick={() => triggerAction(SELECT_FLIGHT_MEAL_OPERATION, {})}>{SELECT_FLIGHT_MEAL_OPERATION}</button>
							</div>
						</div>
					}
					{
						equals(step, EDIT_FLIGHT_DATE_OPERATION) &&
						<div>
							<EditFlight context={[FLIGHT_EDITION.name]}/>
						</div>
					}
					{
						equals(step, SELECT_FLIGHT_MEAL_OPERATION) &&
						<div>
							{
								Object.keys(children.inProgress).map((cid, ckey) =>
									<SelectMealContainer key={ckey} id={cid} context={[id]}/>
								)
							}
						</div>
					}
					{ inProgress &&
					<div className='cancel'>
						<button onClick={() => triggerAction(FLIGHT_EDITION.actions.cancel, {})}>{'Cancel flight edition'}</button>
					</div>
					}
				</div>
			</div>
		</div>
	)
}

FlightEdition.propTypes = {
	id: PropTypes.string.isRequired,
	FLIGHT_EDITION: PropTypes.object,
	step: PropTypes.string,
	steps: PropTypes.object,
	triggerAction: PropTypes.func,
	operation: PropTypes.object,
}
