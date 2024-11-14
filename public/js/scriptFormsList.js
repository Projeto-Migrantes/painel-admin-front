    /*
    * Funções para submeter os formulários de "Marcar como Lido", "Deletar" e "Marcar como Resolvido"
    */

    // Função para submeter o formulário de "Marcar como Lido"
    function submitMarkAsReadForm(formId) {
        document.getElementById('markAsReadForm' + formId).submit();
    };

    // Função para submeter o formulário de "Deletar"
    function submitDeleteForm(formId) {
        document.getElementById('deleteForm' + formId).submit();
    };

    // Função para submeter o formulário de "Marcar como Resolvido"
    function submitMarkAsResolvedForm(formId) {
        document.getElementById('markAsResolvedForm' + formId).submit();
    };
