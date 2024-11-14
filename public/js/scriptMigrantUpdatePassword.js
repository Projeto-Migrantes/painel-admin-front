/*
* Função para formatar a data de nascimento
*/
document.addEventListener("DOMContentLoaded", function() {
    const birthDateElement = document.getElementById("birthDate");
    if (migrantBirthDate) {
        birthDateElement.textContent = formatDate(migrantBirthDate);
    } else {
        birthDateElement.textContent = 'Não disponível';
    }
});

/*
* Função para formatar a data
*/
function formatDate(dateStr) {
    const date = new Date(dateStr + 'Z'); 
    if (isNaN(date)) {
        return 'Data inválida'; 
    }
    date.setHours(date.getHours() + 3); 
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/*
* Função para validar a senha
*/
function validatePasswords() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const alertDiv = document.getElementById('alert');

    if (password !== confirmPassword) {
        alertDiv.textContent = 'As senhas não coincidem!';
        alertDiv.classList.remove('d-none');
        return false;
    } else if (password.length < 6) {
        alertDiv.textContent = 'A senha deve ter pelo menos 6 caracteres!';
        alertDiv.classList.remove('d-none');
        return false;
    } else {
        alertDiv.classList.add('d-none');
        return true;
    };
};

/* 
* Adiciona o evento de validação ao enviar o formulário
*/
document.querySelector('form').addEventListener('submit', function(event) {
    if (!validatePasswords()) {
        event.preventDefault(); 
    };
});

/* 
* Alternar visibilidade da senha
*/
document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordField = document.getElementById("newPassword");
    const eyeIcon = document.getElementById("eyeIcon");
    if (passwordField.type === "password") {
        passwordField.type = "text"; 
        eyeIcon.classList.remove("bi-eye-slash");
        eyeIcon.classList.add("bi-eye");
    } else {
        passwordField.type = "password"; 
        eyeIcon.classList.remove("bi-eye");
        eyeIcon.classList.add("bi-eye-slash");
    };
});

/* 
* Alternar visibilidade da confirmação da senha
*/
document.getElementById("toggleConfirmPassword").addEventListener("click", function() {
    const confirmPasswordField = document.getElementById("confirmPassword");
    const eyeIconConfirm = document.getElementById("eyeIconConfirm");
    if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text"; 
        eyeIconConfirm.classList.remove("bi-eye-slash");
        eyeIconConfirm.classList.add("bi-eye");
    } else {
        confirmPasswordField.type = "password"; 
        eyeIconConfirm.classList.remove("bi-eye");
        eyeIconConfirm.classList.add("bi-eye-slash");
    };
});
