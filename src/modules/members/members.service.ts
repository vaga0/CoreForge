import { Member, MemberRole} from '../../types';
import { db } from '../../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class MembersService {
  private members: Member[] = []; // 模擬儲存，實際應使用資料庫

  async create(memberData: Partial<Member>): Promise<Member> {

    // 簡單的輸入檢查（可選，根據需求決定是否在服務層驗證）
    if (!memberData.username || !memberData.email) {
      throw new Error('Username and email are required'); // 拋出錯誤
    }

    const newMember: Omit<Member, 'id'> = {
      // id: Math.random().toString(36).substring(2), // 簡單隨機 ID
      username: memberData.username || '',
      email: memberData.email || '',
      role: memberData.role || MemberRole.BASIC, // 預設一般會員
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const [result] = await db.execute<ResultSetHeader>(
        'insert into members (username, email, role, fullName, phoneNumber, birthDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newMember.username,
          newMember.email,
          newMember.role,
          newMember.fullName || null, // 未提供時存 NULL
          newMember.phoneNumber || null,
          newMember.birthDate || null,
          newMember.createdAt,
          newMember.updatedAt
        ]
      )

      if (result.affectedRows === 1) {
        // 獲取自動生成的 id
        const insertedId = result.insertId;
        return { id: insertedId, ...newMember }; // 返回完整會員物件
      }else {
        throw new Error('Failed to insert member');
      }
    }catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw new Error(`Database error: ${error.message}`);
    }

    // this.members.push(newMember);
    // return newMember;
  }

  async update(id: number, updateData:Partial<Member>): Promise<Member> {
    try {
      // 動態構建 SET 子句，只更新提供的欄位
      const fields: string[] = [];
      const values: any[] = [];

      if (updateData.username) {
        fields.push('username = ?');
        values.push(updateData.username);
      }
      if (updateData.email) {
        fields.push('email = ?');
        values.push(updateData.email);
      }
      if (updateData.role) {
        fields.push('role = ?');
        values.push(updateData.role);
      }
      if (updateData.fullName !== undefined) {
        fields.push('fullName = ?');
        values.push(updateData.fullName);
      }
      if (updateData.phoneNumber !== undefined) {
        fields.push('phoneNumber = ?');
        values.push(updateData.phoneNumber);
      }
      if (updateData.birthDate !== undefined) {
        fields.push('birthDate = ?');
        values.push(updateData.birthDate);
      }

      fields.push('updatedAt = ?'); // 每次更新時刷新 updatedAt
      values.push(new Date());

      if (fields.length === 1) { // 只有 updatedAt，無其他更新
        throw new Error('No fields to update');
      }

      const [result] = await db.execute<ResultSetHeader>(
        `UPDATE members SET ${fields.join(', ')} WHERE id = ?`,
        [...values, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Member not found');
      }

      // 查詢更新後的資料
      const [rows] = await db.execute<any[]>(
        'SELECT * FROM members WHERE id = ?',
        [id]
      );
      const updatedMember = rows[0];
      if (!updatedMember) {
        throw new Error('Failed to retrieve updated member');
      }

      return {
        id: updatedMember.id,
        username: updatedMember.username,
        email: updatedMember.email,
        role: updatedMember.role,
        fullName: updatedMember.fullName,
        phoneNumber: updatedMember.phoneNumber,
        birthDate: updatedMember.birthDate ? new Date(updatedMember.birthDate) : undefined,
        createdAt: new Date(updatedMember.createdAt),
        updatedAt: new Date(updatedMember.updatedAt),
      };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error; // 其他錯誤直接拋出
    }
  }

  async findById(id: number): Promise<Member> {
    try {
      const [rows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM members WHERE id = ?',
        [id]
      );

      if (rows.length === 0) {
        throw new Error('Member not found');
      }

      const member = rows[0];
      return {
        id: member.id,
        username: member.username,
        email: member.email,
        role: member.role,
        fullName: member.fullName,
        phoneNumber: member.phoneNumber,
        birthDate: member.birthDate ? new Date(member.birthDate) : undefined,
        createdAt: new Date(member.createdAt),
        updatedAt: new Date(member.updatedAt),
      };
    } catch (error) {
      throw error; // 將錯誤拋給控制器處理
    }
  }
}