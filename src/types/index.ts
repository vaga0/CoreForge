export enum MemberRole {
  ADMIN = 'admin',        // 管理者
  PREMIUM = 'premium',    // 進階會員
  BASIC = 'basic'         // 一般會員
}

export interface Member {
  id: number;
  username: string;
  email: string;
  role: MemberRole;
  fullName?: string;
  phoneNumber?: string;
  birthDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 定義一個型別映射，提取 Member 每個欄位的型別
export type MemberFieldType<K extends keyof Member> = Member[K];
