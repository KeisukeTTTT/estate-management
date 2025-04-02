// src/app/(dashboard)/transactions/new/page.tsx
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TransactionForm from '@/features/transactions/components/TransactionForm';
import { createTransaction } from '@/features/transactions/actions';
import prisma from '@/lib/prisma';

// フォームで使う契約リストを取得 (関連情報含む)
async function getContractsWithOptions() {
    return prisma.contract.findMany({
        where: { // 必要に応じて有効な契約のみに絞る
             status: { in: ['ACTIVE', 'UPCOMING', 'RENEWAL']}
        },
        include: {
            contractor: true,
            room: { include: { property: true } },
        },
        orderBy: [ // 契約者名 -> 物件名 でソート
            { contractor: { name: 'asc' } },
            { room: { property: { name: 'asc' } } },
        ],
    });
}


export default async function NewTransactionPage() {
    const contracts = await getContractsWithOptions();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                新規入出金記録
            </Typography>
            <Paper sx={{ p: 3 }}>
                 <TransactionForm
                    serverAction={createTransaction}
                    contracts={contracts} // 契約リストを渡す
                 />
            </Paper>
        </Box>
    );
}