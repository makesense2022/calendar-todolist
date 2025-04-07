import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '日历待办事项',
  description: '简单高效的日历待办事项管理工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}
