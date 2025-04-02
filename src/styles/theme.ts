// src/styles/theme.ts
'use client'; // MUIコンポーネントはクライアントコンポーネントであるため

import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light', // 'light' or 'dark'
    // 必要に応じてカラーパレットをカスタマイズ
    // primary: {
    //   main: '#1976d2',
    // },
    // secondary: {
    //   main: '#dc004e',
    // },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    // 必要に応じてタイポグラフィをカスタマイズ
  },
  components: {
    // 必要に応じてコンポーネントのデフォルトスタイルをオーバーライド
    // MuiButtonBase: {
    //   defaultProps: {
    //     disableRipple: true, // 波紋エフェクトを無効にする例
    //   },
    // },
  },
});

export default theme;