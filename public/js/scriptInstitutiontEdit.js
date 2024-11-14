/*
* Função para procurar o endereço a partir do CEP
*/
document.getElementById('btnBuscarEndereco').addEventListener('click', function() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('street').value = data.logradouro;
                    document.getElementById('neighborhood').value = data.bairro;
                    document.getElementById('city').value = data.localidade;
                    document.getElementById('state').value = data.estado;
                } else {
                    alert('CEP não encontrado!');
                };
            })
            .catch(() => {
                alert('Erro ao buscar o CEP!');
            });
    } else {
        alert('CEP inválido!');
    };
});

/*
* Função para formatar o telefone
*/
function formatPhone(input) {
    const value = input.value.replace(/\D/g, '');
    const formattedValue = value.length > 10
        ? value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        : value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    input.value = formattedValue;
};

/*
* Função para formatar o CNPJ
*/
function formatCNPJ(input) {
    const value = input.value.replace(/\D/g, '');
    const formattedValue = value.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
    );
    input.value = formattedValue; 
};

/*
* Função para formatar o usuário do Instagram
*/
function formatInstagramUsername(input) {
    const value = input.value.trim().replace(/[^a-zA-Z0-9_]/g, '');
    if (value) {
        input.value = `@${value}`;
    } else {
        input.value = ''; 
    };
};

/*
* Função para formatar o campo de CEP
*/
function formatCEP(input) {
    const value = input.value.replace(/\D/g, '');
    if (value.length > 5) {
        input.value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
    } else {
        input.value = value; 
    };
};


document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email');
    let originalEmail = emailInput.value;

    emailInput.addEventListener('focus', () => {
        originalEmail = emailInput.value; 
    });

    emailInput.addEventListener('blur', () => handleEmailBlur(originalEmail));
});

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
        const response = await fetch('/dashboard/institutions/check-email', {
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
