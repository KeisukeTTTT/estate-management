// src/app/(dashboard)/contractors/page.tsx
import ContractorTable from '@/features/contractors/components/ContractorTable'; // 作成したテーブル
import prisma from '@/lib/prisma';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

async function getContractors() {
  const contractors = await prisma.contractor.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return contractors;
}

export default async function ContractorsPage() {
  const contractors = await getContractors();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">契約者管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/contractors/new" // 新規作成ページへのリンク
        >
          新規契約者追加
        </Button>
      </Box>
      <ContractorTable contractors={contractors} />
    </Box>
  );
}

export const revalidate = 0; // 必要に応じてキャッシュを無効化