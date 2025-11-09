import { api, apiWithToken } from '../config/config.js';

/*
*   Função que busca todas as instituições cadastradas na API e renderiza a página de listagem de instituições.
*/
const getInstitutions = async (req, res) => {
    try {
        const apiInstance = apiWithToken(req.session.token);
        const response = await apiInstance.get("/institutions");
        const institutions = response.data.data;
        res.render('institutions/institutionList', { institutions })
    } catch (error) {
        console.error('Erro ao buscar instituições:', error);
        res.status(500).render('error', { message: 'Erro ao buscar instituições' });
    };
};

/*
*   Função que cria uma nova instituição usando a API com a operação POST.
*/
const createInstitution = async (req, res) => {
    const {
        name, cnpj, email, main_phone, secondary_phone, website,
        institution_category, instagram,
        link_maps, institution_description_pt, institution_description_en, institution_description_fr,
        institution_description_es, service_hours_pt, service_hours_en,  service_hours_fr,
        service_hours_es, target_populations_pt, target_populations_en,
        target_populations_fr,  target_populations_es,  requirements_restrictions_pt,
        requirements_restrictions_en,  requirements_restrictions_fr, requirements_restrictions_es,
        services_offered_pt, services_offered_en, services_offered_fr, services_offered_es,
        service_costs_pt, service_costs_en, service_costs_fr, service_costs_es, postal_code,
        street, neighborhood, city,  state, numero,  complemento, responsible_user_name,
        responsible_user_position, responsible_user_sector,  responsible_user_role, authorized
    } = req.body;

    // Função para garantir que os campos sejam null se não forem informados
    const ensureNull = (value) => (value === undefined || value === null || value === '') ? null : value;

    const institution = {
        name: ensureNull(name), 
        cnpj: ensureNull(cnpj),  
        email: ensureNull(email),
        main_phone: ensureNull(main_phone),  
        secondary_phone: ensureNull(secondary_phone),
        website: ensureNull(website), 
        link_maps: ensureNull(link_maps),
        address_number: ensureNull(numero), 
        address_complement: ensureNull(complemento),
        category_id: ensureNull(institution_category),
        responsible_user_name: ensureNull(responsible_user_name),
        responsible_user_sector: ensureNull(responsible_user_sector),
        responsible_user_position: ensureNull(responsible_user_position),
        responsible_user_role: ensureNull(responsible_user_role),
        instagram: ensureNull(instagram),
        consent: authorized === "on" ? true : false,
        purpose: 'empty',
        registration_data: Date.now(),
    };

    const institution_descriptions = {
        institution_description_pt: ensureNull(institution_description_pt),
        institution_description_en: ensureNull(institution_description_en),
        institution_description_fr: ensureNull(institution_description_fr),
        institution_description_es: ensureNull(institution_description_es),
    };

    const service_hours = {
        service_hours_pt: ensureNull(service_hours_pt),
        service_hours_en: ensureNull(service_hours_en),
        service_hours_fr: ensureNull(service_hours_fr),
        service_hours_es: ensureNull(service_hours_es),
    };

    const target_populations = {
        target_populations_pt: ensureNull(target_populations_pt),
        target_populations_en: ensureNull(target_populations_en),
        target_populations_fr: ensureNull(target_populations_fr),
        target_populations_es: ensureNull(target_populations_es),
    };

    const requirements_restrictions = {
        requirements_restrictions_pt: ensureNull(requirements_restrictions_pt),
        requirements_restrictions_en: ensureNull(requirements_restrictions_en),
        requirements_restrictions_fr: ensureNull(requirements_restrictions_fr),
        requirements_restrictions_es: ensureNull(requirements_restrictions_es),
    };

    const services_offered = {
        services_offered_pt: ensureNull(services_offered_pt),
        services_offered_en: ensureNull(services_offered_en),
        services_offered_fr: ensureNull(services_offered_fr),
        services_offered_es: ensureNull(services_offered_es),
    };

    const service_cost = {
        services_costs_pt: ensureNull(service_costs_pt),
        services_costs_en: ensureNull(service_costs_en),
        services_costs_fr: ensureNull(service_costs_fr),
        services_costs_es: ensureNull(service_costs_es),
    };

    const address = {
        postal_code: ensureNull(postal_code),
        street: ensureNull(street),
        neighborhood: ensureNull(neighborhood),
        city: ensureNull(city),
        state: ensureNull(state),
    };


    const newData = {
        institution, address, institution_descriptions,
        service_hours, target_populations, requirements_restrictions,
        services_offered, service_cost,
    };

    try {
        const apiInstance = apiWithToken(req.session.token);
        const response = await apiInstance.post(`/institutions`, newData);
        const institutionId = response.data.data?.institution.id || response.data.institution?.id;
        
        res.render('institutions/redirect', { institutionId });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao criar a instituição.' });
    };
};

/*
*   Função que busca instituições pelo nome, CNPJ ou telefone e renderiza a página de listagem de instituições.
*/
const searchInstitutions = async (req, res) => {
    try {
        const apiInstance = apiWithToken(req.session.token);
        const query = req.query.query; 
    const response = await apiInstance.get(`/institutions/search?q=${query}`);
    const institutions = response.data.data || response.data.institutions;

        if(!institutions || institutions.length === 0){
            res.render('institutions/institutionList', { error: 'Nenhum resultado foi encontrado', institutions })
        };
        res.render('institutions/institutionList', { institutions });
    } catch (error) {
        console.error('Erro ao buscar instituições:', error);
        res.status(500).render('error', { message: 'Erro ao buscar a instituição.' });
    };
};

/*
*   Função que busca uma instituição pelo ID e renderiza a página de detalhes da instituição.
*/
const getInstitutionById = async (req, res) => {

    const apiInstance = apiWithToken(req.session.token);
    const institutionId =  req.body.institution_id;
    if (!institutionId) {
        console.error('ID da instituição não foi fornecido.');
        return res.status(400).send({ message: 'ID da instituição não fornecido.' });
    };

    try {
    const response = await apiInstance.get(`/institutions/${institutionId}`);
    const institution = response.data.data || response.data.institution || null;
        if (!institution) {
            return res.status(404).send({ message: 'Instituição não encontrada.' });
        };

        res.render('institutions/institutionDetails', { institution });
    } catch (error) {
        console.error('Erro ao buscar detalhes da instituição:', error.message);
        res.status(500).render('error', { message: 'Erro ao obter os detalhes da instituição.' });
    };
};

/*
*   Função que busca uma instituição pelo ID e renderiza a página de edição da instituição.
*/
const getEditInstitutionForm = async (req, res) => {
    const institutionId = req.body.institution_id; 

    const apiInstance = apiWithToken(req.session.token);
    try {
    const response = await apiInstance.get(`/institutions/${institutionId}`);
    const responseCategories = await apiInstance.get('/categories');

    // OpenAPI: categories are returned as { data: [categories] }
    const categories = responseCategories.data.data || responseCategories.data.categories;
    const institution = response.data.data || response.data.institution;
        

        if (!institution) {
            return res.status(404).send({ message: 'Instituição não encontrado.' });
        };

        res.render('institutions/institutionEdit', { institution, categories }); 
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao obter os detalhes da instituição para edição.' });
    };
};

/*
*   Função que atualiza uma instituição pelo ID usando a API com a operação PUT.
*/
const updateInstitution = async (req, res) => {
    const institutionId = req.body.institution_id;
    const {
        name, cnpj, email, main_phone, secondary_phone, website,
        institution_category, instagram,
        link_maps, institution_description_pt, institution_description_en, institution_description_fr,
        institution_description_es, service_hours_pt, service_hours_en,  service_hours_fr,
        service_hours_es, target_populations_pt, target_populations_en,
        target_populations_fr,  target_populations_es,  requirements_restrictions_pt,
        requirements_restrictions_en,  requirements_restrictions_fr, requirements_restrictions_es,
        services_offered_pt, services_offered_en, services_offered_fr, services_offered_es,
        service_costs_pt, service_costs_en, service_costs_fr, service_costs_es, postal_code,
        street, neighborhood, city,  state, numero,  complemento, responsible_user_name,
        responsible_user_position, responsible_user_sector,  responsible_user_role,
    } = req.body;

    // Função para garantir que os campos sejam null se não forem informados
    const ensureNull = (value) => (value === undefined || value === null || value === '') ? null : value;

    const institution = {
        name: ensureNull(name), 
        cnpj: ensureNull(cnpj),  
        email: ensureNull(email),
        main_phone: ensureNull(main_phone),  
        secondary_phone: ensureNull(secondary_phone),
        website: ensureNull(website), 
        institution_category: ensureNull(institution_category),
        link_maps: ensureNull(link_maps),
        address_number: ensureNull(numero), 
        address_complement: ensureNull(complemento),
        category_id: ensureNull(institution_category),
        responsible_user_name: ensureNull(responsible_user_name),
        responsible_user_sector: ensureNull(responsible_user_sector),
        responsible_user_position: ensureNull(responsible_user_position),
        responsible_user_role: ensureNull(responsible_user_role),
        instagram: ensureNull(instagram),
    };

    const institution_descriptions = {
        institution_description_pt: ensureNull(institution_description_pt),
        institution_description_en: ensureNull(institution_description_en),
        institution_description_fr: ensureNull(institution_description_fr),
        institution_description_es: ensureNull(institution_description_es),
    };

    const service_hours = {
        service_hours_pt: ensureNull(service_hours_pt),
        service_hours_en: ensureNull(service_hours_en),
        service_hours_fr: ensureNull(service_hours_fr),
        service_hours_es: ensureNull(service_hours_es),
    };

    const target_populations = {
        target_populations_pt: ensureNull(target_populations_pt),
        target_populations_en: ensureNull(target_populations_en),
        target_populations_fr: ensureNull(target_populations_fr),
        target_populations_es: ensureNull(target_populations_es),
    };

    const requirements_restrictions = {
        requirements_restrictions_pt: ensureNull(requirements_restrictions_pt),
        requirements_restrictions_en: ensureNull(requirements_restrictions_en),
        requirements_restrictions_fr: ensureNull(requirements_restrictions_fr),
        requirements_restrictions_es: ensureNull(requirements_restrictions_es),
    };

    const services_offered = {
        services_offered_pt: ensureNull(services_offered_pt),
        services_offered_en: ensureNull(services_offered_en),
        services_offered_fr: ensureNull(services_offered_fr),
        services_offered_es: ensureNull(services_offered_es),
    };

    const service_cost = {
        services_costs_pt: ensureNull(service_costs_pt),
        services_costs_en: ensureNull(service_costs_en),
        services_costs_fr: ensureNull(service_costs_fr),
        services_costs_es: ensureNull(service_costs_es),
    };

    const address = {
        postal_code: ensureNull(postal_code),
        street: ensureNull(street),
        neighborhood: ensureNull(neighborhood),
        city: ensureNull(city),
        state: ensureNull(state),
    };


    const newData = {
        institution, address, institution_descriptions,
        service_hours, target_populations, requirements_restrictions,
        services_offered, service_cost,
    };


    try {
        const apiInstance = apiWithToken(req.session.token);
        await apiInstance.patch(`/institutions/${institutionId}`, newData); 
        res.render('institutions/redirect', { institutionId });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao atualizar a instituição.' });
    };
};

/*
*   Função que deleta uma instituição pelo ID usando a API com a operação DELETE.
*/
const deleteInstitution = async (req, res) => {
    try {
        const apiInstance = apiWithToken(req.session.token);
        const institutiontId = req.body.institution_id; 
        await apiInstance.delete(`/institutions/${institutiontId}`);
        
        res.redirect('/dashboard/institutions'); 
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao deletar a instituição.' });
    };
};

/*
*   Função que renderiza a página de cadastro de instituição.
*/
const getRegisterInstitution = async (req, res) => {
    try {
        const apiInstance = apiWithToken(req.session.token);
        const responseCategories = await apiInstance.get('/categories');
        const categories = responseCategories.data.data || responseCategories.data.categories;
        res.render('institutions/institutionCreate', { categories }); 
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erro ao carregar a página de cadastro.' });

    };
};

/*
*   Função para verificar se um email já está cadastrado no banco de dados.
*/
const checkEmail = async (req, res) => {
    try {
        const apiInstance = apiWithToken(req.session.token);
        const email = req.query.email || req.body.email;
        const emailExistResponse = await apiInstance.get(`/institutions/check-email?email=${email}`);
        const exists = emailExistResponse.data.exists || emailExistResponse.data.data?.exists;
        
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
    getInstitutions,searchInstitutions, getInstitutionById,
    getEditInstitutionForm,updateInstitution,deleteInstitution,
    getRegisterInstitution,createInstitution, checkEmail
};