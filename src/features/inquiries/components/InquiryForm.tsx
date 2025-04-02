// src/features/inquiries/components/InquiryForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Contractor } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InquiryFormState } from '../actions';
import { inquiryFormSchema, InquiryFormValues } from '../types';
// import { useEffect } from 'react'; // redirect するので不要

interface InquiryFormProps {
    serverAction: (prevState: InquiryFormState | null, formData: FormData) => Promise<InquiryFormState>;
    contractors: Contractor[]; // 契約者リスト (紐付け用)
    initialData?: InquiryFormValues;
}

export default function InquiryForm({ serverAction, contractors, initialData }: InquiryFormProps) {
    const router = useRouter();
    // useFormState を React DOM のものとして使う
    const [formState, formAction] = useActionState(serverAction, null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting }, // useForm の isSubmitting を使う
    } = useForm<InquiryFormValues>({
        resolver: zodResolver(inquiryFormSchema),
        defaultValues: initialData || {
            contactName: '',
            contactInfo: '',
            subject: '',
            details: '',
            contractorId: '', // Select の初期値は空文字
        },
    });

    // Server Action 実行後の処理 (リダイレクトはAction側)
    // useEffect(() => {
    //     if (formState?.success) {
    //         alert(formState.message);
    //         reset();
    //         router.push('/dashboard/inquiries');
    //     }
    // }, [formState, reset, router]);

    return (
        <Box component="form" action={formAction} onSubmit={handleSubmit(() => {
             const formData = new FormData(document.getElementById('inquiry-form') as HTMLFormElement);
             formAction(formData);
        })} noValidate id="inquiry-form">
            <Stack spacing={3}>
                {formState && !formState.success && formState.message && (
                     <Alert severity="error">{formState.message}</Alert>
                )}

                <Grid container spacing={2}>
                    {/* 連絡先情報 */}
                    <Grid item xs={12} sm={6}>
                         <Controller
                            name="contactName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="お名前"
                                    required
                                    fullWidth
                                    error={!!errors.contactName || !!formState?.errors?.contactName}
                                    helperText={errors.contactName?.message || formState?.errors?.contactName?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="contactInfo"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="連絡先 (Email or Phone)"
                                    required
                                    fullWidth
                                    error={!!errors.contactInfo || !!formState?.errors?.contactInfo}
                                    helperText={errors.contactInfo?.message || formState?.errors?.contactInfo?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>

                    {/* 件名 */}
                    <Grid item xs={12}>
                         <Controller
                            name="subject"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="件名"
                                    required
                                    fullWidth
                                    error={!!errors.subject || !!formState?.errors?.subject}
                                    helperText={errors.subject?.message || formState?.errors?.subject?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>

                    {/* 内容 */}
                     <Grid item xs={12}>
                         <Controller
                            name="details"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="問い合わせ内容"
                                    required
                                    fullWidth
                                    multiline
                                    rows={4}
                                    error={!!errors.details || !!formState?.errors?.details}
                                    helperText={errors.details?.message || formState?.errors?.details?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>

                    {/* 関連する契約者 (任意) */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="contractorId"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.contractorId || !!formState?.errors?.contractorId}>
                                    <InputLabel id="contractor-select-label">関連する契約者 (任意)</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="contractor-select-label"
                                        label="関連する契約者 (任意)"
                                        disabled={isSubmitting}
                                        value={field.value ?? ''} // Ensure value is not undefined for Select
                                    >
                                        <MenuItem value=""><em>(紐付けない)</em></MenuItem>
                                        {contractors.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.contractorId?.message || formState?.errors?.contractorId?.[0]}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>
                </Grid>


                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button type="button" variant="outlined" onClick={() => router.push('/dashboard/inquiries')} disabled={isSubmitting}>
                        キャンセル
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? '送信中...' : '送信'}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}