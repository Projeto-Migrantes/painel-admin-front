import { api, apiWithToken } from '../config/config.js';

/*
*   Função para buscar todos os administradores cadastrados no sistema.
*/
const getUsers = async (req, res) => {
    try {
    const apiInstance = apiWithToken(req.session.token);
    const response = await apiInstance.get('/administrators');
    let administrators = response.data.data || response.data.administrators || [];
        administrators = administrators.filter(administrator => administrator.email !== req.administrator.email);
        res.render('administrators/administratorList', { administrators })
    } catch (error) {
        console.error('Erro ao buscar administradores:', error);
        res.status(500).render('error', { message: 'Erro ao buscar administrador' });
    };
};

/*
*   Função para renderizar a página de cadastro de um novo administrador.
*/
const getRegisterUser = (req, res) => {
    try {
        
        res.render('administrators/administratorCreate');
       } catch (error) {
        res.render('error', { error });
        res.status(500).render('error', { message: 'Erro ao acessar a página de cadastro.' });
       };
};

/*
*   Função para criar um novo administrador.
*/
const createUser = async (req, res) => {
    const {
        name,email, role, password
    } = req.body;


    const newData = {
        name,
        email,
        role,
        password
    };

    try {
        const apiInstance = apiWithToken(req.session.token);
         await api.post('/administrators', newData);

        req.flash('successMessage', 'Administrador cadastrado com sucesso!');
        res.redirect('/dashboard/administrators');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao cadastrar o administrador' });
    };
};

/*
*   Função para renderizar a página de edição de um administrador.
*/
const getEditUserForm = async (req, res) => {
    const administratorId = req.body.administrator_id; 

    try {
    const response = await api.get(`/administrators/${administratorId}`);
    const administrator = response.data.data || response.data.administrator || null;

        if (!administrator) {
            return res.status(404).send({ message: 'Administrador não encontrado.' });
        };

        res.render('administrators/administratorEdit', { administrator });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao obter os detalhes do administrador para edição.' });
    };
};

const updateUser = async (req, res) => {
    const administratorId = req.body.administrator_id;
    const {
        name,
        email,
        role,
    } = req.body;

    const updatedData = {
        name,
        email,
        role,
    };

    try {
    // OpenAPI: prefer PATCH for partial updates
    await api.patch(`/administrators/${administratorId}`, updatedData);

        req.flash('successMessage', 'Administrador atualizado com sucesso!');
        res.redirect('/dashboard/administrators');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao atualizar o administrador' });
    };
};

/*
*   Função para deletar um administrador.
*/
const deleteUser = async (req, res) => {
    const administratorId = req.body.administrator_id;
    try {
        await api.delete(`/administrators/${administratorId}`);

        req.flash('successMessage', 'Administrador deletado com sucesso!');
        res.redirect('/dashboard/administrators');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao deletar o administrador' });
    };
};

/*
*   Função para renderizar a página de atualização de senha do administrador.
*/
const getUpdatePassword = async (req, res) => {
    try {
        const { administrator_id, administrator_role, administrator_name, administrator_email } = req.body;
        const administrator_edit = {
            id: administrator_id,
            name: administrator_name,
            email: administrator_email,
            role: administrator_role,
        };

        res.render('administrators/administratorUpdatePassword', { administrator_edit });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao carregar página de atualização de senha.' });
    };
};

/*
*   Função para atualizar a senha do administrador.
*/
const updatePassword = async (req, res) => {
    try {
        const { confirmPassword } = req.body;
        const administratorId = req.body.administrator_id;
        api.patch(`/administrators/change-password/${administratorId}`, {password: confirmPassword} );

        req.flash('successMessage', 'Senha atualizada com sucesso!');
        res.redirect('/dashboard/administrators');
    } catch (error) {
        console.error('Erro ao buscar alterar senhar:', error);
        return res.render('migrants/migrantUpdatePassword', { error: 'Erro ao atualizar senha do administrador.' });
    };
};

/*
*   Função para verificar se um email já está cadastrado no banco de dados.
*/
const checkEmail = async (req, res) => {
    try {
        const email = req.body.email;
        
        const emailExistResponse = await api.post('/administrators/check-email', { email });

        const exists = emailExistResponse.data.exists;
        
        if (exists) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        };
    } catch (error) {
        console.error(error); 
        res.status(500).render('error', { message: 'Erro ao verificar email.' });
    };
};

export default {
    getUsers, getRegisterUser, createUser,
    getEditUserForm, updateUser, deleteUser,
    getUpdatePassword, updatePassword, checkEmail,
};