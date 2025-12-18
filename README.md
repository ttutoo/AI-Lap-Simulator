
# 🔬 Tài liệu Kỹ thuật: AI Lab - Request Pipeline Simulator

Đây là module thiết kế để trực quan hóa sự vận hành của **Handler Pattern (Chain of Responsibility)** thông qua việc kết hợp giữa giao diện React và trí tuệ nhân tạo Gemini AI.

## 🎯 Mục tiêu của Simulator
Module này giúp người học/khán giả quan sát được:
1.  **Luồng di chuyển của dữ liệu:** Cách một Request đi qua từng lớp bảo mật.
2.  **Cơ chế Ngắt sớm (Short-circuiting):** Nếu một lớp phát hiện lỗi, yêu cầu sẽ bị chặn ngay lập tức để tiết kiệm tài nguyên.
3.  **Tính năng Phân tích Thông minh:** Sử dụng AI để đánh giá các kiểu tấn công thực tế thay vì các câu lệnh `if-else` cứng nhắc.

---

## 🛠️ Các thành phần tham gia (Key Files)

1.  **`components/SimulatorSection.tsx`**: 
    *   Quản lý giao diện (Pipeline Visualization).
    *   Điều khiển vòng lặp xử lý (Loop qua mảng các Handlers).
    *   Hiển thị Terminal Logs thời gian thực.
2.  **`geminiService.ts`**:
    *   Chứa hàm `simulateHandlerLogic`.
    *   Gửi Prompt đến Gemini AI để yêu cầu phân tích Request dưới góc độ bảo mật hệ thống.
3.  **`types.ts`**:
    *   Định nghĩa cấu trúc dữ liệu `LogEntry` và các trạng thái của Handler.

---

## 🏗️ Kiến trúc Chuỗi xử lý (The Pipeline)

Simulator giả lập một hệ thống bảo mật gồm 4 lớp (Handlers):

| Thứ tự | Handler | Nhiệm vụ |
|:---:|:---|:---|
| 1 | **Authentication** | Kiểm tra danh tính (Token/API Key). |
| 2 | **Rate Limiter** | Kiểm tra tần suất yêu cầu (Chống DDoS/Spam). |
| 3 | **Payload Validator** | Kiểm tra cấu trúc dữ liệu JSON có đúng định dạng không. |
| 4 | **WAF Firewall** | Lớp phòng thủ cuối cùng, quét các từ khóa độc hại (SQLi, XSS). |

---

## 🤖 Cơ chế phân tích của Gemini AI

Mỗi khi Request đi qua một Handler, hệ thống sẽ thực hiện một truy vấn đến Gemini với ngữ cảnh:
*"Bạn là một Security Agent, hãy phân tích xem Request '[Tên Request]' có vượt qua được lớp [Tên Handler] không?"*

AI sẽ phản hồi một JSON có cấu trúc:
- `decision`: "PASS" (Cho qua) hoặc "FAIL" (Chặn).
- `reason`: Giải thích chi tiết lý do (ví dụ: "Phát hiện ký tự lạ 'OR 1=1'").
- `logs`: Mã lỗi hệ thống giả lập.

---

## 🚀 Demo 

### Kịch bản 1: Request Hợp lệ (Standard GET Request)
*   **Thao tác:** Chọn "Standard GET Request" -> Nhấn "Chạy luồng xử lý".
*   **Giải thích:** Chỉ cho khán giả thấy tất cả các đèn đều chuyển sang **màu xanh**. Request đi đến đích cuối cùng. Đây là trường hợp hệ thống hoạt động bình thường.

### Kịch bản 2: Lỗi Xác thực (Expired JWT Token)
*   **Thao tác:** Chọn "Expired JWT Token" -> Nhấn "Chạy luồng xử lý".
*   **Giải thích:** Request bị chặn ngay tại bước đầu tiên (**Authentication**). Giải thích về tính năng **Short-circuiting**: Hệ thống không cần chạy các bước tiếp theo, giúp giảm tải cho server.

### Kịch bản 3: Tấn công Bảo mật (SQL Injection)
*   **Thao tác:** Chọn "SQL Injection 'OR 1=1'" -> Nhấn "Chạy luồng xử lý".
*   **Giải thích:** Request vượt qua được 3 lớp đầu (vì Auth đúng, traffic thấp, JSON đúng) nhưng bị chặn lại ở lớp cuối cùng là **Firewall**. Đây là minh chứng cho nguyên tắc **Phòng thủ chiều sâu (Defense in Depth)**.

---

## ⚠️ Lưu ý kỹ thuật
*   Hệ thống yêu cầu biến môi trường `process.env.API_KEY` để kết nối với Gemini.
*   Mỗi bước xử lý có độ trễ 1 giây (`setTimeout`) để người xem có thể kịp quan sát luồng di chuyển.
