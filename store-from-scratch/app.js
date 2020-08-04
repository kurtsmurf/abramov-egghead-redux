import * as Store from './store.js'
import * as Preact from 'https://cdn.jsdelivr.net/npm/preact/dist/preact.mjs'

const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

const store = Store.createStore(counter)
const e = Preact.createElement

const Counter = ({ value, increment, decrement }) => (
  e('div', null,
    e('h1', null, value),
    e('button', { onClick: increment }, '+'),
    e('button', { onClick: decrement }, '-'))
)

const render = () => {
  Preact.render(
    e(
      Counter,
      {
        value: store.getState(),
        increment: () => store.dispatch({ type: 'INCREMENT' }),
        decrement: () => store.dispatch({ type: 'DECREMENT' })
      },
      null
    ),
    document.getElementById('root')
  )
}

render();

store.subscribe(render)