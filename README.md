# TripSync Admin Dashboard

Ứng dụng quản lý tour du lịch được xây dựng với Next.js 14, TypeScript và Tailwind CSS.

## 🚀 Tính năng chính

- **Dashboard tổng quan**: Theo dõi KPI và hoạt động real-time
- **Quản lý Tours**: Tạo, chỉnh sửa và theo dõi tours
- **Quản lý thành viên**: Quản lý thông tin khách hàng và documents
- **Vận chuyển**: Quản lý đội xe, tài xế và tuyến đường
- **Chỗ ở**: Quản lý khách sạn và đặt phòng
- **Báo cáo & Phân tích**: Dashboard analytics và reports
- **Giao tiếp**: Hệ thống tin nhắn và thông báo

## 🛠 Công nghệ sử dụng

- **Frontend**: Next.js 14 với App Router
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Heroicons
- **TypeScript**: Full type safety

## 📁 Cấu trúc project

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── tours/            # Tours management
│   ├── participants/     # Participants management
│   └── ...
├── components/            # React components
│   ├── ui/               # UI components (Button, Modal, etc.)
│   ├── layout/           # Layout components
│   ├── navigation/       # Navigation components
│   ├── dashboard/        # Dashboard-specific components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   ├── data/             # Data display components
│   └── business/         # Business logic components
├── services/              # API services
│   └── api/              # API service classes
├── hooks/                 # Custom React hooks
│   └── api/              # React Query hooks
├── store/                 # Zustand stores
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions
└── utils/                 # Helper utilities
```

## 🚀 Cài đặt và chạy

1. **Cài đặt dependencies**
```bash
npm install
```

2. **Cấu hình environment variables**
```bash
cp .env.example .env.local
```

3. **Chạy development server**
```bash
npm run dev
```

4. **Mở ứng dụng**
Truy cập [http://localhost:3000](http://localhost:3000)
