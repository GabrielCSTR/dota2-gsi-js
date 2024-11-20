import express, { Express, Request, Response } from "express";

export class GSIManager {
  private app: Express;
  private port: number;
  private eventHandlers: Map<string, (data: any) => void>;

  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    this.eventHandlers = new Map();

    // Configurar middlewares
    this.app.use(express.json());
    this.app.post("/gsi", this.handleGSI.bind(this));
  }

  private handleGSI(req: Request, res: Response): void {
    const data = req.body;
    const eventType = data?.event || "default";
    const handler = this.eventHandlers.get(eventType);

    if (handler) {
      handler(data);
    }

    res.status(200).send({ status: "ok" });
  }

  public on(event: string, handler: (data: any) => void): void {
    this.eventHandlers.set(event, handler);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`GSI Manager listening on port ${this.port}`);
    });
  }
}
