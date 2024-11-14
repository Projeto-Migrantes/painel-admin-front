import { api } from '../config/config.js';  

/*
*  Função que renderiza a página de edição de termos.
*/
const editTermsPage = async (req, res) => {
    try {
        const { type } = req.params; 
        const response = await api.get(`/terms/${type}`);

        if (response.data.term) {
            res.render('editTerms', { 
                title: `Editar Termos para ${type}`,
                content: response.data.term.content,
                type: type,
            });
        } else {
            res.status(404).render('error', { message: `Termos não encontrados para ${type}` });
        };
    } catch (error) {
        console.error('Erro ao buscar os termos:', error);
        res.status(500).render('error', { message: 'Erro ao carregar os termos' });
    };
};

/*
*  Função que renderiza a página de termos.
*/
const getTermsPage = async (req, res) => {
    try {
        const { type } = req.params;  
        const response = await api.get(`/terms/${type}`);
        const term = response.data.term;

        if (response.data.term) {
            res.render('terms', { term });
        } else {
            res.status(404).render('error', { message: `Termos não encontrados para ${type}` });
        };
    } catch (error) {
        console.error('Erro ao buscar os termos:', error);
        res.status(500).render('error', { message: 'Erro ao carregar os termos' });
    };
};

/*
*  Função que renderiza a página de termos.
*/
const getAllTerms = async (req, res) => {
    try {
        const response = await api.get('/terms');
        const terms = response.data.terms;

        if (terms.length === 0) {
            req.flash('errorMessage', 'Nenhum termo foi encontrado');
            return res.redirect('/dashboard/terms');
        };

        res.render('termList', { terms });

    } catch (error) {
        console.error('Erro ao buscar os termos:', error);
        req.flash('errorMessage', 'Erro ao carregar os termos. Tente novamente mais tarde.');
        res.status(500).render('error', { message: 'Erro ao carregar os termos, por favor, tente novamente mais tarde.' });
    };
};

/*
*  Função que salva a página de termos.
*/
const saveTermsPage = async (req, res) => {
    const { type } = req.body;
    const content = req.body.content;

    if (!content || !type) {
        return res.status(400).render('error', { message: 'Conteúdo ou tipo faltando' });
    };

    try {
        const response = await api.put('/terms', { content, type });

        if (response.status === 200) {
            req.flash("successMessage", "Alteração feita com sucesso!");
            return res.redirect(`/dashboard/edit-terms/${type}`)
        } else {
            res.status(500).render('error', { message: 'Falha ao salvar os termos' });
        };
    } catch (error) {
        console.error('Erro ao salvar os termos:', error);
        res.status(500).render('error', { message: 'Erro ao salvar os termos' });
    };
};

export default {
    editTermsPage,saveTermsPage,
    getTermsPage, getAllTerms,
};
