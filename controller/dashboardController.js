import { api, apiWithToken } from '../config/config.js';
import jwt from 'jsonwebtoken';

/*
*  Função de login, que autentica o usuário e redireciona para a página de dashboard.
*/
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
    const response = await api.post('/auth/admins/login', { email: username, password });
    const token = response.data.token || response.data.data?.token;
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
                req.session.user = decodedToken;
                req.session.token = token;
        
                const redirectUrl = req.session.returnTo || '/dashboard/home'; 
                delete req.session.returnTo;
        
                return res.redirect(redirectUrl); 
            } catch (err) {
                return res.render('login', { error: "Token inválido. Tente novamente." });
            }
        };

        return res.render('login', { error: "Token inválido. Tente novamente." });
    } catch (error) {

        if(error.status === 403 || error.status === 401){
        return res.render('login', { error: 'Credenciais inválidas' });
        };         

        console.log(error);
        return res.render('login', { error: 'Ocorreu um erro na autenticação. Tente novamente mais tarde.' });
    };
};

/*
*   Função de logout, que destroi a sessão do usuário e redireciona para a página de login.
*/
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard/home');
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/login');
    });
};

/*
*   Função que renderiza a página de login. Caso o usuário já esteja logado, redireciona para a página inicial.
*/
const getLogin = (req, res) => {
    if(req.session && req.session.token){
         res.redirect('/dashboard/home');
    }
    res.render('login');
};

/*
*  Função que renderiza a página inicial com a quantidade de instituições e migrantes cadastrados, e a quantidade de
*  formulários pendentes de leitura.
*/
const getHome = async (req, res) => {
    try {
        const apiInstance = apiWithToken(req.session.token);

    const institutionResponse = await apiInstance.get('/institutions/count');
    const institutionCount = institutionResponse.data.count || institutionResponse.data.data?.count || 0;

    const migrantResponse = await apiInstance.get('/migrants/count');
    const migrantCount = migrantResponse.data.count || migrantResponse.data.data?.count || 0;

    const pendingFormsResponse = await apiInstance.get('/forms/count-unread');
    const pendingFormsCount = pendingFormsResponse.data.count || pendingFormsResponse.data.data?.count || 0;

    const userCountResponse = await apiInstance.get('/users/count');
    const userCount = userCountResponse.data.count || userCountResponse.data.data?.count || 0;

        res.render('home', { institutionCount, migrantCount, pendingFormsCount, userCount });
    } catch (error) {
        console.error('Erro ao buscar informações:', error);
        res.status(500).render('error', { message: 'Erro ao buscar informações' });
    }
};

/*
*  Função que renderiza a página do manual do migrante.
*/
const getManual = async (req, res) => {
    try {
    // OpenAPI: list migrant manuals under /migrant-manuals
    const apiInstance = apiWithToken(req.session.token);
    const response = await apiInstance.get('/migrant-manuals');
    const pdfs = response.data.data || response.data.pdfs || [];

    res.render('manual', { pdfs });
    } catch (error) {
        console.error('Erro ao buscar o manual:', error);
        res.status(500).render('error', { message: 'Erro ao carregar o manual' });        
    }
};

/*
*  Função que atualiza o manual do migrante. 
*/
const updateManual = async (req, res) => {
    try {
        const { pdf_id } = req.body;
        
        const name = req.body[`name_${pdf_id}`]; 
        const description = req.body[`description_${pdf_id}`];
        const url = req.body[`url_${pdf_id}`]; 
        const language = req.body.language;
        const updatePdf = { name, description, url, language };

        const apiInstance = apiWithToken(req.session.token);
        const updateResponse = await apiInstance.patch(`/migrant-manuals/${pdf_id}`, updatePdf);

        if (updateResponse.status === 200 || updateResponse.status === 204) {
            req.flash('successMessage', 'Manual do Migrante atualizado com sucesso!');
        } else {
            req.flash('errorMessage', 'Erro ao atualizar o manual.');
        }
        res.redirect('/dashboard/manual-migrante');  
    } catch (error) {
        console.error('Erro ao atualizar o manual:', error);
        req.flash('errorMessage', 'Erro ao atualizar o manual. Tente novamente mais tarde.');
        res.redirect('/dashboard/manual-migrante');
    };
};

export default {
    login, logout,
    getLogin, getHome,
    getManual,updateManual
}

