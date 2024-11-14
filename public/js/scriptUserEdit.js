/*
* Função para verificar a disponibilidade do email ao sair do campo
*/
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    let originalEmail = emailInput.value;

    emailInput.addEventListener('focus', () => {
        originalEmail = emailInput.value; 
    });

    emailInput.addEventListener('blur', () => handleEmailBlur(originalEmail));
});

/*
* Função chamada ao sair do campo de email
*/
const handleEmailBlur = async (originalEmail) => {
    const emailInput = document.getElementById('email');
    const email = emailInput.value;

    if (email !== originalEmail) {
        try {
            const data = await checkEmailAvailability(email);
            displayEmailFeedback(data.exists);
        } catch (error) {
            handleEmailError(error);
        }
    } else {
        clearEmailFeedback();
    }
};

/*
* Função para verificar a disponibilidade do email
*/
const checkEmailAvailability = async (email) => {
    try {
        const response = await fetch('/dashboard/users/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        if (!response.ok) {
            console.error('Erro na requisição:', response.statusText);
            throw new Error('Erro na requisição');
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao verificar o e-mail:', error);
    };
};

/*
* Função para exibir feedback baseado na disponibilidade do email
*/
const displayEmailFeedback = (emailExists) => {
    const feedbackElement = document.getElementById('emailFeedback');
    if (emailExists) {
        feedbackElement.textContent = 'Este email já está cadastrado.';
        feedbackElement.style.color = 'red';
    } else {
        feedbackElement.textContent = '';
    };
};

/* 
* Função para limpar o feedback do campo de email
*/
const clearEmailFeedback = () => {
    const feedbackElement = document.getElementById('emailFeedback');
    feedbackElement.textContent = '';
};

/* 
* Função para tratar erros na verificação do email
*/
const handleEmailError = (error) => {
    console.error('Erro ao verificar o email:', error);
    const feedbackElement = document.getElementById('emailFeedback');
    feedbackElement.textContent = 'Erro ao verificar o email.';
    feedbackElement.style.color = 'orange';
};