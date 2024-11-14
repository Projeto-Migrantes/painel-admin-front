/*
* Função para preencher o modal de exclusão de instituição
*/
function confirmDelete(name, id) {
    document.getElementById('institutionName').textContent = name;
    document.getElementById('institution_id').value = id;
};
