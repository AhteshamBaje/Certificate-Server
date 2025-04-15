import express from 'express'
import { course , courseData, courseStudentsList, courseUpdateForm, deleteCourse, issuedDate, searchData3, totalRecords, uploadFile } from '../Controllers/CourseControllers.js';

const courseRouter = express.Router();

courseRouter.post('/courseForm', course);
courseRouter.get('/data/:id' , courseData);
courseRouter.get('/courseList/:page' , courseStudentsList);
courseRouter.delete('/delCourse/:id' , deleteCourse);
courseRouter.get('/searchdata3/:name' , searchData3);
courseRouter.post('/course/upload' , uploadFile);
courseRouter.get('/totalRecords' , totalRecords);
courseRouter.put('/course/update/:id', courseUpdateForm);
courseRouter.put('/issuedDate/:id',issuedDate);

export default courseRouter;
