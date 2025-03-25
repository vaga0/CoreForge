import { Router } from 'express';
import { MembersController } from  './members.controller';

const router = Router();
const controller = new MembersController();

router.post('/', controller.createMember.bind(controller));
router.put('/:id', controller.updateMember.bind(controller));
// router.delete('/:id', controller.deleteMember.bind(controller));
router.get('/:id', controller.getMember.bind(controller));
// router.get('/', controller.getAllMember.bind(controller));

export const membersRoutes = router;