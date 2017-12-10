import { bookFlight, OPERATIONS } from './sagas'
import { takeLatest } from 'redux-saga/effects'
import { operationFLow } from '../../operations/opsSaga'
import {flightEditionOperation} from './diffOperations'

export function * bookFlightOperation () {
	const {BOOK_FLIGHT} = OPERATIONS
	yield operationFLow(bookFlight, BOOK_FLIGHT.name, BOOK_FLIGHT.actions, BOOK_FLIGHT.steps)
}

function* publicSagas () {
	yield [
		takeLatest(OPERATIONS.BOOK_FLIGHT.name, bookFlightOperation),
		takeLatest(OPERATIONS.FLIGHT_EDITION.name, flightEditionOperation),
	]
}

export default publicSagas
