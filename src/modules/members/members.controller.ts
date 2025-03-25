import { Request, Response} from 'express';
import { MembersService } from './members.service';
import { validateCreateMember, validateUpdateMember } from './memberValidate';

export class MembersController {
  private membersService: MembersService;

  constructor() {
    this.membersService = new MembersService();
  }

  async createMember(req: Request, res: Response) {
    const memberData = req.body;

    // 執行驗證
    const errors = validateCreateMember(memberData);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    // 主要處理
    try {
      const newMember = await this.membersService.create(memberData);
      res.status(201).json(newMember);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to create member: ' + error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  async updateMember(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid member ID' });
      return;
    }

    const updateData = req.body;
    const errors = validateUpdateMember(updateData);
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }

    try {
      const updatedMember = await this.membersService.update(id, updateData);
      res.status(200).json(updatedMember);
    } catch (error: any) {
      if (error.message === 'Member not found') {
        res.status(404).json({ error: error.message });
      } else if (error.message === 'Email already exists') {
        res.status(409).json({ error: error.message });
      } else if (error.message === 'No fields to update') {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update member' });
      }
    }
  }

  async getMember(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid member ID' });
      return;
    }

    try {
      const member = await this.membersService.findById(id);
      res.status(200).json(member);
    } catch (error: any) {
      if (error.message === 'Member not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to retrieve member' });
      }
    }
  }
}