import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import PropertyForm from '@/features/properties/components/PropertyForm';
import { createProperty } from '@/features/properties/actions'; // Server Action をインポート

export default function NewPropertyPage() {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                新規物件登録
            </Typography>
            <Paper sx={{ p: 3 }}>
                {/* Server Action を onSubmit プロパティとして渡す */}
                <PropertyForm onSubmit={createProperty} />
            </Paper>
        </Box>
    );
}