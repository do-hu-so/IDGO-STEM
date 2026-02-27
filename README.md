# Scratch Stars Academy

Nền tảng giáo dục lập trình Scratch cho trẻ em và giáo viên.
DEMO WEB: https://scratch-kid-tqu.vercel.app/
## Công nghệ sử dụng

-   **Frontend:** React + Vite + TypeScript + Tailwind CSS + shadcn/ui
-   **Backend:** Vercel Serverless Functions (TypeScript)
-   **AI:** Groq LLM (llama-3.3-70b) + Pinecone Vector Database

## Hướng dẫn Cài đặt & Chạy

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**:
   Tạo file `.env` tại thư mục gốc:
   ```env
   GROQ_API_KEY=your_groq_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX=scratch-academy
   ```

3. **Chạy ứng dụng**:
   Lệnh sau sẽ chạy cả Frontend và Backend Chatbot:
   ```bash
   npm run dev
   ```
   
   - Web: `http://localhost:5173`
   - API: `http://localhost:3000`

## Ingest dữ liệu cho Chatbot

```bash
npm run ingest
```

## Deploy lên Vercel

```bash
vercel --prod
```

## API Endpoints

| Method | Endpoint         | Mô tả                    |
| ------ | ---------------- | ------------------------ |
| GET    | `/api/products`  | Lấy danh sách sản phẩm   |
| GET    | `/api/resources` | Lấy danh sách tài nguyên |
| POST   | `/api/messages`  | Gửi tin nhắn liên hệ     |
| POST   | `/api/chat`      | Chat với AI Bot          |

## Cấu trúc thư mục

```
├── api/                # Vercel Serverless Functions
│   ├── products.ts
│   ├── resources.ts
│   ├── messages.ts
│   ├── chat.ts
│   └── lib/
├── src/                # Frontend source
│   ├── components/
│   ├── pages/
│   ├── data/
│   └── assets/
├── public/
├── scripts/
│   └── ingest-data.ts
└── package.json
```

---

© 2025 Scratch Stars Academy
