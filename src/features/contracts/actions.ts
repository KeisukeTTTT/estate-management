// src/features/contracts/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { ContractStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; // 今回は redirect させる
import { z } from 'zod';
import { contractFormSchema } from './types';

export type ContractFormState = {
    success: boolean;
    message: string;
    errors?: Record<keyof z.infer<typeof contractFormSchema>, string[] | undefined> | Record<string, string[] | undefined>;
};

// 契約作成アクション
export async function createContract(prevState: ContractFormState | null, formData: FormData): Promise<ContractFormState> {
    const validatedFields = contractFormSchema.safeParse({
        contractorId: formData.get('contractorId'),
        roomId: formData.get('roomId'),
        startDate: formData.get('startDate'), // coerce.date が Date オブジェクトに変換試行
        endDate: formData.get('endDate'),
        rent: formData.get('rent'), // coerce.number が数値に変換試行
        managementFee: formData.get('managementFee'),
        deposit: formData.get('deposit') || undefined, // 空文字は undefined に
        keyMoney: formData.get('keyMoney') || undefined,
        status: formData.get('status') || ContractStatus.ACTIVE,
    });

    if (!validatedFields.success) {
        console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: '入力内容にエラーがあります。',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // TODO: 選択された部屋が既に有効な契約期間と重複していないかチェックするロジックを追加

    try {
        await prisma.contract.create({
            data: {
                ...validatedFields.data,
                // オプショナルな数値フィールドが undefined の場合、DBには保存しない (デフォルトの null になる)
                // Prisma が型に合わせてくれるが、明示的に undefined を null に変換しても良い
                deposit: validatedFields.data.deposit,
                keyMoney: validatedFields.data.keyMoney,
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

    revalidatePath('/dashboard/contracts');
    redirect('/dashboard/contracts'); // 成功したら一覧へリダイレクト
    // return { success: true, message: '契約を正常に作成しました。', errors: {} };
}

// --- TODO ---
// fetchContractors, fetchPropertiesWithRooms (for form selectors)
// updateContract, deleteContract
