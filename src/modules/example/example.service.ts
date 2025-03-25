export class ExampleService {
    getMessage(): string {
      return 'Hello from Example Module!';
    }
  
    processInput(input: string): string {
      return `You sent: ${input}`;
    }
  }