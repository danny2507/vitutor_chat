// ViTutor Chat Application Logic
document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------------------
    // TASKS DEFINITION WITH THEIR PRE-TRAINED SYSTEM PROMPTS
    // ---------------------------------------------------------
    const VITUTOR_TASKS = [
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
                    text: `Thầy/cô chấm giúp em bài văn ngắn này với ạ. Đề bài: Viết một đoạn văn (khoảng 150 chữ) trình bày suy nghĩ của em về lòng nhân ái.

Bài làm của em: Lòng nhân ái là một đức tính quý báu của con người. Nó là tình yêu thương giữa người với người. Khi chúng ta giúp đỡ người khác, chúng ta đang thể hiện lòng nhân ái. Ví dụ như giúp một bà cụ qua đường, hay quyên góp cho người nghèo. Những hành động đó làm cho xã hội tốt đẹp hơn. Em nghĩ mọi người nên có lòng nhân ái.`
                },
                {
                    title: "Chấm bài giải Toán 9",
                    text: `Nhờ thầy/cô chấm điểm bài giải Toán lớp 9 này.
Đề: Cho phương trình x² - 2(m-1)x + m² - 3 = 0. Tìm m để phương trình có hai nghiệm phân biệt x1, x2 thỏa mãn x1² + x2² = 10.
Bài làm của học sinh: 'Để pt có 2 nghiệm pb thì Δ' > 0 <=> (m-1)² - (m²-3) > 0 <=> m²-2m+1-m²+3 > 0 <=> -2m+4 > 0 <=> m < 2. Theo Vi-et: x1+x2 = 2(m-1), x1x2 = m²-3. Ta có x1²+x2² = (x1+x2)² - 2x1x2 = [2(m-1)]² - 2(m²-3) = 4(m²-2m+1) - 2m²+6 = 4m²-8m+4-2m²+6 = 2m²-8m+10. Cho 2m²-8m+10=10 => 2m²-8m=0 => 2m(m-4)=0 => m=0 hoặc m=4. Kết hợp với đk m<2, ta được m=0.'`
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
    ];

    // ---------------------------------------------------------
    // STATE MANAGEMENT
    // ---------------------------------------------------------
    let currentTask = VITUTOR_TASKS[0];
    let chatHistoryMap = {}; // taskId -> list of messages
    let activeModel = "URAx-TaiDuc";
    let isPromptEditorExpanded = false;
    let isGenerating = false;
    let currentReader = null;

    // Load initial settings
    const settings = {
        endpoint: localStorage.getItem("vitutor_endpoint") || "http://59.153.246.12:8000/v1/chat/completions",
        apiKey: localStorage.getItem("vitutor_apikey") || "",
        temperature: parseFloat(localStorage.getItem("vitutor_temp") || "0.0")
    };

    // ---------------------------------------------------------
    // DOM ELEMENTS
    // ---------------------------------------------------------
    const taskListEl = document.getElementById("task-list");
    const modelSelectEl = document.getElementById("model-select");
    const customModelInputEl = document.getElementById("custom-model-input");
    const systemPromptTextarea = document.getElementById("system-prompt-textarea");
    const promptToggleBtn = document.getElementById("prompt-toggle-btn");
    const promptEditorBody = document.getElementById("prompt-editor-body");
    const promptChevron = document.getElementById("prompt-chevron");
    
    const chatTitleEl = document.getElementById("chat-title");
    const chatSubtitleEl = document.getElementById("chat-subtitle");
    const btnClearChat = document.getElementById("btn-clear-chat");
    const welcomeViewEl = document.getElementById("welcome-view");
    const welcomePromptsGrid = document.getElementById("welcome-prompts-grid");
    const chatMessagesEl = document.getElementById("chat-messages");
    
    const chatInputEl = document.getElementById("chat-input");
    const btnSendEl = document.getElementById("btn-send");
    
    // Settings modal elements
    const btnOpenSettings = document.getElementById("btn-open-settings");
    const settingsModal = document.getElementById("settings-modal");
    const btnCloseSettings = document.getElementById("btn-close-settings");
    const btnCancelSettings = document.getElementById("btn-cancel-settings");
    const btnSaveSettings = document.getElementById("btn-save-settings");
    const settingsEndpointInput = document.getElementById("settings-endpoint");
    const settingsApiKeyInput = document.getElementById("settings-apikey");
    const settingsTempInput = document.getElementById("settings-temp");
    const tempValDisplay = document.getElementById("temp-val-display");

    // Initialize System Prompt Editor display state
    promptEditorBody.style.display = "none";

    // ---------------------------------------------------------
    // INITIALIZATION FUNCTION
    // ---------------------------------------------------------
    function init() {
        // Render tasks sidebar
        renderTaskList();

        // Load active task
        selectTask(VITUTOR_TASKS[0].id);

        // Bind events
        bindEvents();

        // Initial settings sync to inputs
        settingsEndpointInput.value = settings.endpoint;
        settingsApiKeyInput.value = settings.apiKey;
        settingsTempInput.value = settings.temperature;
        tempValDisplay.textContent = settings.temperature;

        // Auto render LaTeX on page load (just in case)
        renderMath();
    }

    // ---------------------------------------------------------
    // EVENT BINDINGS
    // ---------------------------------------------------------
    function bindEvents() {
        // Model Selection change
        modelSelectEl.addEventListener("change", (e) => {
            if (e.target.value === "custom") {
                customModelInputEl.style.display = "block";
                customModelInputEl.value = "";
                customModelInputEl.focus();
                activeModel = "";
            } else {
                customModelInputEl.style.display = "none";
                activeModel = e.target.value;
                updateSubtitle();
            }
        });

        customModelInputEl.addEventListener("input", (e) => {
            activeModel = e.target.value.trim();
            updateSubtitle();
        });

        // Prompt Editor accordion
        promptToggleBtn.addEventListener("click", () => {
            isPromptEditorExpanded = !isPromptEditorExpanded;
            if (isPromptEditorExpanded) {
                promptEditorBody.style.display = "block";
                promptChevron.classList.remove("fa-chevron-down");
                promptChevron.classList.add("fa-chevron-up");
            } else {
                promptEditorBody.style.display = "none";
                promptChevron.classList.remove("fa-chevron-up");
                promptChevron.classList.add("fa-chevron-down");
            }
        });

        // System prompt changes affect current task system prompt
        systemPromptTextarea.addEventListener("input", (e) => {
            currentTask.systemPrompt = e.target.value;
        });

        // Open settings modal
        btnOpenSettings.addEventListener("click", () => {
            settingsEndpointInput.value = settings.endpoint;
            settingsApiKeyInput.value = settings.apiKey;
            settingsTempInput.value = settings.temperature;
            tempValDisplay.textContent = settings.temperature;
            settingsModal.classList.add("open");
        });

        // Close settings modal
        const closeModal = () => settingsModal.classList.remove("open");
        btnCloseSettings.addEventListener("click", closeModal);
        btnCancelSettings.addEventListener("click", closeModal);

        settingsTempInput.addEventListener("input", (e) => {
            tempValDisplay.textContent = e.target.value;
        });

        // Save settings
        btnSaveSettings.addEventListener("click", () => {
            settings.endpoint = settingsEndpointInput.value.trim();
            settings.apiKey = settingsApiKeyInput.value.trim();
            settings.temperature = parseFloat(settingsTempInput.value);

            localStorage.setItem("vitutor_endpoint", settings.endpoint);
            localStorage.setItem("vitutor_apikey", settings.apiKey);
            localStorage.setItem("vitutor_temp", settings.temperature);

            closeModal();
            
            // Visual success indicator
            const btnText = btnOpenSettings.innerHTML;
            btnOpenSettings.innerHTML = `<i class="fa-solid fa-check"></i> Đã cập nhật`;
            setTimeout(() => {
                btnOpenSettings.innerHTML = btnText;
            }, 2000);
        });

        // Text area auto resize
        chatInputEl.addEventListener("input", () => {
            chatInputEl.style.height = "auto";
            chatInputEl.style.height = (chatInputEl.scrollHeight - 10) + "px";
            btnSendEl.disabled = chatInputEl.value.trim().length === 0 || isGenerating;
        });

        // Text area enter key to send
        chatInputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Send Button Click
        btnSendEl.addEventListener("click", sendMessage);

        // Clear Chat
        btnClearChat.addEventListener("click", () => {
            if (confirm("Em có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện của task này không?")) {
                chatHistoryMap[currentTask.id] = [];
                renderChatHistory();
            }
        });

        // Mobile Sidebar Controls
        const mobileMenuBtn = document.getElementById("mobile-menu-btn");
        const sidebarOverlay = document.getElementById("sidebar-overlay");
        const sidebarEl = document.querySelector(".sidebar");

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener("click", () => {
                sidebarEl.classList.toggle("open");
                if (sidebarOverlay) sidebarOverlay.classList.toggle("active");
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener("click", closeMobileSidebar);
        }
    }

    function closeMobileSidebar() {
        const sidebarEl = document.querySelector(".sidebar");
        const sidebarOverlay = document.getElementById("sidebar-overlay");
        if (sidebarEl) sidebarEl.classList.remove("open");
        if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    }

    // ---------------------------------------------------------
    // SIDEBAR RENDERING
    // ---------------------------------------------------------
    function renderTaskList() {
        taskListEl.innerHTML = "";
        VITUTOR_TASKS.forEach(task => {
            const card = document.createElement("button");
            card.className = `task-card ${task.id === currentTask.id ? 'active' : ''}`;
            card.id = `task-btn-${task.id}`;
            card.innerHTML = `
                <div class="task-title">
                    <i class="fa-solid ${task.icon}" style="color: var(--bk-blue-light)"></i>
                    <span>${task.title}</span>
                </div>
                <div class="task-desc">${task.description}</div>
            `;
            card.addEventListener("click", () => selectTask(task.id));
            taskListEl.appendChild(card);
        });
    }

    function selectTask(taskId) {
        // Find task
        const task = VITUTOR_TASKS.find(t => t.id === taskId);
        if (!task) return;

        // Auto close mobile drawer when task selected
        closeMobileSidebar();

        // Cancel running requests if any
        if (isGenerating) {
            stopGeneration();
        }

        currentTask = task;

        // Visual select state update in sidebar
        document.querySelectorAll(".task-card").forEach(card => card.classList.remove("active"));
        const activeCard = document.getElementById(`task-btn-${taskId}`);
        if (activeCard) activeCard.classList.add("active");

        // Sync headers & prompt editor
        chatTitleEl.innerHTML = `<i class="fa-solid ${task.icon}" style="margin-right: 8px; color: var(--bk-blue-primary)"></i>${task.title}`;
        
        // Dynamically load the prompt from file if not loaded yet
        if (task.systemPrompt === undefined) {
            systemPromptTextarea.value = "Đang tải prompt từ file...";
            
            // Fetch main prompt file
            fetch(`./prompts/${task.promptFile}`)
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    return res.text();
                })
                .then(text => {
                    let promptContent = text.trim();
                    // Replace placeholders
                    promptContent = promptContent.replace(/{n}/g, "4").replace(/{letters}/g, "A, B, C, D");
                    
                    if (task.prependPreamble) {
                        // We need to fetch and prepend the generic tutor preamble
                        return fetch('./prompts/inference_tutor_preamble_vi.txt')
                            .then(preambleRes => {
                                if (!preambleRes.ok) throw new Error(`HTTP error! status: ${preambleRes.status}`);
                                return preambleRes.text();
                            })
                            .then(preambleText => {
                                task.systemPrompt = preambleText.trim() + "\n\n" + promptContent;
                                if (currentTask.id === taskId) {
                                    systemPromptTextarea.value = task.systemPrompt;
                                }
                            });
                    } else {
                        task.systemPrompt = promptContent;
                        if (currentTask.id === taskId) {
                            systemPromptTextarea.value = task.systemPrompt;
                        }
                    }
                })
                .catch(err => {
                    console.error("Lỗi tải prompt từ file:", err);
                    task.systemPrompt = `Lỗi: Không thể tải prompt từ file ${task.promptFile}.`;
                    if (currentTask.id === taskId) {
                        systemPromptTextarea.value = task.systemPrompt;
                    }
                });
        } else {
            systemPromptTextarea.value = task.systemPrompt;
        }

        updateSubtitle();

        // Render chat history or welcome suggestions
        if (!chatHistoryMap[taskId]) {
            chatHistoryMap[taskId] = [];
        }
        renderChatHistory();
    }

    function updateSubtitle() {
        const displayModelName = activeModel || "Chưa nhập mô hình...";
        chatSubtitleEl.textContent = `Mô hình: ${displayModelName} | Endpoint: ${settings.endpoint}`;
    }

    // ---------------------------------------------------------
    // CHAT HISTORY RENDERING & SUGGESTIONS
    // ---------------------------------------------------------
    function renderChatHistory() {
        const history = chatHistoryMap[currentTask.id] || [];
        
        if (history.length === 0) {
            // Show welcome state
            welcomeViewEl.style.display = "flex";
            chatMessagesEl.style.display = "none";
            renderSuggestions();
        } else {
            // Show messages list
            welcomeViewEl.style.display = "none";
            chatMessagesEl.style.display = "flex";
            
            chatMessagesEl.innerHTML = "";
            history.forEach(msg => {
                appendMessageToUI(msg.role, msg.content);
            });
            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
        }
    }

    function renderSuggestions() {
        welcomePromptsGrid.innerHTML = "";
        currentTask.suggestions.forEach(sug => {
            const card = document.createElement("div");
            card.className = "welcome-card";
            card.innerHTML = `
                <div class="welcome-card-title">${sug.title}</div>
                <div class="welcome-card-desc">"${sug.text}"</div>
            `;
            card.addEventListener("click", () => {
                chatInputEl.value = sug.text;
                chatInputEl.style.height = "auto";
                chatInputEl.style.height = (chatInputEl.scrollHeight - 10) + "px";
                btnSendEl.disabled = false;
                sendMessage();
            });
            welcomePromptsGrid.appendChild(card);
        });
    }

    // ---------------------------------------------------------
    // MARKDOWN & THINK COMPONENT PARSER
    // ---------------------------------------------------------
    function parseMarkdownAndThoughts(text) {
        // 1. Separate <think> blocks
        let thinkContent = "";
        let mainContent = text;

        const thinkStart = text.indexOf("<think>");
        const thinkEnd = text.indexOf("</think>");

        if (thinkStart !== -1) {
            if (thinkEnd !== -1) {
                thinkContent = text.substring(thinkStart + 7, thinkEnd).trim();
                mainContent = text.substring(0, thinkStart) + text.substring(thinkEnd + 8);
            } else {
                // If it starts but doesn't end yet (during streaming)
                thinkContent = text.substring(thinkStart + 7).trim();
                mainContent = text.substring(0, thinkStart);
            }
        }

        // Clean main content extra whitespaces
        mainContent = mainContent.trim();

        // 2. Build HTML
        let htmlOutput = "";

        // Render thought box if thinkContent exists
        if (thinkContent) {
            const isCollapsedClass = (thinkEnd !== -1) ? "collapsed" : "";
            htmlOutput += `
                <div class="thought-container ${isCollapsedClass}" id="thought-box-current">
                    <div class="thought-header" onclick="toggleThoughtBox(this)">
                        <div class="thought-title-wrapper">
                            <i class="fa-solid fa-brain thought-icon"></i>
                            <span>Luồng suy nghĩ nội bộ...</span>
                        </div>
                        <i class="fa-solid fa-chevron-down thought-toggle-icon"></i>
                    </div>
                    <div class="thought-content">${escapeHTML(thinkContent)}</div>
                </div>
            `;
        }

        // Parse markdown body
        if (mainContent) {
            htmlOutput += `<div class="message-text-body">${formatMarkdown(mainContent)}</div>`;
        } else if (!thinkContent) {
            // Empty placeholder
            htmlOutput += `<div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>`;
        }

        return htmlOutput;
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function formatMarkdown(text) {
        let html = escapeHTML(text);

        // Code block formatting: ```lang ... ```
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        html = html.replace(codeBlockRegex, (match, lang, code) => {
            const language = lang || "text";
            const uid = 'code-' + Math.random().toString(36).substring(2, 9);
            // Replace encoded HTML tags back inside code blocks
            const decodedCode = code
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'");

            return `
                <div class="code-header">
                    <span>Mã nguồn (${language})</span>
                    <button class="btn-copy-code" onclick="copyCodeText('${uid}')">
                        <i class="fa-regular fa-copy"></i> Sao chép
                    </button>
                </div>
                <pre><code id="${uid}">${escapeHTML(decodedCode)}</code></pre>
            `;
        });

        // Inline code formatting: `code`
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bold formatting: **text**
        html = html.replace(/\*\*([\s\S]+?)\*\*/g, '<strong>$1</strong>');

        // Bullet lists
        html = html.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // New lines to paragraphs/br
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        
        // Wrap everything in a paragraph if it doesn't start with tags
        if (!html.startsWith("<") && !html.startsWith("\n")) {
            html = '<p>' + html + '</p>';
        }

        // Clean empty elements
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><br><\/p>/g, '');

        return html;
    }

    // ---------------------------------------------------------
    // CLIENT MESSAGE EMISSION & STREAM CONSUMER
    // ---------------------------------------------------------
    async function sendMessage() {
        const userText = chatInputEl.value.trim();
        if (!userText || isGenerating) return;

        // Reset input field
        chatInputEl.value = "";
        chatInputEl.style.height = "36px";
        btnSendEl.disabled = true;

        // Hide welcome view if first message
        if (chatHistoryMap[currentTask.id].length === 0) {
            welcomeViewEl.style.display = "none";
            chatMessagesEl.style.display = "flex";
            chatMessagesEl.innerHTML = "";
        }

        // Add user message to history
        const userMessage = { role: "user", content: userText };
        chatHistoryMap[currentTask.id].push(userMessage);
        appendMessageToUI("user", userText);

        // Prep container for tutor response
        const assistantMessageEl = appendMessageToUI("assistant", "");
        const bubbleInner = assistantMessageEl.querySelector(".message-bubble");
        
        isGenerating = true;
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

        // Build messages payload: include active system prompt + historical context
        const apiMessages = [
            { role: "system", content: currentTask.systemPrompt },
            ...chatHistoryMap[currentTask.id]
        ];

        const payload = {
            endpoint: settings.endpoint,
            apiKey: settings.apiKey,
            model: activeModel || "vitutor-qwen3-8b-full-sft-dpo-grpo",
            messages: apiMessages,
            temperature: settings.temperature,
            max_tokens: 2048,
            stream: true
        };

        let assistantContent = "";

        try {
            const controller = new AbortController();
            const signal = controller.signal;
            currentReader = controller;

            const response = await fetch('./api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: signal
            });

            if (!response.ok) {
                const errText = await response.text();
                let errMsg = "Không thể kết nối đến máy chủ LLM.";
                try {
                    const parsedErr = JSON.parse(errText);
                    errMsg = parsedErr.error?.message || parsedErr.message || errText;
                } catch {
                    errMsg = errText || response.statusText;
                }
                throw new Error(errMsg);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Hold onto incomplete last line

                for (const line of lines) {
                    const cleanLine = line.trim();
                    if (!cleanLine) continue;

                    if (cleanLine === 'data: [DONE]') {
                        break;
                    }

                    if (cleanLine.startsWith('data: ')) {
                        try {
                            const parsed = JSON.parse(cleanLine.slice(6));
                            const textDelta = parsed.choices?.[0]?.delta?.content || "";
                            assistantContent += textDelta;

                            // Re-render the chat bubble with updated stream
                            bubbleInner.innerHTML = parseMarkdownAndThoughts(assistantContent);
                            chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
                        } catch (e) {
                            // Suppress parsing errors for unfinished buffers
                        }
                    }
                }
            }

            // Save the complete tutor answer to history
            chatHistoryMap[currentTask.id].push({ role: "assistant", content: assistantContent });

        } catch (err) {
            console.error(err);
            if (err.name === 'AbortError') {
                assistantContent += "\n\n*(Đã dừng sinh câu trả lời bởi người dùng)*";
            } else {
                assistantContent += `\n\n<div style="color: #f43f5e; font-weight: bold; border-left: 3px solid #f43f5e; padding-left: 10px;">Lỗi kết nối: ${err.message}</div>`;
            }
            bubbleInner.innerHTML = parseMarkdownAndThoughts(assistantContent);
        } finally {
            isGenerating = false;
            currentReader = null;
            btnSendEl.disabled = chatInputEl.value.trim().length === 0;
            
            // Finalize LaTeX Math rendering on complete message
            renderMath();
        }
    }

    function stopGeneration() {
        if (currentReader) {
            currentReader.abort();
            isGenerating = false;
            currentReader = null;
        }
    }

    // ---------------------------------------------------------
    // UI HELPER FUNCTIONS
    // ---------------------------------------------------------
    function appendMessageToUI(role, content) {
        const wrapper = document.createElement("div");
        wrapper.className = `message-wrapper ${role}`;

        const avatar = document.createElement("div");
        avatar.className = "message-avatar";
        avatar.innerHTML = role === "user" ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-graduation-cap"></i>';
        avatar.title = role === "user" ? "Học sinh" : "Gia sư ViTutor";

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        
        if (role === "assistant" && content === "") {
            // Typing spinner
            bubble.innerHTML = `<div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>`;
        } else {
            bubble.innerHTML = parseMarkdownAndThoughts(content);
        }

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        chatMessagesEl.appendChild(wrapper);
        return wrapper;
    }

    function renderMath() {
        if (typeof renderMathInElement === "function") {
            try {
                renderMathInElement(chatMessagesEl, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\[', display: true}
                    ],
                    throwOnError: false
                });
            } catch (e) {
                console.warn("KaTeX MathJax Render Error:", e);
            }
        }
    }

    // Initialize
    init();
});

// Global functions attached to window scope for onclick actions inside dynamically created HTML
window.toggleThoughtBox = function(headerElement) {
    const box = headerElement.parentElement;
    box.classList.toggle("collapsed");
};

window.copyCodeText = function(elementId) {
    const codeEl = document.getElementById(elementId);
    if (!codeEl) return;

    navigator.clipboard.writeText(codeEl.textContent).then(() => {
        // Temporary label feedback
        const btn = codeEl.parentElement.previousElementSibling.querySelector(".btn-copy-code");
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fa-solid fa-check" style="color: #10b981"></i> Đã chép`;
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error("Copy failed", err);
    });
};
