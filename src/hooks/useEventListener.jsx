import { useEffect, useRef } from 'react'

export default function useEventListener(eventType, handler) {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    function internalHandler(e) {
      return handlerRef.current(e)
    }
    document.addEventListener(eventType, internalHandler)

    return () => {
      document.removeEventListener(eventType, internalHandler)
    }
  }, [eventType])
}
