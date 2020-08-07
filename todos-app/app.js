const createStore = reducer => {
  let state
  let listeners = []

  const getState = () => state

  const dispatch = action => {
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
    case ('VIEW_ALL'): return action.type
    case ('VIEW_COMPLETED'): return action.type
    case ('VIEW_NOT_COMPLETED'): return action.type
    default: return state
  }
}

const todosApp = (state = {}, action) => {
  return {
    todos: todos(state.todos, action),
    viewFilter: viewFilter(state.viewFilter, action)
  }
}

const store = createStore(todosApp)

const addTodo = (
  () => {
    let id = 0
    return (text) => {
      store.dispatch({
        type: 'ADD_TODO',
        id: id++,
        text: text
      })
    }
  }
)()

const removeTodo = (id) => {
  store.dispatch({ type: 'REMOVE_TODO', id })
}

const log = () => {
  console.log(JSON.stringify(store.getState(), null, 2))
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

store.subscribe(log)