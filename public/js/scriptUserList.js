const limit = 50; // Limite de usuários por página
let currentPage = 1;

// Função para renderizar a tabela de usuários com paginação
function renderTable() {
    const start = (currentPage - 1) * limit;
    const end = start + limit;

    const pageUsers = users.slice(start, end);
    const tableBody = document.getElementById('userTable');
    tableBody.innerHTML = '';

    pageUsers.forEach(user => {
        const roleLabel = user.role === 'admin' ? 'Administrador' : 'Usuário';
        
        const row = `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${roleLabel}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="d-flex">
                        <form action="/dashboard/users/edit" method="POST" class="mr-2">
                            <input type="hidden" name="user_id" value="${user.id}">
                            <button type="submit" class="btn btn-info btn-sm">Editar</button>
                        </form>
                        <form action="/dashboard/users/change-password" method="POST">
                            <input type="hidden" name="user_id" value="${user.id}">
                            <input type="hidden" name="user_role" value="${user.role}">
                            <input type="hidden" name="user_name" value="${user.name}">
                            <input type="hidden" name="user_email" value="${user.email}">
                            <button type="submit" class="btn btn-info btn-sm mr-2">Alterar Senha</button>
                        </form>
                        <form action="/dashboard/users/delete" method="POST"">
                            <input type="hidden" name="user_id" value="${user.id}">
                            <button type="submit" class="btn btn-danger btn-sm">Deletar</button>
                        </form>
                    </div>
                </td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });

    document.getElementById('contador').textContent = `Exibindo ${start + 1} a ${Math.min(end, users.length)} de ${users.length} usuários`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= users.length;
};

/*
* Event listeners para os botões de paginação
*/
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage * limit < users.length) {
        currentPage++;
        renderTable();
    }
});

renderTable();
