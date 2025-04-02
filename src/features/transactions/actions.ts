// src/features/transactions/actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { transactionFormSchema } from './types';
import { redirect } from 'next/navigation';

export type TransactionFormState = {
    success: boolean;
    message: string;
    errors?: Record<keyof z.infer<typeof transactionFormSchema>, string[] | undefined>
           | Record<string, string[] | undefined>;
};

// 入出金作成アクション
export async function createTransaction(
    prevState: TransactionFormState | null,
    formData: FormData
): Promise<TransactionFormState> {
    const validatedFields = transactionFormSchema.safeParse({
        transactionDate: formData.get('transactionDate'),
        type: formData.get('type'),
        amount: formData.get('amount'),
        description: formData.get('description') || undefined,
        contractId: formData.get('contractId') || undefined,
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
        await prisma.transaction.create({
            data: {
                ...validatedFields.data,
                contractId: validatedFields.data.contractId || null,
                description: validatedFields.data.description || null,
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

    revalidatePath('/dashboard/transactions');
    redirect('/dashboard/transactions');
    // return { success: true, message: '入出金を記録しました。', errors: {} };
}

// --- TODO ---
// updateTransaction, deleteTransaction