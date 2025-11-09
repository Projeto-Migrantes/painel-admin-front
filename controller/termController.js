import { apiWithToken, api } from "../config/config.js";

/*
*  Função que renderiza a página de edição de termos.
*/
const editTermsPage = async (req, res) => {
    try {

        const apiInstance = apiWithToken(req.session.token);
        const { type } = req.params; 
        const response = await apiInstance.get(`/terms/${type}`);
        // OpenAPI: term may be under data or term
        const term = response.data.data || response.data.term || null;

        if (term) {
            res.render('editTerms', { 
                title: `Editar Termos para ${type}`,
                content: term.content || term.term_condition_pt || term.term_condition || '',
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
        const apiInstance = apiWithToken(req.session.token);
        const response = await apiInstance.get(`/terms/${type}`);
        const term = response.data.data || response.data.term || null;

        if (term) {
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
        const apiInstance = apiWithToken(req.session.token);
        const response = await apiInstance.get('/terms');
        const terms = response.data.data || response.data.terms || [];

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
        const apiInstance = apiWithToken(req.session.token);
        const response = await apiInstance.put(`/terms/${type}`, { content });

        if (response.status === 200 || response.status === 204) {
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
