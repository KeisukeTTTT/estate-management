// src/app/(dashboard)/layout.tsx
'use client'; // ナビゲーションなどのインタラクションを含むため

import ArticleIcon from '@mui/icons-material/Article'; // 契約
import BusinessIcon from '@mui/icons-material/Business'; // 物件
import HomeIcon from '@mui/icons-material/Home';
import PaymentsIcon from '@mui/icons-material/Payments'; // 入出金
import PeopleIcon from '@mui/icons-material/People'; // 契約者
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'; // 問い合わせ
import SettingsIcon from '@mui/icons-material/Settings'; // 設定
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link'; // Next.js の Link を使用
import { usePathname } from 'next/navigation'; // 現在のパスを取得
import * as React from 'react';

const drawerWidth = 240;

const menuItems = [
  { text: 'ダッシュボード', href: '/', icon: <HomeIcon /> },
  { text: '契約管理', href: '/contracts', icon: <ArticleIcon /> },
  { text: '契約者管理', href: '/contractors', icon: <PeopleIcon /> },
  { text: '物件管理', href: '/properties', icon: <BusinessIcon /> },
  { text: '問い合わせ管理', href: '/inquiries', icon: <QuestionAnswerIcon /> },
  { text: '入出金管理', href: '/transactions', icon: <PaymentsIcon /> },
  { text: '設定', href: '/settings', icon: <SettingsIcon /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            不動産管理システム
          </Typography>
          {/* 必要に応じてヘッダーに他の要素を追加 */}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar /> {/* AppBarと同じ高さのスペース */}
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
               {/* Link コンポーネントを ListItemButton の中に配置 */}
              <ListItemButton
                component={Link} // Link コンポーネントとして動作させる
                href={`/dashboard${item.href === '/' ? '' : item.href}`} // ルートパスを調整
                selected={pathname === `/dashboard${item.href === '/' ? '' : item.href}`} // 現在のパスと比較
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* 他のリスト項目など */}
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar /> {/* AppBarと同じ高さのスペース */}
        {children} {/* 各ページのコンテンツがここに表示される */}
      </Box>
    </Box>
  );
}