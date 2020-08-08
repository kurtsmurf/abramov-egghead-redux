// Redux substitute
const createStore = reducer => {
  let state
  let listeners = []

  const getState = () => state

  const dispatch = action => {
    console.log(action)
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  const subscribe = listener => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  dispatch({})

  return { getState, dispatch, subscribe }
}

// Reducers

const todo = (state, action) => {
  switch (action.type) {
    case ('ADD_TODO'):
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case ('TOGGLE_TODO'):
      return {
        ...state,
        completed: !state.completed
      }
    default:
      return state
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case ('ADD_TODO'):
      return [...state, todo(undefined, action)]
    case ('REMOVE_TODO'):
      return state.filter(t => {
        return t.id !== action.id
      })
    case ('TOGGLE_TODO'):
      return state.map(t => {
        return t.id !== action.id ? t : todo(t, action)
      })
    default:
      return state
  }
}

const viewFilter = (state = 'VIEW_ALL', action) => {
  switch (action.type) {
    case ('VIEW_ALL'):
    case ('VIEW_COMPLETED'):
    case ('VIEW_NOT_COMPLETED'):
      return action.type
    default: return state
  }
}

const todosApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    viewFilter: viewFilter(state.viewFilter, action)
  }
}

// The store

const store = createStore(todosApp)

store.subscribe(() => {
  console.log(JSON.stringify(store.getState(), null, 2))
})

// Helper functions

const addTodo = (
  () => {
    let id = 0
    return text => {
      store.dispatch({
        type: 'ADD_TODO',
        id: id++,
        text: text
      })
    }
  }
)()

const removeTodo = id => {
  store.dispatch({ type: 'REMOVE_TODO', id })
}

const getTodos = () => {
  let filter

  switch (store.getState().viewFilter) {
    case ('VIEW_COMPLETED'):
      filter = todo => todo.completed
      break
    case ('VIEW_NOT_COMPLETED'):
      filter = todo => !todo.completed
      break
    default:
      filter = _ => true
  }

  return store.getState().todos.filter(filter)
}

// View components

const el = preact.createElement

const TodoText = todo => (
  el(
    'pre',
    null,
    JSON.stringify(todo, null, 2)
  )
)

const RemoveTodo = ({ id }) => (
  el(
    'button',
    { onClick: () => removeTodo(id) },
    'Remove'
  )
)

const ToggleTodo = ({ id }) => (
  el(
    'button',
    {
      onClick: () => store.dispatch({
        type: 'TOGGLE_TODO', id
      })
    },
    'Toggle'
  )
)

const Todo = todo => (
  el(
    'div',
    null,
    el(TodoText, todo, null),
    el(RemoveTodo, { id: todo.id }, null),
    el(ToggleTodo, { id: todo.id }, null)
  )
)

const Todos = () => (
  el(
    'div',
    { class: 'todos'},
    ...getTodos().map(Todo)
  )
)

let textInput = preact.createRef()

const Input = () => (
  el(
    'input',
    {
      type: 'text',
      ref: textInput
    },
    null
  )
)

const Add = () => (
  el(
    'button',
    { onClick: () => addTodo(textInput.current.value) },
    'Add Todo'
  )
)

const Filter = () => (
  el(
    'select',
    {
      onChange: e => store.dispatch({ type: e.target.value })
    },
    el(
      'option',
      { value: 'VIEW_ALL' },
      'View all'
    ),
    el(
      'option',
      { value: 'VIEW_COMPLETED' },
      'View completed'
    ),
    el(
      'option',
      { value: 'VIEW_NOT_COMPLETED' },
      'View not completed'
    )
  )
)

const Controls = () => (
  el(
    'div',
    {  },
    el(Input, {}, null),
    el(Add, {}, null),
    el(Filter, {}, null)
  )
)

const App = () => (
  el(
    'div',
    null,
    el(Todos, {}, null),
    el('br', {}, null),
    el(Controls, {}, null)
  )
)

// Rendering
const render = () => {
  preact.render(
    el(App, {}, null),
    document.getElementById('root')
  )
}

render()

store.subscribe(render)