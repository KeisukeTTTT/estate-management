'use client'; // フォーム操作のためクライアントコンポーネント

import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { PropertyType } from '@prisma/client'; // Enum をインポート
import { useRouter } from 'next/navigation'; // キャンセルボタン用
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { propertyFormSchema, PropertyFormValues } from '../types';

// Enum の表示名マップ (必要に応じて lib/constants.ts などに移動)
const propertyTypeLabels: Record<PropertyType, string> = {
    MANSION: 'マンション',
    APARTMENT: 'アパート',
    HOUSE: '戸建て',
};

interface PropertyFormProps {
    onSubmit: (data: FormData) => Promise<any>; // Server Action を受け取る
    initialData?: PropertyFormValues; // 編集時に初期値を渡す (今回は新規作成のみ)
    isSubmitting?: boolean; // 送信中の状態 (useFormState を使う場合に便利)
}

export default function PropertyForm({ onSubmit, initialData }: PropertyFormProps) {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }, // isSubmitting は RHF が管理
    } = useForm<PropertyFormValues>({
        resolver: zodResolver(propertyFormSchema),
        defaultValues: initialData || { // 初期値設定
            name: '',
            address: '',
            type: undefined, // Select の初期値は undefined が扱いやすい場合がある
        },
    });

    // useForm の handleSubmit は Zod でバリデーション済みのデータを渡すが、
    // Server Action は FormData を期待するので、ラッパー関数を用意
    const handleFormSubmit: SubmitHandler<PropertyFormValues> = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('address', data.address);
        formData.append('type', data.type);
        // 他のフィールドも同様に追加
        onSubmit(formData); // Server Action を呼び出す
    };


    return (
        // RHF の handleSubmit を form の onSubmit に渡す
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Stack spacing={3}>
                {/* 物件名 */}
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="物件名"
                            required
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* 住所 */}
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="住所"
                            required
                            fullWidth
                            error={!!errors.address}
                            helperText={errors.address?.message}
                            disabled={isSubmitting}
                        />
                    )}
                />

                {/* 物件種別 */}
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth required error={!!errors.type} disabled={isSubmitting}>
                            <InputLabel id="property-type-label">物件種別</InputLabel>
                            <Select
                                {...field}
                                labelId="property-type-label"
                                label="物件種別"
                                value={field.value ?? ''} // undefined の場合は空文字に
                            >
                                {/* Prisma Enum のキーをループして MenuItem を生成 */}
                                {(Object.keys(PropertyType) as Array<keyof typeof PropertyType>).map((key) => (
                                    <MenuItem key={key} value={PropertyType[key]}>
                                        {propertyTypeLabels[PropertyType[key]]}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{errors.type?.message}</FormHelperText>
                        </FormControl>
                    )}
                />

                {/* 送信・キャンセルボタン */}
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => router.push('/dashboard/properties')} // 一覧ページに戻る
                        disabled={isSubmitting}
                    >
                        キャンセル
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '保存中...' : '保存'}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}