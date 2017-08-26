import 'babel-polyfill' /* Support for IE11 */
import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './generics/store'

const App = () => {
		return (
				<div>{`Check`}</div>
		)
}

const render = () => {
		ReactDOM.render(
		<Provider store={store}>
				<App />
				</Provider>,
				document.getElementById('app')
		)
}

/* prevent FOUC https://stackoverflow.com/a/43902734 */
setTimeout(render, 0)

// setTimeout(() => {
// 		store.dispatch({type: 'fetch_groups'})
// 		store.dispatch({type: 'fetch_users'})
//
// 		setTimeout(() => {
// 				store.dispatch({
// 						type: 'matchWithUsers_groups',
// 						group: {
// 								id: "1",
// 						},
// 				})
//
// 				store.dispatch({
// 						type: 'matchWithUsers_groups',
// 						group: {
// 								id: "2",
// 						},
// 				})
//
//
//
// 				store.dispatch({
// 						type: 'remove_users',
// 						user: {
// 								id: "1",
// 								groups: [1, 2],
// 						},
// 				})
// 		}, 0)
// }, 500)
