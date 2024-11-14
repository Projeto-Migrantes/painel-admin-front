import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/*
*  Função que verifica se o usuário está autenticado.
*/
const auth = (req, res, next) => {
    const token = req.session.token;

    if (!token) {
        return res.redirect('/login');
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.redirect('/login');
    };
};

const noAuth = (req, res, next) => {
    const token = req.session.token;
    if (token) {
        return res.redirect('/dashboard/home');
    };

    next();
};

export default {
    auth,
    noAuth,
};
