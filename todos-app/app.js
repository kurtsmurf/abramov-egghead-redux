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

const reducer = (() => {
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
        return state.filter(t => t.id !== action.id)
      case ('TOGGLE_TODO'):
        return state.map(t => t.id !== action.id ? t : todo(t, action))
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

  return (state = {}, action) => {
    return {
      todos: todos(state.todos, action),
      viewFilter: viewFilter(state.viewFilter, action)
    }
  }
})()

// The store

const store = createStore(reducer)

store.subscribe(() => {
  console.log(JSON.stringify(store.getState(), null, 2))
})

// Helper functions

const addTodo = (
  () => {
    let id = 0

    return text => {
      store.dispatch({ type: 'ADD_TODO', id: id++, text: text })
    }
  }
)()

const removeTodo = id => store.dispatch({ type: 'REMOVE_TODO', id })

const visibleTodos = () => {
  const filter = todo => {
    switch (store.getState().viewFilter) {
      case ('VIEW_COMPLETED'):
        return todo => todo.completed
      case ('VIEW_NOT_COMPLETED'):
        return filter = todo => !todo.completed
      default:
        return _ => true
    }
  }

  return store.getState().todos.filter(filter)
}

// View components

const TodoText = todo => (
  preact.h('pre', {}, JSON.stringify(todo, null, 2))
)

const RemoveTodo = ({ id }) => (
  preact.h('button', { onClick: () => removeTodo(id) }, 'Remove')
)

const ToggleTodo = ({ id }) => (
  preact.h(
    'button',
    { onClick: () => store.dispatch({ type: 'TOGGLE_TODO', id }) },
    'Toggle'
  )
)

const Todo = todo => (
  preact.h(
    'div',
    {},
    preact.h(TodoText, todo),
    preact.h(RemoveTodo, { id: todo.id }),
    preact.h(ToggleTodo, { id: todo.id })
  )
)

const Todos = () => (
  preact.h(
    'div',
    { class: 'todos' },
    ...visibleTodos().map(Todo)
  )
)

let textInput = preact.createRef()

const Input = () => preact.h('input',{ type: 'text', ref: textInput })

const Add = () => (
  preact.h(
    'button',
    { onClick: () => addTodo(textInput.current.value) },
    'Add Todo'
  )
)

const Filter = () => (
  preact.h(
    'select',
    { onChange: e => store.dispatch({ type: e.target.value }) },
    preact.h('option', { value: 'VIEW_ALL' }, 'View all'),
    preact.h('option', { value: 'VIEW_COMPLETED' }, 'View completed'),
    preact.h('option', { value: 'VIEW_NOT_COMPLETED' }, 'View not completed')
  )
)

const Controls = () => (
  preact.h(
    'div',
    {},
    preact.h(Input),
    preact.h(Add),
    preact.h(Filter)
  )
)

const App = () => (
  preact.h(
    'div',
    {},
    preact.h(Todos),
    preact.h(Controls)
  )
)

// Rendering

const render = () => {
  preact.render(
    preact.h(App),
    document.getElementById('root')
  )
}

render()

store.subscribe(render)


// all siblings of one type have the same formatting (either every sibling is unpacked vertically, or none of them are)
// ^ not sure about this one

// at every level of indentation, either all siblings are arranged vertically or all horizontally, never a mixture.

// everything wants to be on one line - gravity goes that way

// when to add a blank line is pretty much just stylistic
// try getting rid of all blank lines with this regex ^\s*$\n
// get rid of all line-ending whitespace \s+$

