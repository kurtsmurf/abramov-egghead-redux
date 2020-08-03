import * as Store from './store.js'

const counter = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'DECREMENT':
            return state -1
        default:
            return state
    }
}

const store = Store.createStore(counter)

document.addEventListener('click', () => {
    store.dispatch({ type: 'INCREMENT' })
})

const Counter = ({ value }) => React.createElement('h1', null, value)

const render = () => {
    ReactDOM.render(
        React.createElement(Counter, {value: store.getState()}, null),
        document.getElementById('root')
    )
}
render();

store.subscribe(render)