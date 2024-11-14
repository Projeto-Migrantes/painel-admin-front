/*
* Função para formatar a data de nascimento e data de entrada do migrante
*/
document.addEventListener("DOMContentLoaded", function() {
    const birthDateElement = document.getElementById("birthDate");
    if (migrantBirthDate) {
        birthDateElement.textContent = formatDate(migrantBirthDate);
    } else {
        birthDateElement.textContent = 'Não disponível';
    }

    const entryDateElement = document.getElementById("entryDate");
    if (migrantEntryDate) {
        entryDateElement.textContent = formatDate(migrantEntryDate);
    } else {
        entryDateElement.textContent = 'Não disponível';
    };
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
};

/* 
* Função para confirmar a exclusão de uma instituição
*/
function confirmDelete(name, id) {
    // Preenche o nome da instituição no modal
    document.getElementById('migrantName').textContent = name;
    
    // Define o ID da instituição no formulário para que seja enviado corretamente
    document.getElementById('migrant_id').value = id;
};

