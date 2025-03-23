import { Router } from 'express';
import { ExampleController } from './example.controller';

const router = Router();
const controller = new ExampleController();

router.get('/', controller.getExample.bind(controller));
router.post('/', controller.postExample.bind(controller));

export const exampleRoutes = router;