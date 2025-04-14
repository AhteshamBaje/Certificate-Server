import express from 'express'
import { deleteExperience, Experience, experienceData, ExperienceList, expUpdateForm, searchExpData, totalExpRecords, uploadExpFile } from '../Controllers/Experience Controllers.js';

const ExpRouter = express.Router();

ExpRouter.post('/experienceForm', Experience);
ExpRouter.get('/data/:id', experienceData);
ExpRouter.get('/experiencelist/:page', ExperienceList);
ExpRouter.delete('/delexperience/:id', deleteExperience);
ExpRouter.put('/updateexperience/:id', expUpdateForm);
ExpRouter.get('/searchdata/:name', searchExpData);
ExpRouter.post('/experience/upload' , uploadExpFile);
ExpRouter.get('/totalRecords' , totalExpRecords);


export default ExpRouter;