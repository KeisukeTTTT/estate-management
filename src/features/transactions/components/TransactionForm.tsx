// src/features/transactions/components/TransactionForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Contract, TransactionType } from '@prisma/client'; // Contract は関連付け用
import { Controller, useForm } from 'react-hook-form';
import { TransactionFormState } from '../actions';
import { transactionFormSchema, TransactionFormValues } from '../types';
// 契約の関連データを取得する型 (必要に応じて調整)
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
import { Contractor, Property, Room } from '@prisma/client';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';

// 契約選択肢の型
type ContractOption = Contract & {
    contractor: Contractor;
    room: Room & { property: Property };
};

// TODO: Enum表示名を共通化
const transactionTypeLabels: Record<TransactionType, string> = {
    RENT_INCOME: '家賃収入',
    MANAGEMENT_FEE_INCOME: '管理費収入',
    DEPOSIT_RECEIVED: '敷金預かり',
    KEY_MONEY_INCOME: '礼金収入',
    RENEWAL_FEE_INCOME: '更新料収入',
    REPAIR_EXPENSE: '修繕費支出',
    RESTORATION_EXPENSE: '原状回復費支出',
    DEPOSIT_RETURNED: '敷金返還',
    OTHER_INCOME: 'その他収入',
    OTHER_EXPENSE: 'その他支出',
};

interface TransactionFormProps {
    serverAction: (prevState: TransactionFormState | null, formData: FormData) => Promise<TransactionFormState>;
    contracts: ContractOption[]; // 契約リスト (紐付け用)
    initialData?: Partial<TransactionFormValues>;
}

export default function TransactionForm({ serverAction, contracts, initialData }: TransactionFormProps) {
    const router = useRouter();
    const [formState, formAction] = useActionState(serverAction, null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            transactionDate: initialData?.transactionDate ? format(new Date(initialData.transactionDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'), // デフォルトは今日
            type: initialData?.type ?? undefined, // Select初期値
            amount: initialData?.amount ?? 0,
            description: initialData?.description ?? '',
            contractId: initialData?.contractId ?? '', // Select初期値
        },
    });

    return (
         <Box component="form" action={formAction} onSubmit={handleSubmit(() => {
             const formData = new FormData(document.getElementById('transaction-form') as HTMLFormElement);
             formAction(formData);
        })} noValidate id="transaction-form">
            <Stack spacing={3}>
                 {formState && !formState.success && formState.message && (
                     <Alert severity="error">{formState.message}</Alert>
                 )}

                 <Grid container spacing={2}>
                     {/* 取引日 */}
                     <Grid item xs={12} sm={6}>
                         <Controller
                            name="transactionDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="取引日"
                                    type="date"
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.transactionDate || !!formState?.errors?.transactionDate}
                                    helperText={errors.transactionDate?.message || formState?.errors?.transactionDate?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>
                    {/* 種別 */}
                     <Grid item xs={12} sm={6}>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth required error={!!errors.type || !!formState?.errors?.type}>
                                    <InputLabel id="transaction-type-label">種別</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="transaction-type-label"
                                        label="種別"
                                        disabled={isSubmitting}
                                        value={field.value ?? ''} // Ensure value is not undefined
                                    >
                                        {(Object.keys(TransactionType) as Array<keyof typeof TransactionType>).map((key) => (
                                            <MenuItem key={key} value={TransactionType[key]}>
                                                {transactionTypeLabels[TransactionType[key]]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                     <FormHelperText>{errors.type?.message || formState?.errors?.type?.[0]}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>
                    {/* 金額 */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="amount"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="金額 (収入: +, 支出: -)"
                                    type="number"
                                    required
                                    fullWidth
                                    InputProps={{ endAdornment: '円' }}
                                    error={!!errors.amount || !!formState?.errors?.amount}
                                    helperText={errors.amount?.message || formState?.errors?.amount?.[0] || '収入は正、支出は負の整数で入力'}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>
                    {/* 関連する契約 (任意) */}
                     <Grid item xs={12} sm={6}>
                        <Controller
                            name="contractId"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.contractId || !!formState?.errors?.contractId}>
                                    <InputLabel id="contract-select-label">関連契約 (任意)</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="contract-select-label"
                                        label="関連契約 (任意)"
                                        disabled={isSubmitting}
                                        value={field.value ?? ''} // Ensure value is not undefined
                                    >
                                        <MenuItem value=""><em>(紐付けない)</em></MenuItem>
                                        {/* 契約情報を分かりやすく表示 */}
                                        {contracts.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>
                                                {c.contractor.name} / {c.room.property.name} {c.room.roomNumber ? `/ ${c.room.roomNumber}`: ''} ({format(new Date(c.startDate), 'yyyy/MM')})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.contractId?.message || formState?.errors?.contractId?.[0]}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>
                     {/* 内容・摘要 */}
                     <Grid item xs={12}>
                         <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="内容・摘要"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    error={!!errors.description || !!formState?.errors?.description}
                                    helperText={errors.description?.message || formState?.errors?.description?.[0]}
                                    disabled={isSubmitting}
                                    value={field.value ?? ''} // Ensure value is not undefined
                                />
                            )}
                        />
                    </Grid>
                 </Grid>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button type="button" variant="outlined" onClick={() => router.push('/dashboard/transactions')} disabled={isSubmitting}>
                        キャンセル
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? '保存中...' : '保存'}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}