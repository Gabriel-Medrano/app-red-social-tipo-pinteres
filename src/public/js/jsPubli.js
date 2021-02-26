const socket = io();

//Events


//Functions
//Comment
const viewComments = (id) => {

    fetch('/comments/' + id.value,{
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        const cajaComments = document.getElementById('caja-comments');
        let html = '';
        data.listComments.forEach(comment => {
            html += `
                <div class="card my-2">
                    <div class="d-flex py-1">
                        <img src="${comment.user.icon}" alt="" class="icon-miniature">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="small ml-2">
                                <a href="/perfil/${comment.user.nick_name}" class="mb-1 text-info">${comment.user.nick_name}</a>
                                <p class="my-0 mr-2 text-justify">${comment.description}</p>
                                <p class="small mt-2 text-secondary">${comment.dateAgo}</p>
                            </div>
                            ${commentUser(comment)}
                        </div>
                        <div class="text-righ mr-2">
                            <input type="hidden" value="${comment._id}" class="id_comment">
                            ${meReaction(comment)}
                        </div>
                    </div>
                </div>
            `
            function commentUser(comment) {
                let htmlCmnt = '';
                if(comment.commentUser) {
                    htmlCmnt = `
                        <div class="mr-2">
                            <input type="hidden" value="${comment._id}" class="idCmnt">
                            <div class="btn-sm btn-info cursor_div" onclick="viewComment(this)">view</div>
                        </div>
                    `
                }
                return htmlCmnt;
            }

            function meReaction(comment) {
                let htmlR = '';
                if(comment.meReaction) {
                    htmlR = `
                        <div  class="like_comment cursor_div" onclick="likeComment(this)">
                            <i class="fas fa-heart"></i> 
                            <p class="small text-center m-0">${comment.reactions}</p>
                        </div>
                    `
                }else {
                    htmlR = `
                        <div  class="like_comment cursor_div" onclick="likeComment(this)">
                            <i class="far fa-heart"></i> 
                            <p class="small text-center m-0">${comment.reactions}</p>
                        </div>
                    `
                }

                return htmlR;
            }
        });
        cajaComments.innerHTML = html;
    })
    .catch(err => console.log(err));
}

const btnCreateComment = document.getElementById('btn_create_comment');
const createComment = () => {
    event.preventDefault();
    const description = document.getElementById('description_comment');
    const id = document.getElementById('puId');

    fetch('/comment/create',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            description: description.value,
            puId: id.value
        })
    })
    .then(res => res.json())
    .then(data => {
        const Msgs = document.querySelector('#caja_Msgs');
        let html = '';
        data.Msg.forEach(msg => {
            if(msg.text_success) {
                html += `
                   <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <p>${msg.text_success}</p>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `
            }
            if(msg.text_error) {
                html += `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <p>${msg.text_error}</p>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `
            }

        });
        Msgs.innerHTML = html;

        //limpiar inputs
        description.value = '';

        //Actualizar lista con socket
        socket.emit('chat:comments',id.value);
    })
    .catch(err => console.log(err));
}
btnCreateComment.addEventListener('click',createComment);

const viewComment = (n) => {

    const id = n.parentNode.querySelector('.idCmnt');

    fetch('/comment/' + id.value,{
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        let html = '';
        const Msgs = document.querySelector('#caja_Msgs');
        const cajaForm = document.getElementById('open_form_cmnt');
        
        if(data.Msg) {
            data.Msg.forEach(msg => {
                html += `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <p>${msg.text_error}</p>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `
            });

            Msgs.innerHTML = html;
        }else {
            document.getElementById("open_form_cmnt").style.display="block";
            html = `
                <input type="hidden" value="${data.comment._id}" id="idComment">
                <div class="form-mediano">
                    <div class="text-right" onclick="closes()"><i class="fas fa-times"></i></div>
                    <div class="form-group my-2 text-center">
                        <img src="${data.comment.user.icon}" alt="" class="icon-mediano">
                        <p>${data.comment.user.nick_name}</p>
                    </div>
                    <div class="form-group my-2">
                        <input type="text" class="form-control" name="description" id="description_update_comment" value="${data.comment.description}" placeholder="Enter the description">
                    </div>
            
                    <div class="form-group my-2 buttoms-end">
                        <button type="submit" class="btn btn-info" onclick="updateComment()">Update</button>
                        <button type="submit" class="btn btn-danger" onclick="deleteComment()">Delete</button>
                    </div>
                </div>
            `;

            cajaForm.innerHTML = html;
        }
        
    })
    .catch(err => console.log(err));
}

//no se puede poner como const el btn (ej: btnUpdateComment = document.getElementById('valor'), btnUpdateComment.addEventListener('click',updateComment);) porque no encuentra el botton ya que la caja del form update esta oculto hasta llamarlo.
//funciona visto por el momento con la manera clasica. ej: <button type="submit" class="btn btn-info" onclick="updateComment()">Update</button>
const updateComment = () => {
    event.preventDefault();
    const id = document.getElementById('idComment');
    const idPu = document.getElementById('puId');
    const description = document.getElementById('description_update_comment');

    fetch('/comment/edit/' + id.value,{
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            description: description.value
        })
    })
    .then(res => res.json())
    .then(data => {
        let contador = 0;
        let html = '';
        const Msgs = document.querySelector('#caja_Msgs');
        
        data.Msg.forEach(msg => {
            if(msg.text_success) {
                html += `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <p>${msg.text_success}</p>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `
                contador = 1;
            }
            if(msg.text_error) {
                html += `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <p>${msg.text_error}</p>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `
            }
        
        });

        Msgs.innerHTML = html;

        if(contador === 1) {
            document.getElementById("open_form_cmnt").style.display="none";
        }

        //Actualizar lista con socket
        socket.emit('chat:comments',idPu.value);
    }) 
    .catch(err => console.log(err));
}

//el mismo problema que el updateComment
const deleteComment = () => {
    event.preventDefault();
    const id = document.getElementById('idComment');
    const idPu = document.getElementById('puId');

    fetch('/comment/delete/' + id.value, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        let contador = 0;
        let html = '';
        const Msgs = document.querySelector('#caja_Msgs');
        
        data.Msg.forEach(msg => {
            if(msg.text_success) {
                html += `
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <p>${msg.text_success}</p>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `
                contador = 1;
            }
            if(msg.text_error) {
                html += `
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <p>${msg.text_error}</p>
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                `
            }
        
        });

        Msgs.innerHTML = html;

        if(contador === 1) {
            document.getElementById("open_form_cmnt").style.display="none";
        }

        //Actualizar lista con socket
        socket.emit('chat:comments',idPu.value);
    })
    .catch(err => console.log(err));
}

//inputDescription
const descriptionCmnt = document.getElementById('description_comment');
descriptionCmnt.addEventListener('keyup',() => {
    const idP = document.getElementById('puId');
    let writing = '';

    if(descriptionCmnt.value !== '') {
        writing = 'alguien esta escribiendo...';
    }
    //te permite mandar un dato,objeto,etc.
    socket.emit('chat:typing',{idP:idP.value,writing});
});

//Reaction
//create-delete-reaction-publi
const btnReactionPubli = document.getElementById('like_publication');
const likePubli = () => {
    const id = document.getElementById('id_publi');
    
    fetch('/reaction/' + id.value,{
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        const cajaReaction = document.getElementById('like_publication');
        let html = ``;

        if(data.model.meReaction) {
            html = `
                <i class="far fa-heart"></i>
                <span class="small">${data.model.reactions - 1}</span>
            `
        }else {
            html = `
                <i class="fas fa-heart"></i>
                <span class="small">${data.model.reactions + 1}</span>
            `
        }

        cajaReaction.innerHTML = html;
    })
    .catch(err => console.log(err)); 
}
btnReactionPubli.addEventListener('click',likePubli);

//create-delete-reaction-comment
const likeComment = (n) => {
    const id = n.parentNode.querySelector('.id_comment');

    fetch('/reaction/' + id.value,{
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {
        const cajaReaction = n.parentNode.querySelector('.like_comment');
        let html = ``;

        if(data.model.meReaction) {
            html = `
                <i class="far fa-heart"></i>
                <p class="small text-center m-0">${data.model.reactions - 1}</p>
            `
        }else {
            html = `
                <i class="fas fa-heart"></i>
                <p class="small text-center m-0">${data.model.reactions + 1}</p>
            `
        }

        cajaReaction.innerHTML = html;
    })
    .catch(err => console.log(err)); 
}


//animations_DOM
function closes() {
    document.getElementById("open_form_cmnt").style.display="none";
}

//Socket
socket.on('chat_comments', (id) => {
    const idP = document.getElementById('puId');

    if(id === idP.value) {
        fetch('/comments/' + id,{
            method: 'GET'
        })
        .then(res => res.json())
        .then(data => {
            //el cliente emite un event chat:comment con datos (envia datos del cliente al servidor)
            // socket.emit('chat:comments',data);
            const cajaComments = document.getElementById('caja-comments');
            let html = '';
            data.listComments.forEach(comment => {
                html += `
                    <div class="card my-2">
                        <div class="d-flex py-1">
                            <img src="${comment.user.icon}" alt="" class="icon-miniature">
                            <div class="d-flex w-100 justify-content-between">
                                <div class="small ml-2">
                                    <a href="/perfil/${comment.user.nick_name}" class="mb-1 text-info">${comment.user.nick_name}</a>
                                    <p class="my-0 mr-2 text-justify">${comment.description}</p>
                                    <p class="small mt-2 text-secondary">${comment.dateAgo}</p>
                                </div>
                                ${commentUser(comment)}
                            </div>
                            <div class="text-righ mr-2">
                                <input type="hidden" value="${comment._id}" class="id_comment">
                                ${meReaction(comment)}
                            </div>
                        </div>
                    </div>
                `
                function commentUser(comment) {
                    let htmlCmnt = '';
                    if(comment.commentUser) {
                        htmlCmnt = `
                            <div class="mr-2">
                                <input type="hidden" value="${comment._id}" class="idCmnt">
                                <div class="btn-sm btn-info cursor_div" onclick="viewComment(this)">view</div>
                            </div>
                        `
                    }
                    return htmlCmnt;
                }
    
                function meReaction(comment) {
                    let htmlR = '';
                    if(comment.meReaction) {
                        htmlR = `
                            <div  class="like_comment cursor_div" onclick="likeComment(this)">
                                <i class="fas fa-heart"></i> 
                                <p class="small text-center m-0">${comment.reactions}</p>
                            </div>
                        `
                    }else {
                        htmlR = `
                            <div  class="like_comment cursor_div" onclick="likeComment(this)">
                                <i class="far fa-heart"></i> 
                                <p class="small text-center m-0">${comment.reactions}</p>
                            </div>
                        `
                    }
    
                    return htmlR;
                }
            });
            cajaComments.innerHTML = html;
    
            //elimina el texto de chat:typing
            const writing = document.getElementById('writing');
            let htmlWrite = ``;
            writing.innerHTML = htmlWrite;
        })
        .catch(err => console.log(err));
    }
});

socket.on('chat_typing', (data) => {
    // console.log(data);
    const idPubli = document.getElementById('puId');

    if(data.idP === idPubli.value) {
        const writing = document.getElementById('writing');
        let html = `
            <p class="m-0 text-secondary small">${data.writing}</p>
        `;
        writing.innerHTML = html;
    }
});