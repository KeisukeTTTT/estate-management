import PropertyTable from '@/features/properties/components/PropertyTable'; // 作成したテーブルコンポーネント
import prisma from '@/lib/prisma';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

// サーバーサイドで物件データを取得する関数
async function getProperties() {
  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: 'desc', // 新しい順に並べる
    },
  });
  return properties;
}

export default async function PropertiesPage() {
  // ページがレンダリングされる際にデータを取得
  const properties = await getProperties();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">物件管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/dashboard/properties/new" // 新規作成ページへのリンク
        >
          新規物件追加
        </Button>
      </Box>

      {/* 取得したデータをテーブルコンポーネントに渡す */}
      <PropertyTable properties={properties} />

    </Box>
  );
}

// データが頻繁に更新されることを想定し、常に最新のデータを取得する設定
// (キャッシュさせたい場合はコメントアウトまたは秒数を指定)
export const revalidate = 0;