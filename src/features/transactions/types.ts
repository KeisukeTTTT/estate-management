// src/features/transactions/types.ts
import { z } from 'zod';
import { TransactionType } from '@prisma/client';

export const transactionFormSchema = z.object({
  transactionDate: z.coerce.date({
    errorMap: () => ({ message: '有効な取引日を入力してください。' })
  }),
  type: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: '種別を選択してください。' })
  }),
  amount: z.coerce.number({ invalid_type_error: '有効な金額を入力してください。' })
           .int({ message: '金額は整数で入力してください。'})
           .refine(val => val !== 0, { message: '金額は0以外にしてください。'}), // 0円は除外
  description: z.string().optional(),
  contractId: z.string().optional(), // 任意: 契約と紐付ける場合
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;