import { Metadata, Viewport } from "next";
import React from "react";

/**
 * ==========================================================================
 * NEXT.JS METADATA — tham khảo đầy đủ các field, nhóm theo mức độ dùng nhiều.
 * Field nào KHÔNG cần cho route này, xoá đi — không phải bắt buộc điền hết.
 * ==========================================================================
 */
export const metadata: Metadata = {
  // ---- NHÓM 1: CORE — dùng ở gần như MỌI trang, quan trọng nhất ----------

  /** <title> của tab browser + kết quả search. Quan trọng nhất cho SEO. */
  title: "Analytics",

  /** <meta name="description">. Google dùng đoạn này làm snippet kết quả tìm kiếm. */
  description: "Real-time fraud analytics and order-scanning statistics.",

  /**
   * canonical + hreflang cho các locale khác — CẦN THIẾT khi app có i18n như dự án
   * này (/en, /vi), tránh Google coi 2 URL khác locale là duplicate content.
   */
  alternates: {
    canonical: "/analytics",
    languages: {
      en: "/en/analytics",
      vi: "/vi/analytics",
    },
  },

  /**
   * Điều khiển crawler index/follow trang. Trang analytics là dashboard nội bộ
   * merchant → không nên để Google index → index:false, follow:false.
   */
  robots: {
    index: false,
    follow: false,
  },

  // ---- NHÓM 2: SOCIAL SHARE — quan trọng khi link được share (Slack, FB, X) ----

  /**
   * Open Graph — quyết định preview card khi share link lên Slack/Facebook/
   * LinkedIn/Zalo... Không có field này thì share ra chỉ có link trần, không ảnh.
   */
  openGraph: {
    type: "website",
    title: "Analytics — Fraud Blocker CMS",
    description: "Real-time fraud analytics and order-scanning statistics.",
    siteName: "Fraud Blocker CMS",
    locale: "en_US",
    alternateLocale: ["vi_VN"],
    images: [
      {
        url: "/og-analytics.png",
        width: 1200,
        height: 630,
        alt: "Fraud Blocker Analytics",
      },
    ],
  },

  /** Twitter/X Card — riêng cho preview trên Twitter/X, tách biệt Open Graph. */
  twitter: {
    card: "summary_large_image",
    title: "Analytics — Fraud Blocker CMS",
    description: "Real-time fraud analytics and order-scanning statistics.",
    images: ["/og-analytics.png"],
  },

  // ---- NHÓM 3: PWA / MOBILE — cần nếu app được "Add to Home Screen" -------

  /** Web App Manifest — cần nếu muốn app cài được như PWA (icon, tên, màu). */
  // manifest: "/manifest.json",

  /** Cấu hình khi mở app dạng standalone trên iOS (Add to Home Screen). */
  appleWebApp: {
    capable: true,
    title: "Fraud Blocker",
    statusBarStyle: "black-translucent",
  },

  /**
   * Ngăn iOS/Android tự động biến số điện thoại/email trong nội dung thành
   * link bấm-gọi — hữu ích cho trang hiển thị số liệu (số liệu ≠ số điện thoại).
   */
  formatDetection: {
    telephone: false,
    email: false,
  },

  // ---- NHÓM 4: XÁC MINH QUYỀN SỞ HỮU DOMAIN — chỉ cần set 1 LẦN ở ROOT ----
  // Không cần lặp lại ở từng route con như file này — để ở root layout.
  // verification: { google: "xxxx", yandex: "xxxx" },

  // ---- NHÓM 5: ÍT DÙNG / NICHE — chỉ cần khi có nhu cầu cụ thể ------------

  /** Tên app hiển thị khi cài PWA trên Android (application-name meta tag). */
  applicationName: "Fraud Blocker CMS",

  /** Tác giả trang — chủ yếu cho blog/docs, ít giá trị SEO thực tế. */
  authors: [{ name: "thongbt", url: "https://github.com/thongprotk" }],

  /** Công cụ tạo ra trang — thường để "Next.js" hoặc tên CMS, không ảnh hưởng SEO. */
  generator: "Next.js",

  /** Phân loại nội dung cho một số crawler cũ (rất ít công cụ còn đọc field này). */
  category: "tech",
  classification: "Business",

  /**
   * Facebook App ID — CHỈ cần nếu tích hợp Facebook Login/Share Button thực sự,
   * không có tác dụng SEO nếu không dùng Facebook SDK.
   */
  // facebook: { appId: "1234567890" },

  /** Deep-link vào app mobile (iOS/Android) khi link được mở trên thiết bị có cài app. */
  // appLinks: { ios: { appStoreId: "123456789", url: "https://example.com" } },

  /**
   * <link rel="archives|assets|bookmarks">, pagination rel="prev/next" — đúng
   * chuẩn HTML rất cũ, hầu như không crawler nào đọc nữa. Để ví dụ tham khảo,
   * thực tế nên xoá khỏi trang thật để tránh nhiễu.
   */
  // archives: "/archives",
  // assets: "/assets",
  // bookmarks: "/bookmarks",
  // pagination: { previous: "/analytics?page=1", next: "/analytics?page=3" },

  /** Meta tag tuỳ ý không có field chuẩn tương ứng. */
  // other: { "custom-key": "custom-value" },
};

/**
 * viewport/themeColor/colorScheme đã bị tách khỏi `Metadata` (deprecated) — phải
 * export riêng qua `Viewport` như dưới đây, KHÔNG khai báo trong `metadata` nữa.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
