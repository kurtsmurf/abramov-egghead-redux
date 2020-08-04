const addCounter = list => {
    return [...list, 0]
}

const testAddCounter = () => {
    const listBefore = []
    const listAfter = [0]

    Object.freeze(listBefore)

    expect(
        addCounter(listBefore)
    ).toEqual(listAfter)
}

testAddCounter()

const removeCounter = (list, index) => {
    return [
        ...list.slice(0, index),
        ...list.slice(index + 1)
    ]
}

const testRemoveCounter = () => {
    const listBefore = [1,2,3]
    const listAfter = [1,3]

    Object.freeze(listBefore)

    expect(
        removeCounter(listBefore, 1)
    ).toEqual(listAfter)
}

testRemoveCounter()

const incrementCounter = (list, index) => {
    return [
        ...list.slice(0, index),
        list[index] + 1,
        ...list.slice(index + 1)
    ]
}

const testIncrementCounter = () => {
    const listBefore = [1,2,3]
    const listAfter = [1,2,4]

    Object.freeze(listBefore)

    expect(
        incrementCounter(listBefore, 2)
    ).toEqual(listAfter)
}

testIncrementCounter()

// const toggleTodo = (todo) => {
//     return {
//         ...todo,
//         completed: !todo.completed
//     }
// }

// const testToggleTodo = () => {
//     const todoBefore = {
//         id: 0,
//         text: 'Learn Redux',
//         completed: false
//     }
//     const todoAfter = {
//         id: 0,
//         text: 'Learn Redux',
//         completed: true
//     }

//     Object.freeze(todoBefore)

//     expect(
//         toggleTodo(todoBefore)
//     ).toEqual(todoAfter)
// }

// testToggleTodo()

const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case 'TOGGLE_TODO':
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
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ]
        case 'TOGGLE_TODO':
            return state.map(t => {
                if (t.id !== action.id) {
                    return t
                }

                return todo(t, action)
            })
        default:
            return state
    }

}

const testAddTodo = () => {
    const stateBefore = []
    const action = {
        type: 'ADD_TODO',
        id: 0,
        text: 'Learn Redux'
    }
    const stateAfter = [{
        id: 0,
        text: 'Learn Redux',
        completed: false
    }]

    Object.freeze(stateBefore)

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter)
}

testAddTodo()

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: false
        }
    ]
    const action = {
        type: 'TOGGLE_TODO',
        id: 0,
    }
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: true
        },
        {
            id: 1,
            text: 'Go shopping',
            completed: false
        }
    ]

    Object.freeze(stateBefore)

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter)
}

testToggleTodo()

const testUnknownAction = () => {
    const stateBefore = []
    const action = { type: 'UNKNOWN_ACTION'}
    const stateAfter = []

    Object.freeze(stateBefore)

    expect(
        todos(stateBefore, action)
    ).toEqual(stateAfter)
}

testUnknownAction()

console.log("All tests passed!")