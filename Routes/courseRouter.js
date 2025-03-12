import express from 'express'
import { course , courseData, courseStudentsList, deleteCourse, searchData3, totalRecords, uploadFile } from '../Controllers/CourseControllers.js';

const courseRouter = express.Router();

courseRouter.post('/courseForm', course);
courseRouter.get('/data/:id' , courseData);
courseRouter.get('/courseList/:page' , courseStudentsList);
courseRouter.delete('/delCourse/:id' , deleteCourse);
courseRouter.get('/searchdata3' , searchData3);
courseRouter.post('/course/upload' , uploadFile);
courseRouter.get('/totalRecords' , totalRecords);





export default courseRouter;
