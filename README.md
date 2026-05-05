# 🏥 BookingCare — Frontend

> Ứng dụng web đặt lịch khám bệnh trực tuyến — Giao diện người dùng xây dựng bằng **Vue 3 + TypeScript + Vite**, tích hợp AI Gemini và thông báo thời gian thực qua SignalR.

![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?style=flat-square&logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=flat-square&logo=firebase)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## 📖 Giới thiệu dự án

**BookingCare FE** là phần giao diện người dùng (Frontend) của hệ thống đặt lịch khám bệnh trực tuyến **BookingCare**. Đây là một ứng dụng Single Page Application (SPA) hiện đại, cho phép bệnh nhân tìm kiếm bác sĩ, đặt lịch hẹn khám và nhận thông báo xác nhận theo thời gian thực.

Dự án nổi bật với tính năng **trợ lý AI tích hợp** (Google Gemini) hỗ trợ người dùng trong quá trình tìm kiếm và tư vấn khám bệnh, cùng với hệ thống **thông báo real-time** thông qua SignalR. Toàn bộ dữ liệu được giao tiếp với phần Backend API ([BookingCare_BE](https://github.com/mquangnee/BookingCare_BE)) thông qua RESTful API + SignalR Hub.

---

## 👥 Các đối tượng sử dụng

| Đối tượng | Mô tả |
|---|---|
| **Bệnh nhân** | Tìm kiếm bác sĩ, xem thông tin chuyên khoa, đặt và quản lý lịch hẹn khám bệnh |
| **Bác sĩ** | Xem danh sách lịch hẹn, quản lý lịch làm việc và hồ sơ cá nhân |
| **Phòng khám / Bệnh viện** | Quản lý đội ngũ bác sĩ và thông tin cơ sở y tế trên nền tảng |
| **Quản trị viên (Admin)** | Quản lý toàn bộ hệ thống, phân quyền, theo dõi hoạt động |
| **Người dùng tương tác AI** | Sử dụng trợ lý AI Gemini để được tư vấn và hỗ trợ đặt lịch thông minh |

---

## 🎯 Mục đích xây dựng

- Cung cấp giao diện web trực quan, thân thiện, giúp người dùng đặt lịch khám bệnh dễ dàng mà không cần đến trực tiếp cơ sở y tế.
- Ứng dụng công nghệ **AI (Google Gemini)** vào lĩnh vực y tế để nâng cao trải nghiệm người dùng thông qua trợ lý thông minh.
- Triển khai hệ thống **thông báo thời gian thực** (SignalR) giúp bệnh nhân và bác sĩ nhận ngay thông tin xác nhận/hủy lịch.
- Xây dựng một SPA hiện đại với công nghệ **Vue 3 + TypeScript**, đảm bảo hiệu suất cao, dễ bảo trì và mở rộng.
- Thực hành quy trình CI/CD chuyên nghiệp với GitHub Actions, triển khai liên tục lên **Firebase Hosting**.

---

## ⚙️ Các chức năng chính

### Xác thực người dùng
- Đăng ký tài khoản mới, đăng nhập / đăng xuất
- Quản lý phiên đăng nhập với JWT Token (lưu trữ và tự động làm mới)
- Bảo vệ route theo vai trò (Admin, Bác sĩ, Bệnh nhân)

### Tìm kiếm & Khám phá
- Tìm kiếm bác sĩ theo tên, chuyên khoa, địa điểm
- Xem danh sách bác sĩ nổi bật và chuyên khoa phổ biến
- Xem thông tin chi tiết bác sĩ, lịch làm việc và đánh giá

### Đặt lịch & Quản lý hẹn khám
- Chọn khung giờ trống của bác sĩ và xác nhận đặt lịch
- Xem, theo dõi trạng thái lịch hẹn (chờ xác nhận / đã xác nhận / đã khám / đã hủy)
- Hủy lịch hẹn và nhận thông báo cập nhật

### Thông báo thời gian thực (SignalR)
- Nhận thông báo tức thì khi lịch hẹn được xác nhận hoặc thay đổi
- Kết nối real-time giữa bệnh nhân và bác sĩ qua SignalR Hub

### Trợ lý AI (Google Gemini)
- Tích hợp chatbot AI thông minh hỗ trợ người dùng
- Tư vấn triệu chứng, gợi ý chuyên khoa phù hợp
- Hỗ trợ trả lời câu hỏi về quy trình khám bệnh và đặt lịch

### Hồ sơ cá nhân
- Xem và chỉnh sửa thông tin cá nhân
- Xem lịch sử đặt lịch và hồ sơ khám bệnh

### Trang quản trị (Admin)
- Dashboard thống kê tổng quan hệ thống
- Quản lý người dùng, bác sĩ, chuyên khoa, phòng khám
- Quản lý và duyệt lịch hẹn toàn hệ thống

---

## 🛠️ Công nghệ sử dụng

### Framework & Ngôn ngữ
| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Vue.js** | 3.4 | Framework JavaScript chính để xây dựng UI |
| **TypeScript** | 5.x | Ngôn ngữ lập trình với kiểu dữ liệu tĩnh |
| **Vite** | 5.2 | Build tool & Dev server siêu nhanh |

### Quản lý trạng thái & Điều hướng
| Thư viện | Phiên bản | Mô tả |
|---|---|---|
| **Pinia** | 3.x | State management chính thức của Vue 3 |
| **Vue Router** | 4.x | Client-side routing cho SPA |

### Giao tiếp & Real-time
| Thư viện | Phiên bản | Mô tả |
|---|---|---|
| **Axios** | 1.x | HTTP client giao tiếp với Backend API |
| **@microsoft/signalr** | 10.x | Kết nối real-time SignalR Hub với .NET BE |

### AI & Tiện ích
| Thư viện | Phiên bản | Mô tả |
|---|---|---|
| **@google/genai** | 1.x | Tích hợp Google Gemini AI (chatbot thông minh) |
| **Lodash** | 4.x | Thư viện tiện ích xử lý dữ liệu |
| **eventemitter3** | 5.x | Hệ thống event bus nội bộ |

### DevOps & Triển khai
| Công nghệ | Mô tả |
|---|---|
| **Firebase Hosting** | Hosting tĩnh cho SPA, hỗ trợ CDN toàn cầu |
| **GitHub Actions** | CI/CD tự động build và deploy lên Firebase |

### Cấu trúc dự án
```
BookingCare_FE/
├── .github/workflows/      # CI/CD GitHub Actions
├── src/                    # Source code chính
│   ├── assets/             # Tài nguyên tĩnh (hình ảnh, fonts)
│   ├── components/         # Vue components tái sử dụng
│   ├── views/              # Các trang (pages)
│   ├── router/             # Cấu hình Vue Router
│   ├── stores/             # Pinia stores (state management)
│   ├── services/           # API services (Axios)
│   └── types/              # TypeScript type definitions
├── .env                    # Biến môi trường (Development)
├── .env.production         # Biến môi trường (Production)
├── .firebaserc             # Cấu hình Firebase project
├── firebase.json           # Cấu hình Firebase Hosting
├── index.html              # Entry HTML
├── vite.config.js          # Cấu hình Vite
└── package.json            # Danh sách dependencies
```

---

## 🚀 Cài đặt và sử dụng

### Yêu cầu hệ thống

- [Node.js 18+](https://nodejs.org/) (khuyến nghị 20 LTS)
- npm hoặc yarn
- Git
- Backend API đang chạy: [BookingCare_BE](https://github.com/mquangnee/BookingCare_BE) tại `https://localhost:7243`

---

### 1. Clone repository

```bash
git clone https://github.com/mquangnee/BookingCare_FE.git
cd BookingCare_FE
```

---

### 2. Cài đặt dependencies

```bash
npm install
```

---

### 3. Cấu hình biến môi trường

Tạo hoặc chỉnh sửa file `.env` tại thư mục gốc:

```env
# URL của Backend API (BookingCare_BE)
VITE_API_BASE_URL=https://localhost:7243

# API Key của Google Gemini (lấy tại https://aistudio.google.com/app/apikey)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Lưu ý bảo mật:** Không commit API key thật lên Git. File `.env` đã được thêm vào `.gitignore`. Hãy thay thế bằng key của bạn.

---

### 4. Chạy ứng dụng ở môi trường Development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

> **Lưu ý:** Đảm bảo Backend API ([BookingCare_BE](https://github.com/mquangnee/BookingCare_BE)) đang chạy trước khi khởi động Frontend.

---

### 5. Build cho Production

```bash
npm run build
```

File build sẽ được xuất ra thư mục `dist/`.

---

### 6. Preview bản build Production (local)

```bash
npm run preview
```

---

### 7. Triển khai lên Firebase Hosting (thủ công)

**Cài Firebase CLI (nếu chưa có):**
```bash
npm install -g firebase-tools
```

**Đăng nhập Firebase:**
```bash
firebase login
```

**Build và deploy:**
```bash
npm run build
firebase deploy --only hosting
```

---

### 8. CI/CD tự động với GitHub Actions

Dự án đã cấu hình GitHub Actions tại `.github/workflows/`. Mỗi lần push lên nhánh `main`, hệ thống sẽ tự động:

1. Cài đặt dependencies
2. Build ứng dụng
3. Deploy lên Firebase Hosting

Để kích hoạt, thêm các **GitHub Secrets** sau vào repository:

| Secret | Mô tả |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON |
| `VITE_API_BASE_URL` | URL của Backend API production |
| `VITE_GEMINI_API_KEY` | Google Gemini API Key |

---

## 🔗 Liên kết liên quan

| Tài nguyên | Link |
|---|---|
| Backend API | [BookingCare_BE](https://github.com/mquangnee/BookingCare_BE) |
| Repository FE | [BookingCare_FE](https://github.com/mquangnee/BookingCare_FE) |
| Google AI Studio | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| Firebase Console | [console.firebase.google.com](https://console.firebase.google.com) |

---

## 📄 Giấy phép

Dự án được phát triển cho mục đích học tập và nghiên cứu. Mọi đóng góp đều được chào đón!
