// src/features/contractors/types.ts
import { z } from 'zod';

export const contractorFormSchema = z.object({
  name: z.string().min(1, { message: '契約者名は必須です。' }),
  contact: z.string().min(1, { message: '連絡先は必須です。' }), // 簡単のため必須とする（電話 or Email想定）
  address: z.string().min(1, { message: '住所は必須です。' }),
  isCorporation: z.boolean().default(false),
});

export type ContractorFormValues = z.infer<typeof contractorFormSchema>;