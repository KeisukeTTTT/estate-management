// src/features/contractors/components/ContractorTable.tsx
'use client';

import * as React from 'react';
import { Contractor } from '@prisma/client';
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
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface ContractorTableProps {
    contractors: Contractor[];
    // onDelete?: (id: string) => void; // TODO
}

export default function ContractorTable({ contractors }: ContractorTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="contractor table">
                <TableHead>
                    <TableRow>
                        <TableCell>契約者名</TableCell>
                        <TableCell>連絡先</TableCell>
                        <TableCell>住所</TableCell>
                        <TableCell>法人</TableCell>
                        <TableCell>登録日</TableCell>
                        <TableCell align="right">操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contractors.length === 0 ? (
                        <TableRow>
                             <TableCell colSpan={6} align="center">
                                登録されている契約者はいません。
                            </TableCell>
                        </TableRow>
                    ) : (
                        contractors.map((contractor) => (
                            <TableRow key={contractor.id}>
                                <TableCell>{contractor.name}</TableCell>
                                <TableCell>{contractor.contact}</TableCell>
                                <TableCell>{contractor.address}</TableCell>
                                <TableCell>
                                    {contractor.isCorporation ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(contractor.createdAt), 'yyyy/MM/dd HH:mm')}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="編集">
                                        <span> {/* IconButton を Link でラップする場合 span で囲むと良い */}
                                            <IconButton
                                                component={Link}
                                                href={`/dashboard/contractors/${contractor.id}/edit`} // TODO: 編集ページ
                                                size="small"
                                                sx={{ mr: 1 }}
                                                disabled // TODO: 編集機能実装まで無効化
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="削除">
                                        <IconButton
                                            // onClick={() => handleDelete(contractor.id)} // TODO
                                            size="small"
                                            color="error"
                                            disabled // TODO: 削除機能実装まで無効化
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