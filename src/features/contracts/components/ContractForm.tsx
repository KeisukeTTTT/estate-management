// src/features/contracts/components/ContractForm.tsx
'use client';

import * as React from 'react';
import { useFormState, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contractFormSchema, ContractFormValues } from '../types';
import { ContractFormState } from '../actions';
import { Contractor, Room, Property, ContractStatus } from '@prisma/client'; // 必要な型をインポート
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid'; // レイアウト用
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { format } from 'date-fns';

// 部屋選択肢の型 (Property情報も含む)
type RoomOption = Room & { property: Property };

interface ContractFormProps {
    serverAction: (prevState: ContractFormState | null, formData: FormData) => Promise<ContractFormState>;
    contractors: Contractor[]; // 契約者リスト
    rooms: RoomOption[]; // 部屋リスト (物件情報付き)
    initialData?: Partial<ContractFormValues>; // Partial を使うと日付の型が問題になることがあるので注意
}

const contractStatusLabels: Record<ContractStatus, string> = {
    ACTIVE: '契約中',
    UPCOMING: '契約開始前',
    RENEWAL: '更新手続き中',
    TERMINATING: '解約手続き中',
    TERMINATED: '解約済み',
    EXPIRED: '契約期間満了',
};


export default function ContractForm({ serverAction, contractors, rooms, initialData }: ContractFormProps) {
    const router = useRouter();
    const [formState, formAction] = useFormState(serverAction, null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch // 特定のフィールドの値を監視
    } = useForm<ContractFormValues>({
        resolver: zodResolver(contractFormSchema),
        defaultValues: { // Date 型は YYYY-MM-DD 形式の文字列で初期化
            contractorId: initialData?.contractorId ?? '',
            roomId: initialData?.roomId ?? '',
            startDate: initialData?.startDate ? format(new Date(initialData.startDate), 'yyyy-MM-dd') : '',
            endDate: initialData?.endDate ? format(new Date(initialData.endDate), 'yyyy-MM-dd') : '',
            rent: initialData?.rent ?? 0,
            managementFee: initialData?.managementFee ?? 0,
            deposit: initialData?.deposit ?? undefined,
            keyMoney: initialData?.keyMoney ?? undefined,
            status: initialData?.status ?? ContractStatus.ACTIVE,
        },
    });

    // 部屋が選択されたら、家賃と管理費を自動入力する (任意)
    const selectedRoomId = watch('roomId');
    useEffect(() => {
        if (selectedRoomId) {
            const selectedRoom = rooms.find(r => r.id === selectedRoomId);
            if (selectedRoom) {
                reset(prev => ({
                    ...prev,
                    rent: selectedRoom.rent ?? prev.rent ?? 0,
                    managementFee: selectedRoom.managementFee ?? prev.managementFee ?? 0,
                }));
            }
        }
    }, [selectedRoomId, rooms, reset]);


    // Server Action 実行後の処理 (リダイレクトはAction側で行う)
    // useEffect(() => {
    //     if (formState?.success) {
    //         alert(formState.message);
    //         router.push('/dashboard/contracts');
    //     }
    // }, [formState, router]);

    return (
        <Box component="form" action={formAction} onSubmit={handleSubmit(() => {
             const formData = new FormData(document.getElementById('contract-form') as HTMLFormElement);
             formAction(formData);
        })} noValidate id="contract-form">
            <Stack spacing={3}>
                {formState && !formState.success && formState.message && (
                     <Alert severity="error">{formState.message}</Alert>
                )}

                <Grid container spacing={2}>
                    {/* 契約者選択 */}
                    <Grid item xs={12} sm={6}>
                         <Controller
                            name="contractorId"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth required error={!!errors.contractorId || !!formState?.errors?.contractorId}>
                                    <InputLabel id="contractor-select-label">契約者</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="contractor-select-label"
                                        label="契約者"
                                        disabled={isSubmitting}
                                    >
                                        <MenuItem value=""><em>選択してください</em></MenuItem>
                                        {contractors.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.contractorId?.message || formState?.errors?.contractorId?.[0]}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>
                     {/* 部屋選択 */}
                     <Grid item xs={12} sm={6}>
                        <Controller
                            name="roomId"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth required error={!!errors.roomId || !!formState?.errors?.roomId}>
                                    <InputLabel id="room-select-label">物件 / 部屋</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="room-select-label"
                                        label="物件 / 部屋"
                                        disabled={isSubmitting}
                                    >
                                         <MenuItem value=""><em>選択してください</em></MenuItem>
                                        {/* 物件ごとにグループ化して表示 (任意) */}
                                        {rooms.map((r) => (
                                            <MenuItem key={r.id} value={r.id}>
                                                {r.property.name} {r.roomNumber ? `/ ${r.roomNumber}` : ''}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                     <FormHelperText>{errors.roomId?.message || formState?.errors?.roomId?.[0]}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>

                    {/* 契約期間 */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="契約開始日"
                                    type="date"
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.startDate || !!formState?.errors?.startDate}
                                    helperText={errors.startDate?.message || formState?.errors?.startDate?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>
                     <Grid item xs={12} sm={6}>
                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="契約終了日"
                                    type="date"
                                    required
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.endDate || !!formState?.errors?.endDate}
                                    helperText={errors.endDate?.message || formState?.errors?.endDate?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>

                     {/* 金額関連 */}
                     <Grid item xs={12} sm={6} md={3}>
                         <Controller
                            name="rent"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="家賃 (月額)"
                                    type="number"
                                    required
                                    fullWidth
                                    InputProps={{ endAdornment: '円' }}
                                    error={!!errors.rent || !!formState?.errors?.rent}
                                    helperText={errors.rent?.message || formState?.errors?.rent?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>
                     <Grid item xs={12} sm={6} md={3}>
                         <Controller
                            name="managementFee"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="管理費 (月額)"
                                    type="number"
                                    required
                                    fullWidth
                                    InputProps={{ endAdornment: '円' }}
                                     error={!!errors.managementFee || !!formState?.errors?.managementFee}
                                    helperText={errors.managementFee?.message || formState?.errors?.managementFee?.[0]}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                         <Controller
                            name="deposit"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="敷金"
                                    type="number"
                                    fullWidth
                                    InputProps={{ endAdornment: '円' }}
                                    error={!!errors.deposit || !!formState?.errors?.deposit}
                                    helperText={errors.deposit?.message || formState?.errors?.deposit?.[0]}
                                    disabled={isSubmitting}
                                    value={field.value ?? ''} // undefined の場合に空文字に
                                />
                            )}
                        />
                    </Grid>
                     <Grid item xs={12} sm={6} md={3}>
                         <Controller
                            name="keyMoney"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="礼金"
                                    type="number"
                                    fullWidth
                                    InputProps={{ endAdornment: '円' }}
                                    error={!!errors.keyMoney || !!formState?.errors?.keyMoney}
                                    helperText={errors.keyMoney?.message || formState?.errors?.keyMoney?.[0]}
                                    disabled={isSubmitting}
                                    value={field.value ?? ''} // undefined の場合に空文字に
                                />
                            )}
                        />
                    </Grid>
                     {/* ステータス (任意) */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.status || !!formState?.errors?.status}>
                                    <InputLabel id="contract-status-label">契約ステータス</InputLabel>
                                    <Select
                                        {...field}
                                        labelId="contract-status-label"
                                        label="契約ステータス"
                                        disabled={isSubmitting}
                                    >
                                        {(Object.keys(ContractStatus) as Array<keyof typeof ContractStatus>).map((key) => (
                                            <MenuItem key={key} value={ContractStatus[key]}>
                                                {contractStatusLabels[ContractStatus[key]]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                     <FormHelperText>{errors.status?.message || formState?.errors?.status?.[0]}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>
                </Grid>


                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button type="button" variant="outlined" onClick={() => router.push('/dashboard/contracts')} disabled={isSubmitting}>
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