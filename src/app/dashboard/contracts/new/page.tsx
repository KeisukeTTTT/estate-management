// src/app/(dashboard)/contracts/new/page.tsx
import { createContract } from '@/features/contracts/actions';
import ContractForm from '@/features/contracts/components/ContractForm';
import prisma from '@/lib/prisma'; // Prisma をインポート
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

// フォームで使う契約者リストを取得
async function getContractors() {
    return prisma.contractor.findMany({ orderBy: { name: 'asc' } });
}

// フォームで使う部屋リスト（物件情報付き）を取得
async function getRoomsWithOptions() {
    return prisma.room.findMany({
        include: {
            property: true, // 物件情報を含める
        },
        orderBy: [ // 物件名 -> 部屋番号 でソート
            { property: { name: 'asc' } },
            { roomNumber: 'asc' },
        ]
    });
}

export default async function NewContractPage() {
    // ページレンダリング時にデータを取得
    const contractors = await getContractors();
    const rooms = await getRoomsWithOptions();

    // データがない場合の考慮 (任意)
    if (!contractors.length || !rooms.length) {
        return (
             <Box>
                <Typography variant="h4" gutterBottom>新規契約登録</Typography>
                <Alert severity="warning">
                    契約を作成するには、先に契約者と物件（部屋）を登録する必要があります。
                     {!contractors.length && <p><Link href="/dashboard/contractors/new">契約者を登録する</Link></p>}
                     {!rooms.length && <p><Link href="/dashboard/properties">物件/部屋を登録する</Link></p>}
                </Alert>
             </Box>
        );
    }


    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                新規契約登録
            </Typography>
            <Paper sx={{ p: 3 }}>
                 <ContractForm
                    serverAction={createContract}
                    contractors={contractors} // 取得した契約者リストを渡す
                    rooms={rooms}             // 取得した部屋リストを渡す
                 />
            </Paper>
        </Box>
    );
}