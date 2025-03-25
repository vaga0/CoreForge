import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { config } from './config/server.config';
import { registerRoutes } from './modules'; // 動態註冊模組路由

const app: Application = express();

// 中間件
app.use(express.json());

// 動態載入所有模組的路由
registerRoutes(app);

// 錯誤處理中間件(While JSON format error)
app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format：' + err.message });
  }
  next(err);
});

// HTTP 伺服器
const httpServer = http.createServer(app);

// HTTPS 憑證（開發時可先用自簽憑證，正式環境需正式憑證）
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, '../certs/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/cert.pem')),
};
const httpsServer = https.createServer(httpsOptions, app);

// 啟動伺服器
httpServer.listen(config.httpPort, () => {
  console.log(`HTTP Server running on port ${config.httpPort}`);
});

httpsServer.listen(config.httpsPort, () => {
  console.log(`HTTPS Server running on port ${config.httpsPort}`);
});