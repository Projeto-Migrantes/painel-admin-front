/* 
* Função verificar se os campos de usuário e senha estão preenchidos
*/
document.querySelector('#buttonLogin').addEventListener('click', function(event) {
    event.preventDefault(); 


    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (!username || !password) {
        document.getElementById('error-message').style.display = 'block'; 
        return; 
    }

    document.getElementById('error-message').style.display = 'none';

    const button = document.querySelector('#buttonLogin');
    button.disabled = true;

    const form = document.querySelector('form');
    form.submit();
});

/* 
* Função para alternar a visibilidade da senha 
*/
document.querySelector('#togglePassword').addEventListener('click', function() {
    const passwordField = document.querySelector('#password');
    const icon = document.querySelector('#togglePassword i');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    };
});


document.querySelector('.forgot-password').addEventListener('click', function(event) {
    event.preventDefault(); 
    $('#forgotPasswordModal').modal('show'); 
});


window.history.pushState(null, null, window.location.href);
window.onpopstate = function() {
    window.history.pushState(null, null, window.location.href);
};
