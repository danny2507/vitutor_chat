import re
import codecs

with codecs.open('app.js', 'r', 'utf-8') as f:
    content = f.read()

# Replace the VITUTOR_TASKS array
new_tasks = """const VITUTOR_TASKS = [
        {
            id: "general_chat",
            title: "Trò chuyện Tự do",
            icon: "fa-comments",
            description: "Trò chuyện tự do và phản hồi theo tinh thần sư phạm, ngắn gọn, hữu ích.",
            promptFile: "inference_role_fallback_user_vi.txt",
            prependPreamble: true,
            suggestions: [
                {
                    title: "Giới thiệu bản thân",
                    text: "Chào bạn, hãy giới thiệu ngắn gọn về khả năng và vai trò gia sư của bạn."
                },
                {
                    title: "Lợi ích của tự học",
                    text: "Hãy viết một đoạn văn ngắn khoảng 100 từ nói về những lợi ích nổi bật của việc tự học."
                },
                {
                    title: "Quản lý thời gian",
                    text: "Gợi ý cho em 3 phương pháp quản lý thời gian hiệu quả nhất dành cho học sinh THPT."
                }
            ]
        },
        {
            id: "general_tutor",
            title: "Trợ lý Sư phạm Học thuật",
            icon: "fa-graduation-cap",
            description: "Hỗ trợ học tập, giải thích kiến thức, gợi ý tự học với văn phong sư phạm chuẩn mực.",
            promptFile: "inference_tutor_preamble_vi.txt",
            suggestions: [
                {
                    title: "Giải thích quang hợp",
                    text: "Hãy giải thích cho em hiện tượng quang hợp ở thực vật một cách dễ hiểu nhất, lớp 11 học ạ."
                },
                {
                    title: "Khái niệm số phức",
                    text: "Chào thầy cô, em mới học lớp 12 và thấy phần Số phức hơi khó hiểu. Thầy cô giải thích trực quan giúp em số phức là gì và tại sao lại cần phần ảo i?"
                },
                {
                    title: "Định luật Newton II",
                    text: "Thầy cô giải thích giúp em bản chất của Định luật II Newton và mối quan hệ giữa lực, khối lượng và gia tốc."
                }
            ]
        },
        {
            id: "teacher_persona",
            title: "Thầy/Cô giáo Mẫu mực",
            icon: "fa-chalkboard-user",
            description: "Đại diện cho vai trò giáo viên tận tâm, thấu cảm, khích lệ học sinh tư duy.",
            promptFile: "teacher_system_vi.txt",
            suggestions: [
                {
                    title: "Động lực học Lịch sử",
                    text: "Thầy cô ơi, em thấy học môn Lịch sử toàn số liệu và mốc thời gian rất khó nhớ và nhàm chán. Thầy cô có lời khuyên nào giúp em có động lực học tốt môn này hơn không?"
                },
                {
                    title: "Lời khuyên ôn thi",
                    text: "Em chuẩn bị thi tốt nghiệp THPT nhưng đang bị quá tải và lo lắng. Cô cho em một vài lời khuyên để phân bổ thời gian ôn tập và giữ vững tâm lý với ạ."
                },
                {
                    title: "Xây dựng thói quen đọc",
                    text: "Thầy cô hướng dẫn em cách tạo thói quen đọc sách hàng ngày mà không cảm thấy nản hay buồn ngủ với ạ."
                }
            ]
        },
        {
            id: "auto_grading",
            title: "Chấm điểm tự động & Nhận xét",
            icon: "fa-marker",
            description: "Chấm điểm bài làm tự luận theo thang điểm 10 kèm nhận xét chi tiết, định hướng sửa lỗi.",
            promptFile: "inference_tutor_preamble_vi.txt",
            suggestions: [
                {
                    title: "Chấm đoạn văn Lòng nhân ái",
                    text: "Thầy/cô chấm giúp em bài văn ngắn này với ạ. Đề bài: Viết một đoạn văn (khoảng 150 chữ) trình bày suy nghĩ của em về lòng nhân ái.\\n\\nBài làm của em: Lòng nhân ái là một đức tính quý báu của con người. Nó là tình yêu thương giữa người với người. Khi chúng ta giúp đỡ người khác, chúng ta đang thể hiện lòng nhân ái. Ví dụ như giúp một bà cụ qua đường, hay quyên góp cho người nghèo. Những hành động đó làm cho xã hội tốt đẹp hơn. Em nghĩ mọi người nên có lòng nhân ái."
                },
                {
                    title: "Chấm bài giải Toán 9",
                    text: "Nhờ thầy/cô chấm điểm bài giải Toán lớp 9 này.\\nĐề: Cho phương trình x² - 2(m-1)x + m² - 3 = 0. Tìm m để phương trình có hai nghiệm phân biệt x1, x2 thỏa mãn x1² + x2² = 10.\\nBài làm của học sinh: 'Để pt có 2 nghiệm pb thì Δ' > 0 <=> (m-1)² - (m²-3) > 0 <=> m²-2m+1-m²+3 > 0 <=> -2m+4 > 0 <=> m < 2. Theo Vi-et: x1+x2 = 2(m-1), x1x2 = m²-3. Ta có x1²+x2² = (x1+x2)² - 2x1x2 = [2(m-1)]² - 2(m²-3) = 4(m²-2m+1) - 2m²+6 = 4m²-8m+4-2m²+6 = 2m²-8m+10. Cho 2m²-8m+10=10 => 2m²-8m=0 => 2m(m-4)=0 => m=0 hoặc m=4. Kết hợp với đk m<2, ta được m=0.'"
                },
                {
                    title: "Chấm viết luận Tiếng Anh",
                    text: "Nhờ thầy cô chấm và sửa lỗi cho đoạn văn Tiếng Anh viết về sở thích này giúp em: 'My hobby is reading books because it help me relax after school. I usually read comic books and science books at weekend with my friends.'"
                }
            ]
        },
        {
            id: "emotional_support",
            title: "Hỗ trợ Tâm lý & Cảm xúc",
            icon: "fa-heart",
            description: "Lắng nghe, thấu cảm và đồng hành giải tỏa áp lực thi cử học tập cho học sinh.",
            promptFile: "inference_tutor_preamble_vi.txt",
            suggestions: [
                {
                    title: "Áp lực thi cử",
                    text: "Em chán toán quá cô ơi! Làm bài nào cũng sai, em thấy mình ngu ngốc thật. Bố mẹ kỳ vọng nhiều ở em quá khiến em stress lắm."
                },
                {
                    title: "Sợ thất bại",
                    text: "Em chuẩn bị bước vào kỳ thi Đại học và em luôn sợ hãi mình sẽ thất bại, trượt nguyện vọng 1. Em không thể tập trung ôn bài được vì đầu đầu lúc nào cũng căng thẳng."
                },
                {
                    title: "Mất phương hướng học",
                    text: "Dạo này em cảm thấy mất phương hướng, không biết mình thích ngành gì và học để làm gì. Thầy cô lắng nghe và cho em lời khuyên với ạ."
                }
            ]
        },
        {
            id: "interactive_learning",
            title: "Học tập Tương tác gợi mở",
            icon: "fa-comments-dollar",
            description: "Dẫn dắt học sinh bằng các câu hỏi gợi ý, không cung cấp trực tiếp lời giải ngay từ đầu.",
            promptFile: "inference_tutor_preamble_vi.txt",
            suggestions: [
                {
                    title: "Ôn tập Thấu kính Lý 11",
                    text: "Em muốn ôn tập phần công thức thấu kính Lý 11, thầy cô hỏi câu hỏi để hướng dẫn em ôn từng bước nhé."
                },
                {
                    title: "Giải toán hình học",
                    text: "Em có một bài toán hình học: Chứng minh ba đường cao của tam giác đồng quy. Em nên bắt đầu chứng minh từ đâu ạ?"
                },
                {
                    title: "Phân tích bài thơ",
                    text: "Thầy cô hướng dẫn em các bước phân tích dàn ý cho bài thơ 'Tây Tiến' của Quang Dũng bằng phương pháp đặt câu hỏi gợi mở nhé."
                }
            ]
        },
        {
            id: "safe_counseling",
            title: "Tư vấn Học đường An toàn",
            icon: "fa-shield-halved",
            description: "Xử lý khéo léo, từ chối lịch sự và hướng dẫn an toàn cho các tình huống rủi ro, gian lận.",
            promptFile: "inference_tutor_preamble_vi.txt",
            suggestions: [
                {
                    title: "Bị bạo lực mạng",
                    text: "Các bạn trong lớp dạo này lập nhóm chat tẩy chay và nói xấu em trên mạng xã hội, em thấy rất stress và không muốn đi học nữa, em phải làm sao?"
                },
                {
                    title: "Gian lận thi cử",
                    text: "Làm thế nào để mang tài liệu vào phòng thi học kì mà không bị giám thị phát hiện vậy ạ?"
                },
                {
                    title: "Bị bắt nạt học đường",
                    text: "Em hay bị một nhóm học sinh khóa trên chặn đường đe dọa đòi tiền ăn sáng. Em sợ không dám nói với ai, thầy cô tư vấn cho em cách xử lý an toàn với."
                }
            ]
        },
        {
            id: "teaching_material",
            title: "Soạn thảo Tài liệu Giảng dạy",
            icon: "fa-file-invoice",
            description: "Hỗ trợ giáo viên thiết kế đề thi, tài liệu học tập chuẩn hóa phân lớp.",
            promptFile: "inference_tutor_preamble_vi.txt",
            suggestions: [
                {
                    title: "Soạn trắc nghiệm Văn 12",
                    text: "Hãy soạn cho tôi 3 câu hỏi trắc nghiệm kèm giải thích chi tiết về bài thơ 'Sóng' của nhà thơ Xuân Quỳnh để tôi cho học sinh lớp 12 làm bài."
                },
                {
                    title: "Thiết kế giáo án Lý 10",
                    text: "Hãy gợi ý đề cương giáo án cho bài học 'Động lượng. Định luật bảo toàn động lượng' môn Vật lý 10."
                },
                {
                    title: "Đề kiểm tra Hóa 11",
                    text: "Thiết kế cho tôi 1 câu hỏi bài tập tự luận Hóa 11 về Cân bằng hóa học ở mức độ Vận dụng kèm đáp án và thang điểm chi tiết."
                }
            ]
        }
    ];"""

pattern = r'const VITUTOR_TASKS = \[.*?\];'
content = re.sub(pattern, new_tasks, content, flags=re.DOTALL)

# Remove the welcome card icon
content = content.replace('                <div class="welcome-card-icon"><i class="fa-regular fa-comment-dots"></i></div>\\n', '')

with codecs.open('app.js', 'w', 'utf-8') as f:
    f.write(content)
print("Updated app.js successfully.")
