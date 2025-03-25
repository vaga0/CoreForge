import { Request, Response } from 'express';
import { ExampleService } from './example.service';

const exampleService = new ExampleService();

export class ExampleController {
  async getExample(req: Request, res: Response) {
    const result = exampleService.getMessage();
    res.json({ message: result });
  }

  async postExample(req: Request, res: Response) {
    const { input } = req.body;
    const result = exampleService.processInput(input);
    res.json({ message: result });
  }
}