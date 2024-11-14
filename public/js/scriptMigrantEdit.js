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
* Função para verificar se o select de gênero é 'Outro' e exibir o campo de texto
* para inserir outro gênero
*/
function toggleOtherGenderInput() {
    const genderSelect = document.getElementById('gender');
    const otherGenderInput = document.getElementById('other_gender');
    if (genderSelect.value === 'Outro') {
        otherGenderInput.classList.remove('d-none');
        otherGenderInput.setAttribute('required', 'required');
    } else {
        otherGenderInput.classList.add('d-none');
        otherGenderInput.removeAttribute('required');
        otherGenderInput.value = '';
    }
}

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
        const response = await fetch('/dashboard/migrants/check-email', {
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

/*
* Função para formatar o CEP
*/
function formatCEP(input) {
    const value = input.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(\d{5})(\d{3})/, '$1-$2');

    input.value = formattedValue;
}

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