// src/features/contracts/components/ContractTable.tsx
'use client';

// 関連データを含む型を定義 (Prisma の include を想定)
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // 詳細表示用
import Chip from '@mui/material/Chip'; // ステータス表示用
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { Contract, Contractor, ContractStatus, Property, Room } from '@prisma/client';
import { format } from 'date-fns';
import Link from 'next/link';

// 関連データを含んだ契約の型
type ContractWithRelations = Contract & {
  contractor: Contractor;
  room: Room & {
    property: Property;
  };
};

// ContractForm と共通化推奨
const contractStatusLabels: Record<ContractStatus, string> = {
    ACTIVE: '契約中',
    UPCOMING: '契約開始前',
    RENEWAL: '更新手続き中',
    TERMINATING: '解約手続き中',
    TERMINATED: '解約済み',
    EXPIRED: '契約期間満了',
};
const contractStatusColors: Record<ContractStatus, "success" | "info" | "warning" | "error" | "default"> = {
    ACTIVE: 'success',
    UPCOMING: 'info',
    RENEWAL: 'warning',
    TERMINATING: 'warning',
    TERMINATED: 'default',
    EXPIRED: 'error',
};

interface ContractTableProps {
    contracts: ContractWithRelations[];
    // onDelete?: (id: string) => void; // TODO
}

export default function ContractTable({ contracts }: ContractTableProps) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 900 }} aria-label="contract table">
                <TableHead>
                    <TableRow>
                        <TableCell>物件 / 部屋</TableCell>
                        <TableCell>契約者</TableCell>
                        <TableCell>契約期間</TableCell>
                        <TableCell>家賃</TableCell>
                        <TableCell>管理費</TableCell>
                        <TableCell>ステータス</TableCell>
                        <TableCell align="right">操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                     {contracts.length === 0 ? (
                        <TableRow>
                             <TableCell colSpan={7} align="center">
                                登録されている契約はありません。
                            </TableCell>
                        </TableRow>
                    ) : (
                        contracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell>
                                    {contract.room.property.name} {contract.room.roomNumber ? `/ ${contract.room.roomNumber}`: ''}
                                </TableCell>
                                <TableCell>{contract.contractor.name}</TableCell>
                                <TableCell>
                                    {format(new Date(contract.startDate), 'yyyy/MM/dd')} - {format(new Date(contract.endDate), 'yyyy/MM/dd')}
                                </TableCell>
                                <TableCell align="right">{contract.rent.toLocaleString()} 円</TableCell>
                                <TableCell align="right">{contract.managementFee.toLocaleString()} 円</TableCell>
                                <TableCell>
                                     <Chip
                                        label={contractStatusLabels[contract.status]}
                                        color={contractStatusColors[contract.status]}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                     <Tooltip title="詳細・編集">
                                         <span>
                                            <IconButton
                                                component={Link}
                                                href={`/dashboard/contracts/${contract.id}`} // TODO: 詳細・編集ページ
                                                size="small"
                                                sx={{ mr: 1 }}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                    <Tooltip title="削除">
                                        <IconButton
                                            // onClick={() => handleDelete(contract.id)} // TODO
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