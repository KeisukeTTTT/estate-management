// src/app/(dashboard)/inquiries/page.tsx
import prisma from '@/lib/prisma';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import InquiryTable from '@/features/inquiries/components/InquiryTable';

async function getInquiries() {
  const inquiries = await prisma.inquiry.findMany({
    include: {
      contractor: true, // 関連する契約者情報も取得
    },
    orderBy: { receivedAt: 'desc' }, // 受付日時が新しい順
  });
  return inquiries;
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">問い合わせ管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/inquiries/new" // 新規作成ページ
        >
          新規問い合わせ受付
        </Button>
      </Box>
      <InquiryTable inquiries={inquiries} />
    </Box>
  );
}

export const revalidate = 0;