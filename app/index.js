import 'babel-polyfill'
/* Support for IE11 */
import React from 'react'
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom'
import store from './generics/store'
// import FlightEditionContainer from './containers/FlightEditionContainer'
import OperationsContainer from './containers/OperationsContainer'

/*
 * If given more time, this should be separated into different
 * views instead a monolithic component
 * */
class App extends React.PureComponent {
	render () {
		return (
			<div>
				<OperationsContainer/>
			</div>
		)
	}
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
