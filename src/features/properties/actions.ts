'use server'; // Server Action であることを示す

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { propertyFormSchema } from './types'; // 先ほど定義した Zod スキーマ

// Server Action の戻り値の型 (成功/失敗、メッセージなどを含む)
type FormState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[] | undefined>; // Zod のエラー詳細
};

// 物件作成アクション
export async function createProperty(
    // prevState: FormState | null, // useFormState を使う場合は必要
    formData: FormData
): Promise<FormState> {
    // FormData を Zod スキーマでバリデーション
    const validatedFields = propertyFormSchema.safeParse({
        name: formData.get('name'),
        address: formData.get('address'),
        type: formData.get('type'),
    });

    // バリデーション失敗
    if (!validatedFields.success) {
        console.error('Validation Error:', validatedFields.error.flatten().fieldErrors);
        return {
            success: false,
            message: '入力内容にエラーがあります。',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    // データベースへの保存処理
    try {
        await prisma.property.create({
            data: {
                name: validatedFields.data.name,
                address: validatedFields.data.address,
                type: validatedFields.data.type,
            },
        });
    } catch (error) {
        console.error('Database Error:', error);
        return {
            success: false,
            message: 'データベースへの保存に失敗しました。',
        };
    }

    // キャッシュの更新 (物件一覧ページ)
    revalidatePath('/dashboard/properties');

    // 物件一覧ページへリダイレクト
    redirect('/dashboard/properties');

    // リダイレクトするため、実際にはここは実行されないが型定義上必要
    // return {
    //     success: true,
    //     message: '物件を正常に作成しました。',
    // };
}

// --- 将来的に追加 ---
// export async function updateProperty(id: string, formData: FormData): Promise<FormState> { ... }
// export async function deleteProperty(id: string): Promise<{ success: boolean; message: string }> { ... }