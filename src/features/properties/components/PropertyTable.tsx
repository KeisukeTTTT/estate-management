'use client'; // テーブルのインタラクション（ソート、編集ボタンなど）を考慮してクライアントコンポーネント

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { Property, PropertyType } from '@prisma/client'; // Prisma の型をインポート
import { format } from 'date-fns'; // 日付フォーマット用 (npm install date-fns)
import Link from 'next/link';

// Enum の表示名マップ (PropertyForm と共通化推奨)
const propertyTypeLabels: Record<PropertyType, string> = {
    MANSION: 'マンション',
    APARTMENT: 'アパート',
    HOUSE: '戸建て',
};

interface PropertyTableProps {
    properties: Property[]; // 表示する物件データの配列
    // onDelete?: (id: string) => void; // 削除機能実装時に追加
}

export default function PropertyTable({ properties }: PropertyTableProps) {

    // 将来的に削除機能を追加する場合のハンドラ
    // const handleDelete = (id: string) => {
    //   if (onDelete && window.confirm('本当にこの物件を削除しますか？関連する部屋や契約も影響を受ける可能性があります。')) {
    //      onDelete(id);
    //   }
    // };

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>物件名</TableCell>
                        <TableCell>住所</TableCell>
                        <TableCell>種別</TableCell>
                        <TableCell>登録日</TableCell>
                        <TableCell align="right">操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {properties.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                登録されている物件はありません。
                            </TableCell>
                        </TableRow>
                    ) : (
                        properties.map((property) => (
                            <TableRow
                                key={property.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {property.name}
                                </TableCell>
                                <TableCell>{property.address}</TableCell>
                                <TableCell>{propertyTypeLabels[property.type]}</TableCell>
                                <TableCell>
                                    {format(new Date(property.createdAt), 'yyyy/MM/dd HH:mm')}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="編集">
                                        <IconButton
                                            component={Link}
                                            href={`/dashboard/properties/${property.id}/edit`} // 編集ページへのリンク (未実装)
                                            size="small"
                                            sx={{ mr: 1 }}
                                            // disabled // 編集機能実装まで無効化
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="削除">
                                        <IconButton
                                            // onClick={() => handleDelete(property.id)} // 削除機能実装時に有効化
                                            size="small"
                                            color="error"
                                            // disabled // 削除機能実装まで無効化
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