import { z } from 'zod';
import { PropertyType } from '@prisma/client'; // Prisma で定義した Enum をインポート

// 物件作成・編集フォーム用の Zod スキーマ
export const propertyFormSchema = z.object({
  name: z.string().min(1, { message: '物件名は必須です。' }),
  address: z.string().min(1, { message: '住所は必須です。' }),
  // Enum の値のみを許可
  type: z.nativeEnum(PropertyType, {
    errorMap: () => ({ message: '物件種別を選択してください。' })
  }),
  // 必要に応じて他のフィールドも追加 (例: 築年数、構造など)
});

// Zod スキーマから TypeScript の型を生成
export type PropertyFormValues = z.infer<typeof propertyFormSchema>;