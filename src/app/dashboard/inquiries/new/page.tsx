// src/app/(dashboard)/inquiries/new/page.tsx
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InquiryForm from '@/features/inquiries/components/InquiryForm';
import { createInquiry } from '@/features/inquiries/actions';
import prisma from '@/lib/prisma';

// フォームで使う契約者リストを取得
async function getContractors() {
    return prisma.contractor.findMany({ orderBy: { name: 'asc' } });
}

export default async function NewInquiryPage() {
    const contractors = await getContractors();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                新規問い合わせ受付
            </Typography>
            <Paper sx={{ p: 3 }}>
                 <InquiryForm
                    serverAction={createInquiry}
                    contractors={contractors} // 契約者リストを渡す
                 />
            </Paper>
        </Box>
    );
}