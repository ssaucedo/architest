import {or, path, when, isEmpty, always} from 'ramda'
import { OPERATIONS } from '../services/flights/sagas'
import {getRoute} from '../operations/opsReducers'

export const getInProgressOperations = (state) => state.operations.inProgress

export const getOperationInfo = (id, operationName, state, context = []) => {
	const contextObject = when(isEmpty, always({
		inProgress: {},
		failed: {},
		succeed: {},
	}))(path(getRoute(context), state))
	return {
		operation: or(contextObject.inProgress[id], {}),
		succeed: or(contextObject.succeed[id], false),
		failed: or(contextObject.failed[id], false),
		step: or(or(contextObject.inProgress[id], {}).step, ''),
		steps: or(OPERATIONS[operationName].steps, {}),
		actions: or(OPERATIONS[operationName].actions, {}),
	}
}

export const triggerAction = (id, dispatch) => (type, payload) => {
	dispatch({type: `${type}_${id}`, payload})
}
