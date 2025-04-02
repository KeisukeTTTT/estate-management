// src/features/transactions/components/TransactionTable.tsx
'use client';

import * as React from 'react';
import { Transaction, TransactionType, Contract, Contractor, Room, Property } from '@prisma/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { format } from 'date-fns';
import Box from '@mui/material/Box';

// 関連データを含む型
type TransactionWithContract = Transaction & {
  contract: (Contract & {
    contractor: Contractor;
    room: Room & { property: Property };
  }) | null;
};

// TODO: Enum表示名を共通化
const transactionTypeLabels: Record<TransactionType, string> = { /* ... (フォームと同じものを定義) ... */ };

interface TransactionTableProps {
    transactions: TransactionWithContract[];
    // onDelete?: (id: string) => void; // TODO
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 800 }} aria-label="transaction table">
                <TableHead>
                    <TableRow>
                        <TableCell>取引日</TableCell>
                        <TableCell>種別</TableCell>
                        <TableCell>内容・摘要</TableCell>
                        <TableCell>関連契約</TableCell>
                        <TableCell align="right">金額 (円)</TableCell>
                        <TableCell align="right">操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                     {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                入出金記録はありません。
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>
                                    {format(new Date(tx.transactionDate), 'yyyy/MM/dd')}
                                </TableCell>
                                <TableCell>{transactionTypeLabels[tx.type]}</TableCell>
                                <TableCell>{tx.description ?? ''}</TableCell>
                                <TableCell>
                                    {tx.contract ?
                                        `${tx.contract.contractor.name} / ${tx.contract.room.property.name} ${tx.contract.room.roomNumber ?? ''}`
                                        : 'N/A'
                                    }
                                </TableCell>
                                <TableCell align="right">
                                    <Box component="span" sx={{ color: tx.amount >= 0 ? 'text.primary' : 'error.main' }}>
                                        {tx.amount.toLocaleString()}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="編集">
                                        <span>
                                            <IconButton
                                                component={Link}
                                                href={`/dashboard/transactions/${tx.id}/edit`} // TODO: 編集ページ
                                                size="small"
                                                sx={{ mr: 1 }}
                                                disabled // TODO
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="削除">
                                        <IconButton
                                            // onClick={() => handleDelete(tx.id)} // TODO
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

// transactionTypeLabels の定義を忘れずに追加してください
// const transactionTypeLabels: Record<TransactionType, string> = { ... };