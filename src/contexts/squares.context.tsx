import React, { useReducer } from "react"

export type Square = {
    startX: number,
    startY: number,
    endX: number,
    endY: number
  }

  type State = {
    startPoint: number[] | undefined,
    squares: Square[]
  }
  
  type Action = 
    | { type: 'SET_START_POINT', payload: number[] }
    | { type: 'ADD_SQUARE', payload: Square }
    | { type: 'RESET_START_POINT' }

  type SquareContextType = {
    state: State,
    dispatch: React.Dispatch<Action>
  }

function reducer(state: State, action: Action): State {

    switch(action.type) {
        case "SET_START_POINT":
            return {
                ...state,
                startPoint: action.payload
            }
        case "ADD_SQUARE":
            return {
                ...state,
                squares: [...state.squares, action.payload]
            }
        case "RESET_START_POINT":
            return {
                ...state, 
                startPoint: undefined
            }
    }
}


const initialState: State = {
    startPoint: undefined,
    squares: []
}

  const SquareContext = React.createContext<SquareContextType | undefined>(undefined)


  export function SquareProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <SquareContext.Provider value={{ state, dispatch }}>
            {children}
        </SquareContext.Provider>
    )
  }

  export function useSquareContext() {
    const context = React.useContext(SquareContext)
    if (!context) {
        throw new Error('useSquareContext must be used within a SquareProvider')
    }
    return context
}