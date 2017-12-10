import { put, take, call } from 'redux-saga/effects'
import {builder} from '../../operations/opsSaga'

export const OPERATIONS = {
	FLIGHT_EDITION: {
		name: 'FLIGHT_EDITION',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_FLIGHT: 'SELECT_FLIGHT',
			SELECT_OPERATION: 'SELECT_OPERATION',
			EDIT_FLIGHT_DECISION: {
				EDIT_FLIGHT_DATE_OPERATION: 'EDIT_FLIGHT_DATE_OPERATION',
				SELECT_FLIGHT_MEAL_OPERATION: 'SELECT_FLIGHT_MEAL_OPERATION',
			},
		},
		actions: {
			cancel: 'FLIGHT_EDITION_CANCEL',
			success: 'FLIGHT_EDITION_SUCCESS',
			failure: 'FLIGHT_EDITION_FAILURE',
			successHandled: 'FLIGHT_EDITION_SUCCESS_HANDLED',
			failureHandled: 'FLIGHT_EDITION_FAILURE_HANDLED',
		},
	},
	EDIT_FLIGHT_DATE: {
		name: 'EDIT_FLIGHT_DATE',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_NEW_DATE: 'SELECT_NEW_DATE',
			EDIT_DATE_CONFIRMATION: 'EDIT_FLIGHT_DATE_CONFIRMATION',
		},
		actions: {
			cancel: 'EDIT_FLIGHT_DATE_CANCEL',
			success: 'EDIT_FLIGHT_DATE_SUCCESS',
			failure: 'EDIT_FLIGHT_DATE_FAILURE',
			successHandled: 'EDIT_FLIGHT_DATE_SUCCESS_HANDLED',
			failureHandled: 'EDIT_FLIGHT_DATE_FAILURE_HANDLED',
		},
	},
	SELECT_FLIGHT_MEAL: {
		name: 'SELECT_FLIGHT_MEAL',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_FLIGHT_MEAL: 'SELECT_FLIGHT_MEAL',
			SELECT_FLIGHT_MEAL_CONFIRMATION: 'SELECT_FLIGHT_MEAL_CONFIRMATION',
		},
		actions: {
			cancel: 'SELECT_FLIGHT_MEAL_CANCEL',
			success: 'SELECT_FLIGHT_MEAL_SUCCESS',
			failure: 'SELECT_FLIGHT_MEAL_FAILURE',
			successHandled: 'SELECT_FLIGHT_MEAL_SUCCESS_HANDLED',
			failureHandled: 'SELECT_FLIGHT_MEAL_FAILURE_HANDLED',
		},
	},
}

const FlightService = {
	getFlights: () => ({res: ['To Las Canarias', 'To Aruba']}),
	//getLocations: () => ({error: ['Something Happened :(']}),
}

export function * flightEditionOperation (action) {
	const {FLIGHT_EDITION} = OPERATIONS
	const {steps} = FLIGHT_EDITION
	const {shiftId} = action.payload
	const operation = {
		start: () => put({
			type: 'start_operation',
			payload: {operation: FLIGHT_EDITION.name, step: steps.INITIAL, state: {shiftId}, context: []},
		}),
		failure: (error) =>
			put({type: 'failure_operation', payload: {context: [], operation: FLIGHT_EDITION.name, error}}),
		updateState: (step, payload = {}) => put(builder(FLIGHT_EDITION.name, [])(step, payload)),
	}
	yield call(flightEdition, {name: FLIGHT_EDITION.name, steps, operation})
}

export function * mealSelectionOperation (context) {
	const {SELECT_FLIGHT_MEAL} = OPERATIONS
	const {steps} = SELECT_FLIGHT_MEAL
	const name = SELECT_FLIGHT_MEAL.name
	const operation = {
		start: () => put({
			type: 'start_operation',
			payload: {operation: name, step: steps.INITIAL, state: {}, context},
		}),
		success: () => put({
			type: 'success_operation', payload: {context, operation: name},
		}),
		failure: (error) =>
			put({type: 'failure_operation', payload: {context, operation: name, error}}),
		updateState: (step, payload = {}) => put(builder(name, context)(step, payload)),
	}
	yield call(mealSelection, {name: name, steps, operation})
}

export function * dateEditionOperation (context) {
	const {EDIT_FLIGHT_DATE} = OPERATIONS
	const {steps} = EDIT_FLIGHT_DATE
	const name = EDIT_FLIGHT_DATE.name
	const operation = {
		start: () => put({
			type: 'start_operation',
			payload: {operation: name, step: steps.INITIAL, state: {}, context},
		}),
		success: () => put({
			type: 'success_operation', payload: {context, operation: name},
		}),
		failure: (error) =>
			put({type: 'failure_operation', payload: {context, operation: name, error}}),
		updateState: (step, payload = {}) => put(builder(name, context)(step, payload)),
	}
	yield call(dateEdition, {name: name, steps, operation})
}

function * flightEdition ({name, steps, operation}) {
	const userDecisionOption = steps.EDIT_FLIGHT_DECISION
	yield operation.start()
	const flights = yield call(FlightService.getFlights)
	if (flights.error) {
		yield operation.failure(flights.error)
	}

	yield operation.updateState(steps.SELECT_FLIGHT, {flights: flights.res})
	yield take(steps.SELECT_FLIGHT)
	yield operation.updateState(steps.SELECT_OPERATION)

	while (true) {
		const decision = yield take(Object.keys(userDecisionOption))
		yield operation.updateState(decision.type)
		if (decision.type === userDecisionOption.EDIT_FLIGHT_DATE_OPERATION) {
			yield call(dateEditionOperation, [name])
		}
		if (decision.type === userDecisionOption.SELECT_FLIGHT_MEAL_OPERATION) {
			yield call(mealSelectionOperation, [name])
		}
		yield operation.updateState(steps.SELECT_OPERATION)
	}
}

function * mealSelection ({steps, operation}) {
	try {
		yield operation.start()
		yield operation.updateState(steps.SELECT_FLIGHT_MEAL)
		yield take(steps.SELECT_FLIGHT_MEAL)
		yield operation.updateState(steps.SELECT_FLIGHT_MEAL_CONFIRMATION)
		yield take(steps.SELECT_FLIGHT_MEAL_CONFIRMATION)
		yield operation.success()
	} catch (error) {
		yield operation.failure({error: 'UNHANDLED ERROR !!!!'})
	}
}

function * dateEdition ({operation, steps}) {
	try {
		yield operation.start()
		yield operation.updateState(steps.SELECT_NEW_DATE)
		yield take(steps.SELECT_NEW_DATE)

		yield operation.updateState(steps.EDITION_CONFIRMATION)
		yield take(steps.EDITION_CONFIRMATION)
		yield operation.success()
	} catch (error) {
		yield operation.failure({error: 'UNHANDLED ERROR !!!!'})
	}
}
