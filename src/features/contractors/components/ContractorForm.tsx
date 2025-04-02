// src/features/contractors/components/ContractorForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form'; // useFormState を追加
import { ContractorFormState } from '../actions'; // State 型をインポート
import { contractorFormSchema, ContractorFormValues } from '../types';

interface ContractorFormProps {
    // Server Action を form の action として渡す
    serverAction: (prevState: ContractorFormState | null, formData: FormData) => Promise<ContractorFormState>;
    initialData?: ContractorFormValues;
}

export default function ContractorForm({ serverAction, initialData }: ContractorFormProps) {
    const router = useRouter();

    // useFormState で Server Action と初期状態を管理
    const [formState, formAction] = useActionState(serverAction, null);

    const {
        register, // register を使用
        handleSubmit,
        formState: { errors, isSubmitting }, // RHF の isSubmitting を使用
        reset, // フォームリセット用
    } = useForm<ContractorFormValues>({
        resolver: zodResolver(contractorFormSchema) as Resolver<ContractorFormValues>,
        defaultValues: initialData || {
            name: '',
            contact: '',
            address: '',
            isCorporation: false,
        },
    });

    // Server Action 実行後の処理
    useEffect(() => {
        if (formState?.success) {
            // 成功メッセージ表示やフォームリセット、リダイレクトなど
            alert(formState.message); // 簡単なアラート表示
            reset(); // フォームをリセット
            router.push('/dashboard/contractors'); // 一覧へリダイレクト
        }
    }, [formState, reset, router]);

    return (
        // form の action に useFormState の formAction を渡す
        // handleSubmit は不要になることが多い (FormDataで渡すため)
        // → RHFのクライアントサイドバリデーションは活かすため handleSubmit は使う
        <Box component="form" action={formAction} onSubmit={handleSubmit(() => {
            // FormData は action={formAction} が自動で処理するので、
            // handleSubmit の引数は空で良い（バリデーション実行のためだけ）
            // submit ボタンに formAction を直接渡す方法もある
            const formData = new FormData(document.getElementById('contractor-form') as HTMLFormElement);
            formAction(formData); // 直接 formAction を呼ぶ場合
        })} noValidate id="contractor-form"> {/* form に id を付与 */}
            <Stack spacing={3}>
                {/* Server Action からのエラーメッセージ表示 */}
                {formState && !formState.success && formState.message && (
                     <Alert severity="error">{formState.message}</Alert>
                )}

                <TextField
                    {...register('name')} // register を使用
                    label="契約者名"
                    required
                    fullWidth
                    error={!!errors.name || !!formState?.errors?.name}
                    helperText={errors.name?.message || formState?.errors?.name?.[0]}
                    disabled={isSubmitting}
                />
                <TextField
                    {...register('contact')}
                    label="連絡先 (電話 or Email)"
                    required
                    fullWidth
                    error={!!errors.contact || !!formState?.errors?.contact}
                    helperText={errors.contact?.message || formState?.errors?.contact?.[0]}
                    disabled={isSubmitting}
                />
                <TextField
                    {...register('address')}
                    label="住所"
                    required
                    fullWidth
                    error={!!errors.address || !!formState?.errors?.address}
                    helperText={errors.address?.message || formState?.errors?.address?.[0]}
                    disabled={isSubmitting}
                />
                <FormControlLabel
                    control={<Checkbox {...register('isCorporation')} disabled={isSubmitting} />}
                    label="法人契約"
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => router.push('/dashboard/contractors')}
                        disabled={isSubmitting}
                    >
                        キャンセル
                    </Button>
                    {/* Submit ボタン */}
                    <Button
                        type="submit" // type="submit" に変更
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