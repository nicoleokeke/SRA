import express from 'express';
import * as controllers from './controllers';

const router = express.Router();

router.get('/students', controllers.getStudents);
router.get('/courses', controllers.getCourses);
router.get('/results', controllers.getResults);

router.post('/students', controllers.postStudent);
router.post('/courses', controllers.postCourse);
router.post('/results', controllers.postResult);

export default router;
