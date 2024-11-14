import { api } from '../config/config.js';

/*
*   Função para buscar todos os usuários cadastrados no sistema.
*/
const getUsers = async (req, res) => {
    try {
        const response = await api.get('/users');
        const users = response.data.users;

        res.render('users/userList', { users })
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).render('error', { message: 'Erro ao buscar usuários' });
    };
};

/*
*   Função para renderizar a página de cadastro de um novo usuário.
*/
const getRegisterUser = (req, res) => {
    try {
        
        res.render('users/userCreate');
       } catch (error) {
           res.render('error', { error });
           res.status(500).render('error', { message: 'Erro ao acessar a página de cadastro.' });
       };
};

/*
*   Função para criar um novo usuário.
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
         await api.post('/users', newData);

        req.flash('successMessage', 'Usuário cadastrado com sucesso!');
        res.redirect('/dashboard/users');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao cadastrar o usuário' });
    };
};

/*
*   Função para renderizar a página de edição de um usuário.
*/
const getEditUserForm = async (req, res) => {
    const userId = req.body.user_id; 

    try {
        const response = await api.get(`/users/${userId}`);
        const user = response.data.user;

        if (!user) {
            return res.status(404).send({ message: 'Usuário não encontrado.' });
        };

        res.render('users/userEdit', { user });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao obter os detalhes do usuário para edição.' });
    };
};

const updateUser = async (req, res) => {
    const userId = req.body.user_id;
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
        await api.put(`/users/${userId}`, updatedData);

        req.flash('successMessage', 'Usuário atualizado com sucesso!');
        res.redirect('/dashboard/users');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao atualizar o usuário' });
    };
};

/*
*   Função para deletar um usuário.
*/
const deleteUser = async (req, res) => {
    const userId = req.body.user_id;
    try {
        await api.delete(`/users/${userId}`);

        req.flash('successMessage', 'Usuário deletado com sucesso!');
        res.redirect('/dashboard/users');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao deletar o usuário' });
    };
};

/*
*   Função para renderizar a página de atualização de senha do usuário.
*/
const getUpdatePassword = async (req, res) => {
    try {
        const { user_id, user_role, user_name, user_email } = req.body;
        const user_edit = {
            id: user_id,
            name: user_name,
            email: user_email,
            role: user_role,
        };

        res.render('users/userUpdatePassword', { user_edit });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao carregar página de atualização de senha.' });
    };
};

/*
*   Função para atualizar a senha do usuário.
*/
const updatePassword = async (req, res) => {
    try {
        const { confirmPassword } = req.body;
        const userId = req.body.user_id;
        api.patch(`/users/change-password/${userId}`, {password: confirmPassword} );

        req.flash('successMessage', 'Senha atualizada com sucesso!');
        res.redirect('/dashboard/users');
    } catch (error) {
        console.error('Erro ao buscar alterar senhar:', error);
        return res.render('migrants/migrantUpdatePassword', { error: 'Erro ao atualizar senha do usuário.' });
    };
};

/*
*   Função para verificar se um email já está cadastrado no banco de dados.
*/
const checkEmail = async (req, res) => {
    try {
        const email = req.body.email;
        
        const emailExistResponse = await api.post('/users/check-email', { email });

        const exists = emailExistResponse.data.exists;
        
        if (exists) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        };
    } catch (error) {
        console.error(error); 
        res.status(500).render('error', { message: 'Erro ao verifiacar email.' });
    };
};

export default {
    getUsers, getRegisterUser, createUser,
    getEditUserForm, updateUser, deleteUser,
    getUpdatePassword, updatePassword, checkEmail,
};