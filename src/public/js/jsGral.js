//events


//functions
const inputSearchUsers = document.getElementById('search_users_gral');
const searchUsersGral = () => {
    fetch('/search/users',{
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            nickName: inputSearchUsers.value
        })
    })
    .then(res => res.json())
    .then(data => {
        const cajaUsers = document.querySelector('#caja_results_users_gral');
        let html = '';

        data.listUsers.forEach(user => {
            html += `
            <button class="btn my-1 px-1 bg-white w-100">
                <a href="/perfil/${user.nick_name}" class="d-flex">
                    <img src="${user.icon}" alt="" class="icon-miniature mr-1 img-user-search">
                    <p class="m-0 small mt-2 text-user-search">${user.nick_name}</p>
                </a>
            </button>
            `
        });
        cajaUsers.innerHTML = html;
    })
    .catch(err=> console.log(err));

}
inputSearchUsers.addEventListener('keyup',searchUsersGral);
