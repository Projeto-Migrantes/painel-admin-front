const limit = 50; // Número de instituições por página
let currentPage = 1;

/* 
* Função para renderizar a tabela de instituições
* de acordo com a página atual e o limite de instituições por página.
*/
function renderTable() {
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    const pageMigrants = migrants.slice(start, end);

    const tableBody = document.getElementById('migrantTable');
    
    tableBody.innerHTML = '';

    pageMigrants.forEach(migrant => {
        const row = `
            <tr>
                <td>${migrant.full_name}</td> <!-- Nome completo -->
                <td>${migrant.social_name || 'Não disponível'}</td> <!-- Nome social, se existir -->
                <td>${migrant.email}</td> <!-- Email do migrante -->
                <td>${migrant.phone || 'Não disponível'}</td> <!-- Telefone, se existir -->
                <td>${migrant.MigrantDocument?.document_identification || 'Não disponível'}</td> <!-- Documento de identificação, se existir -->
                <td>
                    <div class="d-flex">
                        <form action="/dashboard/migrants/details" method="POST" class='mr-2'>
                            <input type="hidden" name="migrant_id" value="${migrant.id}">
                            <button type="submit" class="btn btn-info btn-sm">Detalhes</button>
                        </form>
                        <form action="/dashboard/migrants/edit" method="POST">
                            <input type="hidden" name="migrant_id" value="${migrant.id}">
                            <button type="submit" class="btn btn-info btn-sm">Editar</button>
                        </form>
                    </div>
                </td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    document.getElementById('contador').textContent = `Exibindo ${start + 1} a ${Math.min(end, migrants.length)} de ${migrants.length} migrantes`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= migrants.length;
};

/*
* Event listeners para os botões de página anterior e próxima.
*/
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * limit < migrants.length) {
        currentPage++;
        renderTable();
    }
});

renderTable();
