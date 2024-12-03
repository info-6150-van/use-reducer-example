import { useSquareContext } from '@/contexts/squares.context';
import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react';

export const Route = createFileRoute('/')({
  component: Index,
})



const x = 12;
const y = 12;

const calcIndex = (ix: number, iy: number): number => {
  return ix * x + iy;
}

function Index() {

  const { state, dispatch } = useSquareContext()

  const indexList = React.useMemo(() => {
    return [...Array(x).keys()]
      .flatMap(d => [...Array(y).keys()].map(v => [v, d]))
      .filter(([x, y]) => {
        return state.squares.reduce((prev, sqr) => (
          !(prev && (sqr.startX > x && x < sqr.endX) && (sqr.startY > y && y >= sqr.endY))
        ), true)
      })
  }, [state.squares])

  const handleDragStart = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const idxStr: string | undefined = e.currentTarget.dataset['idx']
    if (!idxStr)
      throw new Error('idx is missing in element');

    const idx = parseInt(idxStr)

    const curX = Math.floor(idx / x);
    const curY = idx - curX * x;

    if (!state.startPoint) {
      dispatch({
        type: 'SET_START_POINT',
        payload: [curX, curY]
      })
      return;
    }

    const [startX, startY] = state.startPoint;

    if (startX <= curX && startY <= curY) {
      dispatch({
        type: 'ADD_SQUARE',
        payload: {
          startX: startX,
          startY: startY,
          endX: curX,
          endY: curY
        }
      })
    } else if (startX >= curX && startY <= curY) {
      dispatch({
        type: 'ADD_SQUARE',
        payload: {
          startX: curX,
          startY: startY,
          endX: startX,
          endY: curY
        }
      })
    } else if (startX <= curX && startY >= curY) {
      dispatch({
        type: 'ADD_SQUARE',
        payload: {
          startX: startX,
          startY: curY,
          endX: curX,
          endY: startY
        }
      })
    } else if (startX >= curX && startY >= curY) {
      dispatch({
        type: 'ADD_SQUARE',
        payload: {
          startX: curX,
          startY: curY,
          endX: startX,
          endY: startY
        }
      })
    }

    dispatch({ type: 'RESET_START_POINT' })

  }, [state.startPoint])


  return (
    <div className='gap-4 grid grid-cols-4 grid-rows-8 w-full h-full bg-yellow-50 p-4' style={{ gridTemplateColumns: `repeat(${x}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${y}, minmax(0, 1fr))` }}>
      {indexList.flatMap(([x, y]) => (
        <div data-idx={calcIndex(x, y)}
          onMouseDown={handleDragStart}
          key={calcIndex(x, y)}
          className='border-4 border-dashed border-gray-800 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer items-center bg-white shadow-inner'
          style={{ gridColumnStart: y + 1, gridColumnEnd: y + 2, gridRowStart: x + 1, gridRowEnd: x + 2 }}>
          {' '}
        </div>
      ))}
      {state.squares.map((sqr) => (
        <div
          key={sqr.startX * x + sqr.startY}
          className='border-8 border-gray-900 bg-white shadow-comic rounded-lg transform rotate-1 hover:rotate-0 transition-all duration-300 panel'
          style={{
            gridColumnStart: sqr.startY + 1,
            gridColumnEnd: sqr.endY + 2,
            gridRowStart: sqr.startX + 1,
            gridRowEnd: sqr.endX + 2,
            boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.75)'
          }}
        />
      ))}
    </div>
  )
}