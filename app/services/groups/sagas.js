import {normalize, removeManagerExtended} from '../helpers'
import {put, select} from 'redux-saga/effects'
import {validateGroup, assingUsersToGroup, matchWithGroupsHelper} from './helpers'

export function* create ({group}) {
		try {
				yield put({type: 'create_groups_start'})
				const groupValidated = validateGroup(group)
				/* if we get here, all good! */
				yield put({
						type: 'create_groups_success',
						payload: normalize([groupValidated]),
				})
		} catch (error) {
				yield put({type: 'create_groups_error', error: error.message})
		}
}

export function* remove ({group}) {
		try {
				yield put({type: 'remove_groups_start'})
				const state = yield select(({groups}) => groups)
				const listUpdated = removeManagerExtended(state)(group)

				yield put({
						type: 'remove_groups_success',
						payload: normalize(Object.values(listUpdated)),
				})
		} catch (error) {
				yield put({type: 'remove_groups_error', error: error.message})
		}
}

/* group -> a group object */
export function* matchWithUsers ({group}) {
		/* I saw (and thought) about this at very last...
		*  interesting cause this looks like real life where designers
		*  just think they can throw requirements and they happen by magic ¯\_(ツ)_/¯
		*  -
		*  Said this, there is not need to this operation if we don't have to,
		*  so we can limit this only when a user visit this group page...
		* */
		try {
				yield put({type: 'matchWithUsers_groups_start'})
				const {data} = yield select(({users}) => users)
				const {id} = group

				const usersOfThisGroups = Object.values(data)
				.filter(user => {
						return user.groups.indexOf(parseInt(id)) !== -1
				})
				.map(user => {
						return user.id
				})

				/* we update the state so we don't have to do this again */
				const groups = yield select(({groups}) => groups)
				const thisGroup = groups['data'][id]
				const addUsersToGroup = assingUsersToGroup(thisGroup, usersOfThisGroups)
				yield put({
						type: 'matchWithUsers_groups_success',
						payload: normalize([addUsersToGroup]),
				})
		} catch (error) {
				yield put({type: 'matchWithUsers_groups_error', error: error.message})
		}
}

/* the groups, find those with users lists, add the user id
	* users => id & groups
	* groups state
	* -
	* Possible Tech debt...
	* */
export function* matchWithGroups (user) {
		yield put({type: 'addUserToGroupsList_groups_start'})
		const groups = yield select(({groups}) => groups)

		const nextGroups = matchWithGroupsHelper(user, groups)

		yield put({type: 'addUserToGroupsList_groups_success', payload: normalize(nextGroups)})
}
