🏷️ TagMaster - LoRA Dataset AI Captioning Tool / LoRA 数据集智能打标助手
TagMaster is a specialized, privacy-focused, local-first web application designed to streamline the image captioning (tagging) process for LoRA, LyCORIS, and Stable Diffusion model training.
Unlike traditional taggers (like WD14) that only output keywords, TagMaster leverages modern Vision Language Models (VLMs)—such as GPT-4o, Gemini 1.5, DeepSeek, and local LLMs—to generate detailed, natural language descriptions or high-quality tag lists, essential for training SDXL, Pony, and Flux models.
TagMaster 是一个专为 LoRA、LyCORIS 和 Stable Diffusion 模型训练设计的本地优先 Web 应用程序，旨在简化**数据集打标（Captioning）**流程。
与仅输出关键词的传统打标器（如 WD14）不同，TagMaster 利用 GPT-4o、Gemini 1.5、DeepSeek 等现代视觉语言模型 (VLM)，生成详尽的自然语言描述或高质量标签列表。这对于训练 SDXL、Pony 和 Flux 等新一代模型至关重要。
✨ Key Features / 核心功能
🤖 Multi-Model AI Support / 多模型 AI 支持
Cloud VLMs: Native support for OpenAI (GPT-4o), Google Gemini, DeepSeek (Janus/Chat), Qwen (通义千问), Grok, and Tencent Hunyuan.
Local LLMs: Fully compatible with LM Studio and Ollama for completely offline, privacy-secure tagging.
Custom Prompts: Pre-set templates for Character (Consistency), Style (Art Style), and Quality. Fully customizable system prompts to switch between Booru-style tags and Natural Language captions.
云端 VLM: 原生支持 OpenAI、Google Gemini、DeepSeek、通义千问、Grok 和腾讯混元。
本地 LLM: 完美兼容 LM Studio 和 Ollama，支持完全离线的隐私打标。
自定义提示词: 内置人物一致性、画风迁移、质量增强等模版。支持自定义系统提示词，可随意切换 Booru 风格标签或自然语言描述。
📂 Native Local Sync / 原生本地同步
Direct File System Access: Uses the browser's File System Access API to bind directly to your dataset folder.
Auto-Save: Generated .txt caption files are written directly to your hard drive. No more downloading zip files.
Two-Way Sync: Automatically detects and loads existing captions for review.
直接读写: 利用文件系统访问 API 直接绑定本地数据集文件夹。
自动保存: 生成的 .txt 标签文件直接写入硬盘，无需下载压缩包。
双向同步: 自动识别并加载文件夹内现有的标签文件以便审查。
🛡️ Robust Batch Processing / 稳健的批量处理
Circuit Breaker: Automatically halts batch tasks upon detecting fatal errors (Auth failures) or excessive timeouts to protect your API quota.
Smart Retry: Configurable retry logic for network jitter.
熔断机制: 检测到严重错误（如鉴权失败）或连续超时时自动暂停批量任务，保护您的 API 额度。
智能重试: 针对网络抖动提供可配置的重试逻辑。
🛠️ Dataset Management Tools / 数据集管理工具
Batch Rename: Rename images sequentially (e.g., my_lora_001.png) while keeping files synced on disk.
Batch Tag Editor: Bulk Add (Trigger Words), Remove, or Replace specific tags across the entire dataset.
Stats Dashboard: Visualize tag frequency to ensure dataset balance.
批量重命名: 按序重命名图片（如 my_lora_001.png），并同步更新本地文件。
批量标签编辑: 批量添加（触发词）、移除或替换整个数据集中的特定标签。
统计仪表盘: 可视化标签频率，确保数据集平衡。
🚀 Installation / 安装教程
TagMaster is a static web application. You can run it locally using Node.js.
TagMaster 是一个静态网页应用，您可以使用 Node.js 在本地运行。
Prerequisites / 前置要求
Node.js (v16 or higher)
Steps / 步骤
Clone the repository / 克隆仓库
git clone [https://github.com/your-username/tagmaster.git](https://github.com/your-username/tagmaster.git)
cd tagmaster


Install dependencies / 安装依赖
npm install
# or / 或
yarn install


Start the app / 启动应用
npm run dev


Access in browser / 在浏览器访问
Open http://localhost:5173 (or the URL shown in your terminal).
打开 http://localhost:5173（或终端显示的地址）。
📖 User Guide / 使用指南
1. Configuration / 设置模型
Click Settings (系统设置).
Select your Provider (e.g., OpenAI, Gemini).
Enter your API Key and Base URL (if using a proxy).
Click "Test Connection" to verify.
(Optional) Choose a Prompt Template. For SDXL training, "Natural Language" is often preferred. For Pony/Anime, "Booru Tags" is better.
2. Connect Local Folder / 连接本地文件夹 (Recommended)
In Settings -> Export Settings, click "Select Output Folder".
Select the folder containing your dataset images.
Grant permission when prompted by the browser.
Why? This enables auto-saving .txt files directly next to your images.
3. Workflow / 工作流
Import: Drag & drop images into the grid.
Tag: Select images (or Ctrl+A) and click "Start Tagging".
Review: Double-click an image to enter Focus View. Edit the text manually if needed.
Batch Edit: Use "Batch Tools" to inject your Trigger Word (e.g., sks girl) to the beginning of all captions.
Rename: Use "Batch Rename" to standardize filenames before training.
🏗️ Tech Stack / 技术栈
Frontend: React 18, Vite
UI Framework: Tailwind CSS
Icons: Lucide React
Storage: IndexedDB (State persistence), File System Access API (Local I/O)
📄 License
MIT License. Open source and free for the community.
