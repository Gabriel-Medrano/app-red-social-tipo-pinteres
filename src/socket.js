module.exports = function (io) {
    io.on('connection',(socket) => {
        // console.log('new connection',socket.id);
        socket.on('chat:comments',(data) => {
            //servidor emite un evento con datos (envia datos del servidor al cliente)
            //manda a todos incluyendote
            io.sockets.emit('chat_comments',data);
        });

        socket.on('chat:typing',(data) => {
            //manda a todos excepto a ti
            socket.broadcast.emit('chat_typing',data);
        });

    });
}

// emit = emitir(como 'req'uerir) , on = transmitir-escuchar(como 'res'ponder)