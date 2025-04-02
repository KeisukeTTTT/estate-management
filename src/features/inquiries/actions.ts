// src/features/inquiries/actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { inquiryFormSchema } from './types';
import { InquiryStatus } from '@prisma/client'; // デフォルトステータス用
import { redirect } from 'next/navigation';

export type InquiryFormState = {
    success: boolean;
    message: string;
    errors?: Record<keyof z.infer<typeof inquiryFormSchema>, string[] | undefined>
           | Record<string, string[] | undefined>;
};

// 問い合わせ作成アクション
export async function createInquiry(
    prevState: InquiryFormState | null,
    formData: FormData
): Promise<InquiryFormState> {
    const validatedFields = inquiryFormSchema.safeParse({
        contactName: formData.get('contactName'),
        contactInfo: formData.get('contactInfo'),
        subject: formData.get('subject'),
        details: formData.get('details'),
        contractorId: formData.get('contractorId') || undefined, // 空文字は undefined に
    });

    if (!validatedFields.success) {
         console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: '入力内容にエラーがあります。',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.inquiry.create({
            data: {
                ...validatedFields.data,
                status: InquiryStatus.RECEIVED, // 受付時のステータス
                contractorId: validatedFields.data.contractorId || null, // undefined を null に
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        return {
            success: false,
            message: 'データベースへの保存に失敗しました。',
            errors: {},
        };
    }

    revalidatePath('/dashboard/inquiries');
    redirect('/dashboard/inquiries'); // 成功したら一覧へリダイレクト
    // return { success: true, message: '問い合わせを受け付けました。', errors: {} };
}

// --- TODO ---
// updateInquiryStatus, assignInquiry, resolveInquiry, deleteInquiry