/*
* Função que verifica se o usuário é um administrador.
*/
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); 
    } else {
        const redirectUrl = req.session.returnTo || '/dashboard/home'; 
        delete req.session.returnTo; 
        return res.redirect(redirectUrl); 
    };
};

export default {
    isAdmin
};