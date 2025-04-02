// src/features/inquiries/components/InquiryTable.tsx
'use client';

import * as React from 'react';
import { Inquiry, Contractor, InquiryStatus } from '@prisma/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { format } from 'date-fns';
import Chip from '@mui/material/Chip';

type InquiryWithContractor = Inquiry & {
  contractor: Contractor | null; // 契約者は紐付いていない場合もある
};

// TODO: Enum表示名と色を共通化
const inquiryStatusLabels: Record<InquiryStatus, string> = {
    RECEIVED: '受付済み',
    IN_PROGRESS: '対応中',
    RESOLVED: '解決済み',
    CLOSED: 'クローズ',
};
const inquiryStatusColors: Record<InquiryStatus, "default" | "primary" | "success" | "error"> = {
    RECEIVED: 'primary',
    IN_PROGRESS: 'primary',
    RESOLVED: 'success',
    CLOSED: 'default',
};

interface InquiryTableProps {
    inquiries: InquiryWithContractor[];
    // onDelete?: (id: string) => void; // TODO
}

export default function InquiryTable({ inquiries }: InquiryTableProps) {
    return (
         <TableContainer component={Paper}>
            <Table sx={{ minWidth: 800 }} aria-label="inquiry table">
                <TableHead>
                    <TableRow>
                        <TableCell>受付日時</TableCell>
                        <TableCell>件名</TableCell>
                        <TableCell>お名前</TableCell>
                        <TableCell>連絡先</TableCell>
                        <TableCell>関連契約者</TableCell>
                        <TableCell>ステータス</TableCell>
                        <TableCell align="right">操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {inquiries.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                問い合わせはありません。
                            </TableCell>
                        </TableRow>
                    ) : (
                        inquiries.map((inquiry) => (
                            <TableRow key={inquiry.id}>
                                <TableCell>
                                    {format(new Date(inquiry.receivedAt), 'yyyy/MM/dd HH:mm')}
                                </TableCell>
                                <TableCell>{inquiry.subject}</TableCell>
                                <TableCell>{inquiry.contactName}</TableCell>
                                <TableCell>{inquiry.contactInfo}</TableCell>
                                <TableCell>{inquiry.contractor?.name ?? 'N/A'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={inquiryStatusLabels[inquiry.status]}
                                        color={inquiryStatusColors[inquiry.status]}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="詳細・対応">
                                        <span>
                                            <IconButton
                                                component={Link}
                                                href={`/dashboard/inquiries/${inquiry.id}`} // TODO: 詳細ページ
                                                size="small"
                                                sx={{ mr: 1 }}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="削除">
                                        <IconButton
                                            // onClick={() => handleDelete(inquiry.id)} // TODO
                                            size="small"
                                            color="error"
                                            disabled // TODO
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}