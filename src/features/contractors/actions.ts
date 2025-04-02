// src/features/contractors/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { contractorFormSchema } from './types';

export type ContractorFormState = {
    success: boolean;
    message: string;
    errors?: Record<keyof z.infer<typeof contractorFormSchema>, string[] | undefined> | Record<string, string[] | undefined>; // Add general error possibility
};

// 契約者作成アクション
export async function createContractor(
    // ★ useFormState を使う場合、第一引数は prevState
    prevState: ContractorFormState | null,
    formData: FormData
): Promise<ContractorFormState> {
    const validatedFields = contractorFormSchema.safeParse({
        name: formData.get('name'),
        contact: formData.get('contact'),
        address: formData.get('address'),
        // チェックボックスの値は 'on' または null になるため変換
        isCorporation: formData.get('isCorporation') === 'on',
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
        await prisma.contractor.create({
            data: validatedFields.data,
        });
    } catch (error) {
        console.error('Database Error:', error);
        return {
            success: false,
            message: 'データベースへの保存に失敗しました。',
            errors: {}, // Add empty errors object
        };
    }

    revalidatePath('/dashboard/contractors');
    // ★ useFormState を使う場合、成功時は redirect せずに state を返す方がUI制御しやすい
    // redirect('/dashboard/contractors');
    return {
        success: true,
        message: '契約者を正常に作成しました。',
        errors: {}, // Add empty errors object
    };
}

// --- TODO ---
// export async function updateContractor(...)
// export async function deleteContractor(...)
