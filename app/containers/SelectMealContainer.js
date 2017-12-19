import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { OPERATIONS } from '../services/flights/sagas'
import {getOperationInfo, triggerAction} from '../containers/helpers'
import SelectMeal from '../components/SelectMeal'

class SelectMealContainer extends React.PureComponent {
	render () {
		const {id, dispatch} = this.props
		return (
			<SelectMeal triggerAction={triggerAction(id, dispatch)} {...this.props.mealSelection}/>
		)
	}
}

SelectMealContainer.propTypes = {
	id: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired,
	context: PropTypes.array,
	mealSelection: PropTypes.object,
}

const mapStateToProps = (state, props) => {
	const {id, context} = props
	console.log('id', id)
	console.log('context', context)
	return {
		mealSelection: {
			...getOperationInfo(id, OPERATIONS.SELECT_FLIGHT_MEAL.name, state.operations, context),
		},
	}
}

export default connect(mapStateToProps)(SelectMealContainer)
