// src/app/(dashboard)/page.tsx
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function DashboardHome() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        ようこそ！
      </Typography>
      <Typography paragraph>
        ここはダッシュボードのホームページです。概要情報を表示します。
      </Typography>
      {/* ここにサマリー情報やクイックリンクなどを追加 */}
    </Box>
  );
}