import bodyParser from "body-parser";
import express, { Express, Request, Response, NextFunction } from "express";
import { EventEmitter } from "events";
import { Client, GSIEvents, IGamestateData } from "./interfaces";

export class GSIManager extends EventEmitter {
  private app: Express;
  private port: number;
  private token: string | undefined;
  private ip: string;
  private clients: Map<string, Client>;

  constructor(port = 3000, token?: string, ip = "0.0.0.0") {
    super();
    this.app = express();
    this.port = port;
    this.token = token;
    this.ip = ip;
    this.clients = new Map();

    // middleware
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    this.app.post(
      "/",
      this.checkAuth.bind(this),
      this.checkClient.bind(this),
      this.updateClientGameState.bind(this),
      this.processChanges("previously").bind(this),
      this.processChanges("added").bind(this),
      this.processGameData.bind(this)
    );
  }

  private checkAuth(req: Request, res: Response, next: NextFunction): void {
    const token = req.body?.auth?.token;

    if (!token) {
      res.status(401).json({ error: "No token provided." });
      return;
    }

    const isValidToken = Array.isArray(token)
      ? token.includes(this.token)
      : token === this.token;

    if (!isValidToken) {
      res.status(401).json({ error: "Invalid token." });
      return;
    }

    next();
  }

  private checkClient(req: Request, res: Response, next: NextFunction): void {
    const clientIp = req?.ip || "0.0.0.0";
    let client = this.clients.get(clientIp);

    if (!client) {
      client = {
        ip: clientIp,
        auth: req.body.auth?.token,
        gamestate: req.body,
      };
      this.clients.set(clientIp, client);
      this.emit("newClient", client);
    }

    req.body.client = client;

    next();
  }

  private updateClientGameState(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const client = req.body.client;
    client.gamestate = req.body;
    next();
  }

  private processChanges(section: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const changes = req.body[section];
      if (changes) {
        this.recursiveEmit("", changes, this);
      }

      next();
    };
  }

  private recursiveEmit(
    prefix: string,
    data: IGamestateData,
    emitter: EventEmitter
  ): void {
    Object.entries(data).forEach(([key, value]) => {
      const currentKey = prefix ? `${prefix}:${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        // Recursão para objetos aninhados
        this.recursiveEmit(currentKey, value, emitter);
      } else {
        // Emitir eventos para valores simples
        // console.log(`Emitting event: ${currentKey}`);
        emitter.emit(currentKey, {
          key: currentKey,
          value,
        });
      }
    });
  }

  private processGameData(req: Request, res: Response): void {
    const client = req.body.client;
    client.gamestate = req.body;
    this.emit("newdata", client);
    res.end();
  }

  public start(): void {
    this.app.listen(this.port, this.ip, () => {
      console.log(`GSI Manager is running on ${this.ip}:${this.port}`);
    });
  }

  public on<K extends Extract<keyof GSIEvents, string | symbol>>(
    event: K,
    listener: (data: GSIEvents[K]) => void
  ): this {
    return super.on(event, listener);
  }
}
