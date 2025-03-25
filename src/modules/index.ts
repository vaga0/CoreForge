import { Application } from 'express';
import { exampleRoutes } from './example/example.routes'; // 範例模組路由
import { membersRoutes } from './members/members.routes'; // 範例模組路由

export function registerRoutes(app: Application) {
  // 註冊範例模組路由
  app.use('/api/example', exampleRoutes);
  app.use('/api/member', membersRoutes);

  // 未來其他模組路由在此添加
  // app.use('/api/other', otherRoutes);
}