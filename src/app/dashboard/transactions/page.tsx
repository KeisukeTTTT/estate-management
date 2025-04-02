// src/app/(dashboard)/transactions/page.tsx
import prisma from '@/lib/prisma';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import TransactionTable from '@/features/transactions/components/TransactionTable';

async function getTransactions() {
  const transactions = await prisma.transaction.findMany({
    include: { // 関連する契約情報も取得
      contract: {
        include: {
          contractor: true,
          room: { include: { property: true } },
        },
      },
    },
    orderBy: { transactionDate: 'desc' }, // 取引日が新しい順
  });
  return transactions;
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">入出金管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/transactions/new" // 新規作成ページ
        >
          新規入出金記録
        </Button>
      </Box>
      <TransactionTable transactions={transactions} />
    </Box>
  );
}

export const revalidate = 0;