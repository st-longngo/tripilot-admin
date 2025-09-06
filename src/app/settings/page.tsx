import { Metadata } from 'next';
import SettingsClient from '@/components/SettingsClient';

export const metadata: Metadata = {
  title: 'Cài đặt | Tripilot Admin',
  description: 'Quản lý cài đặt hệ thống và thông tin cá nhân',
};

export default function SettingsPage() {
  return <SettingsClient />;
}
