// src/features/inquiries/types.ts
import { z } from 'zod';
import { InquiryStatus } from '@prisma/client';

export const inquiryFormSchema = z.object({
  contactName: z.string().min(1, { message: 'お名前は必須です。' }),
  contactInfo: z.string().min(1, { message: '連絡先は必須です。' }), // Email or Phone
  subject: z.string().min(1, { message: '件名は必須です。' }),
  details: z.string().min(1, { message: '内容は必須です。' }),
  contractorId: z.string().optional(), // 任意: 既存の契約者と紐付ける場合
  // status: 受付時は RECEIVED で固定するため、フォームには含めないことが多い
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;