// src/features/contracts/types.ts
import { z } from 'zod';
import { ContractStatus } from '@prisma/client';

export const contractFormSchema = z.object({
  contractorId: z.string().min(1, { message: '契約者を選択してください。'}),
  roomId: z.string().min(1, { message: '部屋を選択してください。'}),
  startDate: z.coerce.date({ // 文字列からの変換を許可
      errorMap: () => ({ message: '有効な契約開始日を入力してください。' })
  }),
  endDate: z.coerce.date({
      errorMap: () => ({ message: '有効な契約終了日を入力してください。' })
  }),
  rent: z.coerce.number().int().min(0, { message: '家賃は0以上の整数で入力してください。'}),
  managementFee: z.coerce.number().int().min(0, { message: '管理費は0以上の整数で入力してください。'}),
  deposit: z.coerce.number().int().min(0).optional(), // 任意項目
  keyMoney: z.coerce.number().int().min(0).optional(), // 任意項目
  status: z.nativeEnum(ContractStatus).optional().default(ContractStatus.ACTIVE), // デフォルト値
  // renewalDueDate など他の項目も必要に応じて追加
}).refine(data => data.endDate > data.startDate, { // 開始日と終了日の比較
    message: "契約終了日は契約開始日より後の日付にしてください。",
    path: ["endDate"], // エラーを表示するフィールド
});

export type ContractFormValues = z.infer<typeof contractFormSchema>;