const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
let users = [];
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
io.on('connection', (socket) => {
    console.log('建立连接');
    socket.on('login', (info) => {
        if (info.username.length > 0) {
            console.log(info);
            users.push(info);
            io.emit('success', users);
        } 
        // socket.emit('replay', '后台:你好前台');
    })
    socket.on('send', (content) => {
        console.log(content);
        if (content.id) {
            console.log('我进来了');
            socket.to(content.id).emit('replay', content);
            // return;
        } else {
            io.emit('replay', content);
        }
        
    })
    socket.on('disconnect', () => {
        // users = [];
        console.log(socket.id);
        users = users.filter(item => item.id != socket.id)
        console.log('断开连接');
    })
})

server.listen(5000, () => {
    console.log('5000端口已开启')
})