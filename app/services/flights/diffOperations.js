import { put, take, call } from 'redux-saga/effects'
import {builder} from '../../operations/opsSaga'
import {uuid} from '../../operations/helpers'

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
		},
	},
	EDIT_FLIGHT_DATE: {
		name: 'EDIT_FLIGHT_DATE',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_NEW_DATE: 'SELECT_NEW_DATE',
			EDIT_DATE_CONFIRMATION: 'EDIT_FLIGHT_DATE_CONFIRMATION',
			EDIT_FLIGHT_DATE_SUCCESS_HANDLED: 'EDIT_FLIGHT_DATE_SUCCESS_HANDLED',
			EDIT_FLIGHT_DATE_FAILURE_HANDLED: 'EDIT_FLIGHT_DATE_FAILURE_HANDLED',
		},
		actions: {
			cancel: 'EDIT_FLIGHT_DATE_CANCEL',
		},
	},
	SELECT_FLIGHT_MEAL: {
		name: 'SELECT_FLIGHT_MEAL',
		steps: {
			INITIAL: 'INITIAL',
			SELECT_FLIGHT_MEAL: 'SELECT_FLIGHT_MEAL',
			SELECT_FLIGHT_MEAL_CONFIRMATION: 'SELECT_FLIGHT_MEAL_CONFIRMATION',
			SELECT_FLIGHT_MEAL_SUCCESS_HANDLED: 'SELECT_FLIGHT_MEAL_SUCCESS_HANDLED',
			SELECT_FLIGHT_MEAL_FAILURE_HANDLED: 'SELECT_FLIGHT_MEAL_FAILURE_HANDLED',
		},
		actions: {
			cancel: 'SELECT_FLIGHT_MEAL_CANCEL',
		},
	},
}

const FlightService = {
	getFlights: () => ({res: ['To Las Canarias', 'To Aruba']}),
	//getLocations: () => ({error: ['Something Happened :(']}),
}

// ------------------------------------ OPERATIONS ----------------------------------------------------

export function * flightEditionOperation (action) {
	const {FLIGHT_EDITION} = OPERATIONS
	const {steps} = FLIGHT_EDITION
	const {shiftId} = action.payload
	const id = uuid()
	const operation = {
		start: () => put({
			type: 'start_operation',
			payload: {operation: FLIGHT_EDITION.name, id, step: steps.INITIAL, state: {shiftId}, context: []},
		}),
		failure: (error) =>
			put({type: 'failure_operation', payload: {id, context: [], operation: FLIGHT_EDITION.name, error}}),
		updateState: (step, payload = {}) => put(builder(FLIGHT_EDITION.name, [])(id, step, payload)),
		getStep: step => `${step}_${id}`,
	}
	yield call(flightEdition, {id, name: FLIGHT_EDITION.name, steps, operation})
}

export function * mealSelectionOperation (context) {
	const {SELECT_FLIGHT_MEAL} = OPERATIONS
	const {steps} = SELECT_FLIGHT_MEAL
	const name = SELECT_FLIGHT_MEAL.name
	const id = uuid()
	const getStep = step => `${step}_${id}`
	const operation = {
		start: () => put({
			type: 'start_operation',
			payload: {
				operation: name,
				id,
				step: steps.INITIAL,
				state: {},
				context,
			},
		}),
		success: () => put({
			type: 'success_operation', payload: {id, context, operation: name},
		}),
		failure: (error) =>
			put({type: 'failure_operation', payload: {id, context, operation: name, error}}),
		updateState: (step, payload = {}) => put(builder(name, context)(id, step, payload)),
		getStep,
	}
	yield call(mealSelection, {name: name, steps, operation, context})
}

export function * dateEditionOperation (context) {
	const {EDIT_FLIGHT_DATE} = OPERATIONS
	const {steps} = EDIT_FLIGHT_DATE
	const name = EDIT_FLIGHT_DATE.name
	const id = uuid()
	const operation = {
		start: () => put({
			type: 'start_operation',
			payload: {operation: name, step: steps.INITIAL, state: {}, context},
		}),
		failure: (error) =>
			put({type: 'failure_operation', payload: {context, operation: name, error}}),
		updateState: (step, payload = {}) => put(builder(name, context)(step, payload)),
		getStep: step => `${step}_${id}`,
	}
	yield call(dateEdition, {name: name, steps, operation, context})
}

// ------------------------------------ SAGAS ----------------------------------------------------

function * flightEdition ({id, name, steps, operation}) {
	const userDecisionOption = steps.EDIT_FLIGHT_DECISION
	yield operation.start()
	const flights = yield call(FlightService.getFlights)
	if (flights.error) {
		yield operation.failure(flights.error)
	}

	yield operation.updateState(steps.SELECT_FLIGHT, {flights: flights.res})
	yield take(operation.getStep(steps.SELECT_FLIGHT))
	yield operation.updateState(steps.SELECT_OPERATION)

	while (true) {
		const decision = yield take(Object.keys(userDecisionOption).map(s => operation.getStep(s)))
		if (decision.type === operation.getStep(userDecisionOption.EDIT_FLIGHT_DATE_OPERATION)) {
			yield operation.updateState(userDecisionOption.EDIT_FLIGHT_DATE_OPERATION)
			yield call(dateEditionOperation, [id])
		}
		if (decision.type === operation.getStep(userDecisionOption.SELECT_FLIGHT_MEAL_OPERATION)) {
			yield operation.updateState(userDecisionOption.SELECT_FLIGHT_MEAL_OPERATION)
			yield call(mealSelectionOperation, [id])
		}
		yield operation.updateState(steps.SELECT_OPERATION)
	}
}

function * mealSelection ({steps, operation, name, context}) {
	try {
		yield operation.start()
		yield operation.updateState(steps.SELECT_FLIGHT_MEAL)
		yield take(operation.getStep(steps.SELECT_FLIGHT_MEAL))
		yield operation.updateState(steps.SELECT_FLIGHT_MEAL_CONFIRMATION)
		yield take(operation.getStep(steps.SELECT_FLIGHT_MEAL_CONFIRMATION))
		yield operation.success()
		yield take(operation.getStep(steps.SELECT_FLIGHT_MEAL_SUCCESS_HANDLED))
		return yield put({type: 'clean_success_operation', payload: {context, operation: name}})
} catch (error) {
		yield operation.failure({error: 'UNHANDLED ERROR !!!!'})
		yield take(operation.getStep(steps.SELECT_FLIGHT_MEAL_FAILURE_HANDLED))
		return yield put({type: 'clean_failure_operation', payload: {context, operation: name}})
	}
}

function * dateEdition ({operation, steps, context, name}) {
	try {
		yield operation.start()
		yield operation.updateState(steps.SELECT_NEW_DATE)
		yield take(operation.getStep(steps.SELECT_NEW_DATE))
		yield operation.updateState(steps.EDITION_CONFIRMATION)
		yield take(operation.getStep(steps.EDITION_CONFIRMATION))
		yield operation.success()
		yield take(operation.getStep(steps.EDIT_FLIGHT_DATE_SUCCESS_HANDLED))
		return yield put({type: 'clean_success_operation', payload: {context, operation: name}})
	} catch (error) {
		yield operation.failure({error: 'UNHANDLED ERROR !!!!'})
		yield take(operation.getStep(steps.EDIT_FLIGHT_DATE_FAILURE_HANDLED))
		return yield put({type: 'clean_failure_operation', payload: {context, operation: name}})
	}
}
