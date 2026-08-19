This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Docker

cd /home/bss-group/NEXT/cms
docker compose up -d --build

docker compose ps
docker logs -f cms

docker compose down # dừng + xoá container (giữ image)
docker compose down --rmi local # dừng + xoá luôn image vừa build

# 1. Sửa giá trị trong .env

# 2. Nếu thêm biến MỚI, phải khai báo thêm ở cả 2 chỗ:

# - Dockerfile: thêm dòng ARG + ENV tương ứng (dòng 15-18)

# - docker-compose.yml: thêm vào build.args

# 3. Build + chạy lại:

docker compose up -d --build

# b. Biến runtime thường (không có tiền tố NEXT*PUBLIC*, ví dụ server-side secret) — đọc lúc container khởi động, không cần rebuild, chỉ cần recreate container:

# Thêm vào phần `environment:` trong docker-compose.yml, hoặc dùng env_file: .env

docker compose up -d # không cần --build, compose tự recreate container nếu config đổi

## 3. Lệnh tiện dùng khi debug

docker exec -it cms sh # vào shell trong container
docker inspect cms | grep -A20 '"Env"' # xem env thực tế container đang có
docker compose config # xem compose đã nội suy ${...} thành gì, hữu ích để check biến có bị thiếu/rỗng không
