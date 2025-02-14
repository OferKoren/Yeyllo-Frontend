import io from 'socket.io-client'
import { userService } from './user'

//*Task
export const SOCKET_EVENT_BOARD_UPDATED = 'board-updated'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'

const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'
export const socketService = createSocketService()

// for debugging from console
window.socketService = socketService

socketService.setup()
console.log('WebSocket setup: Connecting to', baseUrl)

function createSocketService() {
  var socket = null

  const socketService = {
    setup() {
      socket = io(baseUrl) //WebSocket connection to baseUrl
      const user = userService.getLoggedinUser()
      if (user) this.login(user._id) //call login below
    },
    on(eventName, cb) {
      socket.on(eventName, cb)
      //Adds a listener for a specific WebSocket event.
      //Whenever the server emits an event with the name eventName, the callback function (cb) will be executed.
    },
    off(eventName, cb = null) {
      if (!socket) return //If socket is null or not initialized
      if (!cb) socket.removeAllListeners(eventName) //If cb is null or undefined, it removes all listeners for the given eventName
      else socket.off(eventName, cb) //If a specific callback is provided, it removes only that callback for the given event 
    },
    emit(eventName, data) {
      socket.emit(eventName, data) //It sends the event and data to the server so that the server can process it.
    },
    login(userId) {
      socket.emit(SOCKET_EMIT_LOGIN, userId)
    },
    logout() {
      socket.emit(SOCKET_EMIT_LOGOUT)
    },
    terminate() {
      socket = null
    },

  }
  return socketService
}



// Basic Tests
// function cb(x) {console.log('Socket Test - Expected Puk, Actual:', x)}
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('mama', cb)
// socketService.emit('baba', 'Puk')
// socketService.off('baba', cb)
