import express from 'express'
import {deleteInternship, internship , internshipData, searchData, studentsList, totalRecords, updateInternship, uploadFile} from "../Controllers/internshipControllers.js"

const router = express.Router();

router.post('/internship', internship);
router.get('/data/:id', internshipData);
router.get('/studentlist/:page', studentsList);
router.delete('/delIntern/:id', deleteInternship);
router.put('/updateIntern/:id', updateInternship);
router.get('/searchdata/:name', searchData);
router.post('/internship/upload' , uploadFile);
router.get('/totalRecords' , totalRecords);


export default router;