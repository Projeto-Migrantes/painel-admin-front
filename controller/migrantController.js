import { apiWithToken, api} from '../config/config.js';

/*
*   Função para buscar todos os migrantes cadastrados na API e renderizar a página de listagem.
*/
const getMigrants = async (req, res) => {
    try {
    const apiInstance = apiWithToken(req.session.token);
    const response = await apiInstance.get("/migrants");
    const migrants = response.data.data;

        res.render('migrants/migrantsList', { migrants });
    } catch (error) {
        console.error('Erro ao buscar migrantes:', error);
        res.status(500).render('error', { message: 'Erro ao buscar migrantes' });
    };
};

/*
*   Função para deletar um migrante.
*/
const deleteMigrant = async (req, res) => {
    const migrantId = req.body.migrant_id; 
    try {
        const apiInstance = apiWithToken(req.session.token);
        await apiInstance.delete(`/migrants/${migrantId}`);
        
        res.redirect('/dashboard/migrants'); 
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao deletar o migrante' })
    };
};

/*
*   Função para buscar um migrante pelo ID e renderizar a página de detalhes.
*/
const getMigrantById = async (req, res) => {
    const migrantId = req.body.migrant_id; 

    try {
        const apiInstance = apiWithToken(req.session.token);
        const response = await apiInstance.get(`/migrants/${migrantId}`);
        const migrant = response.data.data || response.data || null;

            if (!migrant) {
                return res.status(404).send({ message: 'Migrante não encontrado.' });
            };

        res.render('migrants/migrantDetails', { migrant });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao obter os detalhes do migrante' });
    };
};


/*
*   Função para criar um novo migrante.
*/
const createMigrant = async (req, res) => {
    const {
        full_name,
        social_name,
        email,
        phone_number,
        crnm,
        date_of_birth,
        language_preference,
        entry_into_brazil,
        migration_reason,
        gender,
        other_gender,
        country_of_origin,
        marital_status,
        literacy_level,
        postal_code,
        street,
        neighborhood,
        city,
        state,
        address_number,
        address_complement,
        password,
        authorized,
    } = req.body;

    const ensureNull = (value) =>
        value === undefined || value === null || value === "" ? null : value;

    const migrant = {
        full_name: ensureNull(full_name),
        social_name: ensureNull(social_name),
        email: ensureNull(email),
        phone_number: ensureNull(phone_number),
        crnm: ensureNull(crnm),
        date_of_birth: ensureNull(date_of_birth),
        language_preference: ensureNull(language_preference),
        entry_into_brazil: ensureNull(entry_into_brazil),
        migration_reason: ensureNull(migration_reason),
        gender: gender === "Outro" ? ensureNull(other_gender) : ensureNull(gender),
        country_of_origin: ensureNull(country_of_origin),
        marital_status: ensureNull(marital_status),
        literacy_level: ensureNull(literacy_level),
        address_number: ensureNull(address_number),
        address_complement: ensureNull(address_complement),
        password: ensureNull(password),
        // authorized: authorized === "on" ? true : false,
    };

    const address = {
        postal_code: ensureNull(postal_code),
        street: ensureNull(street),
        neighborhood: ensureNull(neighborhood),
        city: ensureNull(city),
        state: ensureNull(state),
    };

    const newData = { migrant, address };

    try {
        const apiInstance = apiWithToken(req.session.token);
        const response = await apiInstance.post("/migrants", newData);
        const migrantId = response.data.data.migrant?.id || response.data.migrant?.id;

        res.render("migrants/redirect", { migrantId });
    } catch (error) {
        console.error(error);

        if (error.response && error.response.data) {
        return res
            .status(400)
            .send({ message: error.response.data.message });
        }

        res
        .status(500)
        .render("error", { message: "Erro ao cadastrar o migrante." });
    }
};


/*
*   Função para renderizar a página de edição de um migrante.
*/
const getEditMigrantForm = async (req, res) => {
    const migrantId = req.body.migrant_id; 

    try {
    const apiInstance = apiWithToken(req.session.token);
    const response = await apiInstance.get(`/migrants/${migrantId}`);
    const migrant = response.data.data || response.data || null;

        if (!migrant) {
            return res.status(404).send({ message: 'Migrante não encontrado.' });
        };

        res.render('migrants/migrantEdit', { migrant });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao obter os detalhes do migrante para edição.' });
    };
};


/*
*   Função para renderizar a página de cadastro de um novo migrante.
*/
const getRegisterMigrant = async (req, res) => {
    try {
     res.render('migrants/migrantCreate'); 
    } catch (error) {
        res.render('error', { error });
        res.status(500).render('error', { message: 'Erro ao acessar a página de cadastro.' });
    };
};

/*
*   Função para atualizar um migrante.
*/
const updateMigrant = async (req, res) => {
    const migrantId = req.body.migrant_id;

    const {
        full_name,
        social_name,
        email,
        phone_number,
        crnm,
        date_of_birth,
        language_preference,
        entry_into_brazil,
        migration_reason,
        gender,
        country_of_origin,
        marital_status,
        literacy_level,
        postal_code,
        street,
        neighborhood,
        city,
        state,
        address_number,
        address_complement,
    } = req.body;

    const ensureNull = (value) =>
        value === undefined || value === null || value === "" ? null : value;

    const migrant = {
        full_name: ensureNull(full_name),
        social_name: ensureNull(social_name),
        email: ensureNull(email),
        phone_number: ensureNull(phone_number),
        crnm: ensureNull(crnm),
        date_of_birth: ensureNull(date_of_birth),
        language_preference: ensureNull(language_preference),
        entry_into_brazil: ensureNull(entry_into_brazil),
        migration_reason: ensureNull(migration_reason),
        gender: ensureNull(gender),
        country_of_origin: ensureNull(country_of_origin),
        marital_status: ensureNull(marital_status),
        literacy_level: ensureNull(literacy_level),
        address_number: ensureNull(address_number),
        address_complement: ensureNull(address_complement),
    };

    const address = {
        postal_code: ensureNull(postal_code),
        street: ensureNull(street),
        neighborhood: ensureNull(neighborhood),
        city: ensureNull(city),
        state: ensureNull(state),
    };

    const newData = { migrant, address };

    try {
        const apiInstance = apiWithToken(req.session.token);
        await apiInstance.patch(`/migrants/${migrantId}`, newData);

        res.render("migrants/redirect", { migrantId });
    } catch (error) {
        console.error(error);

        if (error.response && error.response.data) {
        return res
            .status(400)
            .send({ message: error.response.data.message });
        }

        res
        .status(500)
        .render("error", { message: "Erro ao atualizar o migrante." });
    }
};


/*
*   Função para buscar um migrante pelo telefone, email ou documento e renderizar a página de listagem.
*/
const searchMigrant = async (req, res) => {
    try {
        const query = req.query.query; 
        const apiInstance = apiWithToken(req.session.token);
    const response = await apiInstance.get(`/migrants/search?q=${query}`);
    const migrants = response.data.data || response.data.migrants;

        if(!migrants || migrants.length === 0){
            res.render('migrants/migrantsList', { error: 'Nenhum resultado foi encontrado', migrants })
        };

        res.render('migrants/migrantsList', { migrants });
    } catch (error) {
        console.error('Erro ao buscar migrantes:', error);
        res.status(500).render('error', { message: 'Erro ao buscar o migrante.' });
    };
};

/*
*   Função para verificar se um email já está cadastrado no banco de dados.
*/
const checkEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const apiInstance = apiWithToken(req.session.token);
    const emailExistResponse = await apiInstance.get(`/migrants/check-email?email=${email}`);
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

/*
*   Função para renderizar a página de atualização de senha do migrante.
*/
const getUpdatePassword = async (req, res) => {
    try {
        const migrantData = req.body.migrant;
        const migrant = JSON.parse(migrantData); 
        res.render('migrants/migrantUpdatePassword', { migrant });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao carregar página de atualização de senha.' });
    };
};

/*
*   Função para atualizar a senha do migrante.
*/
const updatePassword = async (req, res) => {
    try {
        const { confirmPassword } = req.body;
        const migrantId = req.body.migrant_id;
        const apiInstance = apiWithToken(req.session.token);
        apiInstance.patch(`/migrants/change-password/${migrantId}`, {password: confirmPassword} );

        res.render('migrants/migrantUpdatePassword', { success: 'Senha atualizada com sucesso.' } );
    } catch (error) {
        console.error('Erro ao buscar alterar senhar:', error);
        return res.render('migrants/migrantUpdatePassword', { error: 'Erro ao atualizar senha do migrante.' });
    }
};

/*
*   Função para buscar todos os formulários cadastrados na API e renderizar a página de listagem.
*/
const getForms = async (req, res) => {
    try {
    const apiInstance = apiWithToken(req.session.token);
    const response = await apiInstance.get("/forms");
    const forms = response.data.data || response.data.forms;

        if(!forms || forms.length === 0){
            res.render('forms/formsList', { error: 'Nenhum resultado foi encontrado', forms })
        };

        res.render('forms/formsList', { forms, selectedStatus: "" });
    } catch (error) {
        console.error('Erro ao buscar formulários:', error);
        res.status(500).render('error', { message: 'Erro ao buscar formulários' });
    };
};

/*
*   Função para buscar formulários por status.
*/
const getFormsByStatus = async (req, res) => {
    try {
        const status = req.query.status || ""; 
    const apiInstance = apiWithToken(req.session.token);
    const response = await apiInstance.get(`/forms?status=${status}`);
    const forms = response.data.data || response.data.forms;

        if (!forms || forms.length === 0) {
            return res.render('forms/formsList', { 
                error: 'Nenhum resultado foi encontrado', 
                forms: [], 
                selectedStatus: status 
            });
        }

        res.render('forms/formsList', { 
            forms, 
            selectedStatus: status 
        });
    } catch (error) {
        console.error('Erro ao buscar formulários: ', error.message);
        res.status(500).render('forms/formsList', { 
            error: 'Erro ao buscar formulários. Tente novamente mais tarde.', 
            forms: [], 
            selectedStatus: req.query.status 
        });
    }
};


/*
*   Função para marcar um formulário como "lido".
*/
const formRead = async (req, res) => {
    try {
        const { form_id } = req.body;
    const apiInstance = apiWithToken(req.session.token);
    await apiInstance.patch(`/forms/${form_id}`, { status: 'read'});
        req.flash('successMessage', 'Formulário marcado como "lido".')
        res.redirect('/dashboard/forms/migrants');
    } catch (error) {
        console.error('Erro ao atualizar status do formulário: ', error);
        res.status(500).render('error', { message: 'Erro ao atualizar formulário' })
    };
};

/*
*   Função para marcar um formulário como "resolvido".
*/
const formResolved = async (req, res) => {
    try {
        const { form_id } = req.body;
   const apiInstance = apiWithToken(req.session.token);
    await apiInstance.patch(`/forms/${form_id}`, { status: 'resolved'});
        req.flash('successMessage', 'Formulário marcado como "resolvido".')
        res.redirect('/dashboard/forms/migrants');
    } catch (error) {
        console.error('Erro ao atualizar status do formulário: ', error);
        res.status(500).render('error', { message: 'Erro ao atualizar formulário' })
    };
};

/*
*   Função para deletar um formulário.
*/
const deleteForms = async (req, res) => {
    const { form_id } = req.body; 
    try {
        const apiInstance = apiWithToken(req.session.token);
        await apiInstance.delete(`/forms/${form_id}`);
        
        req.flash('successMessage', 'Formulário deletado com sucesso.')
        res.redirect('/dashboard/forms/migrants'); 
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Erro ao deletar o formulário.' });
    };
};
 
export default {
    getMigrants, getMigrantById, createMigrant, updateMigrant,
    deleteMigrant, searchMigrant, getEditMigrantForm, getRegisterMigrant,
    checkEmail, getUpdatePassword, updatePassword, getForms, getFormsByStatus,
    formRead, formResolved, deleteForms,
}