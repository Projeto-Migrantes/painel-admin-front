import { Router } from "express";
import migrantController from '../controller/migrantController.js';
import institutionController from '../controller/institutionController.js'
import termController from "../controller/termController.js";
import checkAuth from "../middlewares/checkAuth.js";
import dashboardController from "../controller/dashboardController.js";
import userController from "../controller/userController.js";
import checkAuthAdmin from '../middlewares/checkAuthAdmin.js';

const router = Router();

/* 
* Rotas do Painel Administrativo
*/

// Rota principal do painel administrativo
router.get('/home', checkAuth.auth, dashboardController.getHome);

// Rotas migrantes
router.post('/migrants/check-email', checkAuth.auth, migrantController.checkEmail);
router.post('/migrants/delete', checkAuth.auth, migrantController.deleteMigrant);
router.get('/migrants', checkAuth.auth, migrantController.getMigrants);
router.post('/migrant/create', checkAuth.auth, migrantController.createMigrant);
router.get('/migrant/register', checkAuth.auth, migrantController.getRegisterMigrant);
router.post('/migrants', checkAuth.auth, migrantController.createMigrant);
router.get('/migrants/search', checkAuth.auth, migrantController.searchMigrant);
router.post('/migrants/edit', checkAuth.auth, migrantController.getEditMigrantForm);
router.post('/migrants/update', checkAuth.auth, migrantController.updateMigrant); 
router.post('/migrants/details', checkAuth.auth, migrantController.getMigrantById);
router.post('/migrants/change-password', checkAuth.auth, migrantController.getUpdatePassword);
router.post('/migrants/updatePassword', checkAuth.auth, migrantController.updatePassword);

// Rotas usuários
router.post('/users/check-email', checkAuth.auth, userController.checkEmail);
router.get('/users', checkAuth.auth, checkAuthAdmin.isAdmin, userController.getUsers);
router.post('/users/delete', checkAuth.auth, checkAuthAdmin.isAdmin, userController.deleteUser);
router.post('/users/edit', checkAuth.auth, checkAuthAdmin.isAdmin, userController.getEditUserForm);
router.post('/users/update', checkAuth.auth, checkAuthAdmin.isAdmin, userController.updateUser);
router.post('/users/create', checkAuth.auth, checkAuthAdmin.isAdmin, userController.createUser);
router.get('/user/register', checkAuth.auth, checkAuthAdmin.isAdmin, userController.getRegisterUser);
router.post('/users/change-password', checkAuth.auth, checkAuthAdmin.isAdmin, userController.getUpdatePassword);
router.post('/users/updatePassword', checkAuth.auth, checkAuthAdmin.isAdmin, userController.updatePassword);

// Rotas instituições
router.post('/institutions/check-email', checkAuth.auth, institutionController.checkEmail);
router.get('/institutions', checkAuth.auth, institutionController.getInstitutions);
router.get('/institutions/search', checkAuth.auth, institutionController.searchInstitutions);
router.post('/institutions/details', checkAuth.auth, institutionController.getInstitutionById);
router.post('/institutions/edit', checkAuth.auth, institutionController.getEditInstitutionForm);
router.post('/institutions/update', checkAuth.auth, institutionController.updateInstitution); 
router.post('/institutions/delete', checkAuth.auth, institutionController.deleteInstitution);
router.post('/institution/create', checkAuth.auth, institutionController.createInstitution);
router.get('/institution/register', checkAuth.auth, institutionController.getRegisterInstitution);

// Rotas Termos
router.get('/terms', checkAuth.auth, termController.getAllTerms);
router.get('/edit-terms/:type', checkAuth.auth, checkAuthAdmin.isAdmin, termController.editTermsPage);
router.get('/terms/:type', checkAuth.auth, termController.getTermsPage);
router.post('/save-terms', checkAuth.auth, checkAuthAdmin.isAdmin, termController.saveTermsPage);

// Rotas Forms
router.get('/forms/migrants', checkAuth.auth, migrantController.getForms);
router.get('/forms/status', checkAuth.auth, migrantController.getFormsByStatus);
router.post('/forms/read', checkAuth.auth, migrantController.formRead);
router.post('/forms/resolved', checkAuth.auth, migrantController.formResolved);
router.post('/forms/delete', checkAuth.auth, migrantController.deleteForms);

// Rotas Manual do Migrante
router.get('/manual-migrante', checkAuth.auth, checkAuthAdmin.isAdmin, dashboardController.getManual);
router.post('/update-manual', checkAuth.auth, checkAuthAdmin.isAdmin, dashboardController.updateManual);

export default router;
