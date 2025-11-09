document.addEventListener("DOMContentLoaded", function () {
    const birthDateElement = document.getElementById("birthDate");
    const entryDateElement = document.getElementById("entryDate");

    const migrantBirthDate = "1988-02-17T00:00:00.000Z";
    const migrantEntryDate = "2018-07-22T00:00:00.000Z";

    birthDateElement.textContent = formatDate(migrantBirthDate);
    entryDateElement.textContent = formatDate(migrantEntryDate);
});

function formatDate(dateStr) {
    if (!dateStr) return 'Não disponível';
    const date = new Date(dateStr);
    if (isNaN(date)) return 'Data inválida';
    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function confirmDelete(name, id) {
    document.getElementById('migrantName').textContent = name;
    document.getElementById('migrant_id').value = id;
}
