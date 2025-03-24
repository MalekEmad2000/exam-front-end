const io = require('socket.io-client')

const SOCKET_URL = 'http://' + window.location.host.split(':')[0] + ':3032/'

export class SocketHandler {
  static instance

  static getInstance() {
    if (!SocketHandler.instance) {
      SocketHandler.instance = new SocketHandler()
    }
    return SocketHandler.instance
  }

  getSocket() {
    return this.socket
  }

  async connectToServer() {
    console.log('connecting to server')
    this.socket = io.connect(SOCKET_URL)

    this.socket.on('connect', () => {
      console.log('connected to server')
    })

    this.socket.on('disconnect', () => {
      //handle disconnect
      console.log('disconnected from server')
    })

    this.socket.on('exam_started', () => {
      console.log('exam_started')
      if (document.location.pathname !== '/exam') {
        console.log('navigating to exam')
        const event = new CustomEvent('navigateToExam', {
          detail: { path: '/exam' },
        })
        window.dispatchEvent(event)
      }
    })

    this.socket.on('exam_ended', () => {
      console.log('exam_ended')

      console.log('navigating to end')
      const event = new CustomEvent('navigateToEnd', {
        detail: { path: '/end' },
      })
      window.dispatchEvent(event)
    })
  }

  async diconnectSocket() {
    console.log('disconnecting socket')
    await this.socket.disconnect()
  }

  async joinExam(examId, studentId) {
    console.log('joining exam =' + examId)
    console.log('joining student =' + studentId)
    await this.socket.emit('join_exam', examId, studentId)
  }
}
