// src/app/(dashboard)/contracts/page.tsx
import prisma from '@/lib/prisma';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import ContractTable from '@/features/contracts/components/ContractTable';

// 関連データを含めて契約情報を取得
async function getContractsWithRelations() {
  const contracts = await prisma.contract.findMany({
    include: {
      contractor: true, // 契約者情報
      room: {           // 部屋情報
        include: {
          property: true // 物件情報
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
  return contracts;
}

export default async function ContractsPage() {
  const contracts = await getContractsWithRelations();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">契約管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/contracts/new" // 新規作成ページ
        >
          新規契約追加
        </Button>
      </Box>
      <ContractTable contracts={contracts} />
    </Box>
  );
}

export const revalidate = 0;