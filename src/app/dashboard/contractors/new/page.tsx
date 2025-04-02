// src/app/(dashboard)/contractors/new/page.tsx
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createContractor } from 'src/features/contractors/actions'; // Server Action
import ContractorForm from 'src/features/contractors/components/ContractorForm';

export default function NewContractorPage() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                新規契約者登録
            </Typography>
            <Paper sx={{ p: 3 }}>
                 {/* Server Action を serverAction プロパティとして渡す */}
                <ContractorForm serverAction={createContractor} />
            </Paper>
        </Box>
    );
}