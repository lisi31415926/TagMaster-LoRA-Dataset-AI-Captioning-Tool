import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Settings, Upload, Image as ImageIcon, FileText, 
  Play, Save, Trash2, ZoomIn, Grid, List, 
  CheckCircle, AlertCircle, Loader2, X, 
  ChevronLeft, ChevronRight, Download, Edit3, MoreHorizontal,
  Monitor, Globe, Database, RefreshCw, ArrowUpDown, Calendar, ArrowUpAZ, ArrowDownAZ,
  Server, Cpu, Copy, Clock, Activity, SlidersHorizontal, Tag, Plus, Minus, Replace,
  Square, Terminal, TriangleAlert, BarChart3, Search, Filter, Palette, User, Sparkles, PenTool,
  WifiOff, ShieldAlert, FolderOpen, Check
} from 'lucide-react';

const API_PRESETS = {
  openai: {
    name: "OpenAI (官方)",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o"
  },
  gemini: {
    name: "Google Gemini (OpenAI兼容)",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.0-flash"
  },
  deepseek: {
    name: "DeepSeek (深度求索)",
    baseUrl: "https://api.deepseek.com/v1",
    model: "deepseek-chat"
  },
  qwen: {
    name: "Qwen (阿里通义千问)",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    model: "qwen-vl-max"
  },
  grok: {
    name: "xAI Grok",
    baseUrl: "https://api.x.ai/v1",
    model: "grok-vision-beta"
  },
  hunyuan: {
    name: "Tencent Hunyuan (混元)",
    baseUrl: "https://api.hunyuan.cloud.tencent.com/v1",
    model: "hunyuan-vision"
  },
  lmstudio: {
    name: "Local (LM Studio)",
    baseUrl: "http://localhost:1234/v1",
    model: "local-model"
  },
  ollama: {
    name: "Local (Ollama)",
    baseUrl: "http://localhost:11434/v1",
    model: "llava"
  },
  custom: {
    name: "Custom (自定义)",
    baseUrl: "",
    model: ""
  }
};

const PROMPT_TEMPLATES = {
  character: "Describe the character in this image in extreme detail, focusing on physical appearance, facial features, hair style and color, eye color, clothing details, accessories, and pose. Ensure character consistency features are highlighted. Use comma-separated tags.",
  style: "Analyze the art style, medium, technique, rendering style, and visual atmosphere of this image. Focus on keywords that describe the artistic style (e.g., oil painting, anime, sketch, watercolor, lighting, composition) for style transfer training. Do not focus too much on the character content.",
  quality: "Describe the image content with a focus on high quality, detailed textures, lighting, and composition. Include quality boosting tags such as 'masterpiece', 'best quality', 'highly detailed', '8k', 'cinematic lighting', 'intricate details'.",
  custom: ""
};

const translations = {
  zh: {
    appTitle: "TagMaster - LoRA 打标助手",
    pro: "Pro",
    sectionFile: "文件操作",
    btnImport: "导入图片",
    btnRename: "批量重名",
    btnDelete: "删除选中",
    btnResetDB: "清空所有数据",
    sectionAI: "AI 智能标注",
    labelSelected: (count) => `选中 ${count} 张图片`,
    labelAll: "所有图片",
    btnTagging: "开始生成标签",
    btnStopTagging: "停止任务",
    btnTaggingProgress: (cur, total) => `执行中 ${cur}/${total}`,
    sectionExport: "导出",
    btnDownload: "下载标签 (.txt)",
    tipDownload: "* 标签文件将以图片同名txt格式下载。",
    sectionTools: "批量工具",
    btnBatchTags: "批量修改标签",
    btnTagStats: "数据集统计",
    btnSettings: "系统设置",
    modalSettingsTitle: "设置",
    groupApi: "模型服务设置",
    labelProvider: "服务提供商",
    labelApiKey: "API Key",
    labelBaseUrl: "API Endpoint",
    labelModel: "模型名称",
    helpBaseUrl: "API 请求基础地址，通常以 /v1 结尾",
    btnTestApi: "测试连接",
    msgApiTesting: "正在测试...",
    msgApiOk: "连接成功！",
    msgApiErr: "连接失败: ",
    groupPrompt: "打标提示词 (Prompt)",
    labelPromptTemplate: "预设模版",
    tplCharacter: "人物一致性",
    tplStyle: "风格迁移",
    tplQuality: "图像增强",
    tplCustom: "自定义 / 上次",
    groupStrategy: "写入策略",
    strategyOverwrite: "覆盖",
    strategyAppend: "追加到末尾",
    strategyPrepend: "添加到开头",
    groupNetwork: "网络与熔断",
    labelRetryCount: "单图失败重试次数",
    labelRetryDelay: "重试间隔 (毫秒)",
    labelMaxConsecutiveErrors: "熔断阈值 (连续失败次数)",
    labelTimeout: "请求超时 (秒)",
    groupTokens: "Token 与 上下文设置",
    labelMaxOutputTokens: "最大返回 Token (Response)",
    labelImageDetail: "图片发送精度 (Detail)",
    detailAuto: "自动 (Auto)",
    detailLow: "低 (Low - 省Token)",
    detailHigh: "高 (High)",
    helpTokens: "控制 API 的返回长度和图片上传精度 (影响发送 Token 消耗)。",
    groupExport: "导出设置",
    btnSelectFolder: "选择保存目录",
    labelCurrentFolder: "当前目录: ",
    tipFolder: "设置目录后，工具将自动同步该目录下的txt标签，重命名也会自动保存图片到该目录。",
    btnSaveSettings: "保存设置",
    modalRenameTitle: "批量重命名",
    tipRename: "使用 ### 作为数字占位符。例如: ",
    labelTemplate: "命名模版",
    btnCancel: "取消",
    btnConfirmRename: "确认重命名",
    modalBatchTagTitle: "批量标签管理",
    tabAdd: "添加",
    tabRemove: "移除",
    tabReplace: "替换",
    labelTagContent: "标签内容",
    labelPosition: "位置",
    posStart: "开头 (Trigger Word)",
    posEnd: "末尾",
    btnExecute: "执行操作",
    labelFind: "查找标签",
    labelReplaceWith: "替换为",
    dragDrop: "拖拽图片到这里 或 点击左侧“导入图片”",
    statusTagged: "已打标",
    statusNoTag: "未打标",
    statusProcessing: "AI 正在思考...",
    btnReturnGrid: "返回网格",
    labelEdit: "标签编辑",
    placeholderEditor: "等待打标或手动输入...",
    btnRetagSingle: "单张重新打标",
    btnClear: "清空",
    btnSaveSingle: "保存此文件",
    labelSort: "排序",
    sortNameAsc: "名称 (A-Z)",
    sortNameDesc: "名称 (Z-A)",
    sortDateNew: "日期 (最新)",
    sortDateOld: "日期 (最早)",
    labelGridSize: "网格大小",
    labelApiLogs: "API 调试日志",
    alertApiKey: "请先在设置中配置 API Key",
    alertSelect: "请至少选择一张图片进行打标",
    alertDownload: (count) => `即将下载 ${count} 个文件。浏览器可能会拦截弹窗。确定吗？`,
    alertClearDB: "确定要清空所有图片和数据吗？此操作无法撤销。",
    statusInfo: (total, selected) => `共 ${total} 张图片 | 已选中 ${selected}`,
    btnSelectAll: "全选",
    btnDeselect: "取消选择",
    chars: "字符",
    loadingData: "正在恢复上次的工作...",
    tipShortcuts: "快捷键: ← → 切换图片, Ctrl+Enter 打标",
    fatalErrorTitle: "任务熔断中止",
    fatalErrorDesc: "检测到 API 返回严重错误、网络中断或连续失败次数过多。为保护您的额度，批量任务已自动停止。",
    btnClose: "关闭",
    modalStatsTitle: "数据集标签统计",
    labelSearch: "搜索标签或文件名...",
    statsTotalTags: "标签总数 (去重)",
    statsAvgTags: "平均每张标签数",
    confirmOverwrite: "确定要覆盖本地文件夹中的文件吗？\n文件: "
  },
  en: {
    appTitle: "TagMaster - LoRA Tagger",
    pro: "Pro",
    sectionFile: "FILE OPERATIONS",
    btnImport: "Import Images",
    btnRename: "Batch Rename",
    btnDelete: "Delete Selected",
    btnResetDB: "Clear All Data",
    sectionAI: "AI AUTO TAGGING",
    labelSelected: (count) => `${count} Selected`,
    labelAll: "All Images",
    btnTagging: "Start Tagging",
    btnStopTagging: "Stop Task",
    btnTaggingProgress: (cur, total) => `Processing ${cur}/${total}`,
    sectionExport: "EXPORT",
    btnDownload: "Download Tags (.txt)",
    tipDownload: "* Tag files will be downloaded as .txt.",
    sectionTools: "BATCH TOOLS",
    btnBatchTags: "Batch Edit Tags",
    btnTagStats: "Dataset Statistics",
    btnSettings: "Settings",
    modalSettingsTitle: "Settings",
    groupApi: "Model Service Settings",
    labelProvider: "Provider",
    labelApiKey: "API Key",
    labelBaseUrl: "API Endpoint",
    labelModel: "Model Name",
    helpBaseUrl: "Base URL, usually ends with /v1",
    btnTestApi: "Test Connection",
    msgApiTesting: "Testing...",
    msgApiOk: "Connected!",
    msgApiErr: "Failed: ",
    groupPrompt: "System Prompt",
    labelPromptTemplate: "Template",
    tplCharacter: "Character",
    tplStyle: "Style",
    tplQuality: "Quality",
    tplCustom: "Custom / Saved",
    groupStrategy: "Write Strategy",
    strategyOverwrite: "Overwrite",
    strategyAppend: "Append",
    strategyPrepend: "Prepend",
    groupNetwork: "Network & Circuit Breaker",
    labelRetryCount: "Max Retries (Per Image)",
    labelRetryDelay: "Retry Delay (ms)",
    labelMaxConsecutiveErrors: "Circuit Breaker (Max Errors)",
    labelTimeout: "Timeout (Seconds)",
    groupTokens: "Token Settings",
    labelMaxOutputTokens: "Max Return Tokens (Output)",
    labelImageDetail: "Image Send Detail (Input)",
    detailAuto: "Auto",
    detailLow: "Low (Save Tokens)",
    detailHigh: "High",
    helpTokens: "Controls API response length and image upload precision.",
    groupExport: "Export Settings",
    btnSelectFolder: "Select Output Folder",
    labelCurrentFolder: "Current Folder: ",
    tipFolder: "Auto-sync tags from folder & save renamed images directly to disk.",
    btnSaveSettings: "Save Settings",
    modalRenameTitle: "Batch Rename",
    tipRename: "Use ### as placeholder. E.g.: ",
    labelTemplate: "Name Template",
    btnCancel: "Cancel",
    btnConfirmRename: "Confirm",
    modalBatchTagTitle: "Batch Tag Manager",
    tabAdd: "Add",
    tabRemove: "Remove",
    tabReplace: "Replace",
    labelTagContent: "Tag Content",
    labelPosition: "Position",
    posStart: "Start (Trigger Word)",
    posEnd: "End",
    btnExecute: "Execute",
    labelFind: "Find Tag",
    labelReplaceWith: "Replace With",
    dragDrop: "Drag images here or click 'Import Images'",
    statusTagged: "TAGGED",
    statusNoTag: "NO TAG",
    statusProcessing: "AI is thinking...",
    btnReturnGrid: "Back to Grid",
    labelEdit: "Tag Editor",
    placeholderEditor: "Waiting for tags...",
    btnRetagSingle: "Re-tag Single",
    btnClear: "Clear",
    btnSaveSingle: "Save File",
    labelSort: "Sort By",
    sortNameAsc: "Name (A-Z)",
    sortNameDesc: "Name (Z-A)",
    sortDateNew: "Date (Newest)",
    sortDateOld: "Date (Oldest)",
    labelGridSize: "Grid Size",
    labelApiLogs: "API Debug Logs",
    alertApiKey: "Please configure API Key settings.",
    alertSelect: "Select at least one image.",
    alertDownload: (count) => `About to download ${count} files. Continue?`,
    alertClearDB: "Clear all data? Cannot be undone.",
    statusInfo: (total, selected) => `Total ${total} | Selected ${selected}`,
    btnSelectAll: "Select All",
    btnDeselect: "Deselect",
    chars: "chars",
    loadingData: "Restoring session...",
    tipShortcuts: "Shortcuts: ← → Navigate, Ctrl+Enter Tag",
    fatalErrorTitle: "Task Halted (Circuit Breaker)",
    fatalErrorDesc: "Critical API error, network failure, or too many consecutive errors detected. Task halted.",
    btnClose: "Close",
    modalStatsTitle: "Dataset Tag Statistics",
    labelSearch: "Search tags or filenames...",
    statsTotalTags: "Total Unique Tags",
    statsAvgTags: "Avg Tags/Image",
    confirmOverwrite: "Confirm overwrite file in local folder?\nFile: "
  }
};

const DB_NAME = 'TagMasterDB_v3';
const STORE_NAME = 'images';
const HANDLE_STORE_NAME = 'handles';

const dbService = {
  open: () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 3);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(HANDLE_STORE_NAME)) {
          db.createObjectStore(HANDLE_STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },
  getAll: async () => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  addOrUpdate: async (item) => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  delete: async (id) => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  clear: async () => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  saveHandle: async (handle) => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(HANDLE_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(HANDLE_STORE_NAME);
      const request = store.put({ id: 'outputDir', handle: handle, name: handle.name });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  getHandle: async () => {
    const db = await dbService.open();
    return new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains(HANDLE_STORE_NAME)) {
          resolve(null);
          return;
      }
      const transaction = db.transaction(HANDLE_STORE_NAME, 'readonly');
      const store = transaction.objectStore(HANDLE_STORE_NAME);
      const request = store.get('outputDir');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const getImageDimensions = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon, title }) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      title={title} 
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon size={18} className={children ? "mr-2" : ""} />}
      {children}
    </button>
  );
};

const InputGroup = ({ label, value, onChange, type = "text", placeholder, helpText, min }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <input 
      type={type} 
      value={value}
      min={min} 
      onChange={(e) => onChange(e.target.value)} 
      className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
      placeholder={placeholder} 
    />
    {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
  </div>
);

const Sidebar = ({ t, fileInputRef, handleFileUpload, setRenameModalOpen, setBatchTagModalOpen, setStatsModalOpen, handleDelete, selectedIds, handleClearDB, isProcessing, images, runAITagging, stopTagging, progress, downloadTextFiles, setIsSettingsOpen, lang, setLang }) => (
  <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-y-auto shrink-0 z-30">
    <div className="p-4 border-b border-gray-800">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <ImageIcon className="text-blue-500" /> TagMaster <span className="text-xs bg-blue-900 text-blue-300 px-1 rounded">{t.pro}</span>
      </h1>
    </div>

    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.sectionFile}</label>
        <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
        <Button onClick={() => fileInputRef.current?.click()} className="w-full" icon={Upload}>
          {t.btnImport}
        </Button>
        <div className="grid grid-cols-2 gap-2">
           <Button variant="secondary" className="w-full text-sm" onClick={() => setRenameModalOpen(true)}>
             {t.btnRename}
           </Button>
           <Button variant="danger" className="w-full text-sm" onClick={handleDelete} disabled={selectedIds.size === 0}>
             {t.btnDelete}
           </Button>
        </div>
        <Button variant="ghost" className="w-full text-sm text-gray-500 hover:text-red-400 mt-2" onClick={handleClearDB} icon={Trash2}>
          {t.btnResetDB}
        </Button>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.sectionAI}</label>
        <div className="bg-gray-800 p-3 rounded text-sm text-gray-400">
          {selectedIds.size === 0 ? t.labelAll : t.labelSelected(selectedIds.size)}
        </div>
        
        {isProcessing ? (
          <Button 
            onClick={stopTagging} 
            className="w-full animate-pulse bg-red-900/50 hover:bg-red-900 border border-red-500" 
            variant="danger" 
            icon={Square}
          >
            {t.btnStopTagging} ({progress.current}/{progress.total})
          </Button>
        ) : (
          <Button 
            onClick={runAITagging} 
            disabled={images.length === 0} 
            className="w-full" 
            variant="success" 
            icon={Play}
          >
            {t.btnTagging}
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.sectionTools}</label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" className="w-full text-sm" icon={Tag} onClick={() => setBatchTagModalOpen(true)} disabled={images.length === 0}>
             {t.btnBatchTags}
          </Button>
          <Button variant="secondary" className="w-full text-sm" icon={BarChart3} onClick={() => setStatsModalOpen(true)} disabled={images.length === 0}>
             {t.btnTagStats}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.sectionExport}</label>
        <Button variant="secondary" className="w-full" icon={Save} onClick={downloadTextFiles}>
          {t.btnDownload}
        </Button>
        <p className="text-xs text-gray-600">{t.tipDownload}</p>
      </div>
    </div>

    <div className="mt-auto p-4 border-t border-gray-800 flex items-center gap-2">
      <button 
        onClick={() => setIsSettingsOpen(true)} 
        className="flex-1 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white py-2 rounded transition-colors" 
        title={t.btnSettings}
      >
        <Settings size={18} className="mr-2" /> <span className="text-sm">{t.btnSettings}</span>
      </button>
      <button 
        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} 
        className="w-10 h-full flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded py-2 transition-colors font-bold text-xs"
      >
        {lang === 'zh' ? 'En' : '中'}
      </button>
    </div>
  </div>
);

const SettingsModal = ({ t, settings, setSettings, setIsSettingsOpen, handleTestApi, handleSelectFolder, outputDirName }) => {
  const activeTab = settings.activeTemplateId || 'custom';
  const [testStatus, setTestStatus] = useState('idle');
  const [testMsg, setTestMsg] = useState('');

  const onTestClick = async () => {
    setTestStatus('testing');
    setTestMsg(t.msgApiTesting);
    try {
      await handleTestApi();
      setTestStatus('success');
      setTestMsg(t.msgApiOk);
    } catch (e) {
      setTestStatus('error');
      setTestMsg(t.msgApiErr + e.message);
    }
  };

  const handleTemplateClick = (type) => {
    if (type === 'custom') {
      setSettings({
        ...settings,
        systemPrompt: settings.savedCustomPrompt || '',
        activeTemplateId: 'custom'
      });
    } else {
      const updates = {
        activeTemplateId: type,
        systemPrompt: PROMPT_TEMPLATES[type]
      };
      
      if (settings.activeTemplateId === 'custom') {
        updates.savedCustomPrompt = settings.systemPrompt;
      }
      
      setSettings({ ...settings, ...updates });
    }
  };

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    let updates = { provider: newProvider };

    if (newProvider === 'custom') {
      updates.baseUrl = settings.savedCustomApi?.baseUrl || '';
      updates.model = settings.savedCustomApi?.model || '';
    } else {
      if (settings.provider === 'custom') {
        updates.savedCustomApi = { baseUrl: settings.baseUrl, model: settings.model };
      }
      const preset = API_PRESETS[newProvider];
      updates.baseUrl = preset.baseUrl;
      updates.model = preset.model;
    }
    setSettings({ ...settings, ...updates });
  };

  const handleInputChange = (field, value) => {
    const updates = { [field]: value };
    if (settings.provider === 'custom') {
       updates.savedCustomApi = { 
         ...settings.savedCustomApi, 
         [field]: value,
         baseUrl: field === 'baseUrl' ? value : (settings.savedCustomApi?.baseUrl || settings.baseUrl),
         model: field === 'model' ? value : (settings.savedCustomApi?.model || settings.model)
       };
    }
    setSettings({ ...settings, ...updates });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-white">{t.modalSettingsTitle}</h2>
          <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase">{t.groupApi}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">{t.labelProvider}</label>
              <select 
                value={settings.provider}
                onChange={handleProviderChange}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.entries(API_PRESETS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>
            <InputGroup 
                label={t.labelApiKey} 
                type="password" 
                value={settings.apiKey} 
                onChange={v => setSettings({...settings, apiKey: v})} 
                placeholder="sk-..." 
            />
            <div className="flex gap-2 items-start">
               <div className="flex-1">
                 <InputGroup 
                    label={t.labelBaseUrl} 
                    value={settings.baseUrl} 
                    onChange={v => handleInputChange('baseUrl', v)} 
                    placeholder="https://api.openai.com/v1" 
                    helpText={t.helpBaseUrl} 
                 />
               </div>
               <div className="mt-6">
                 <Button variant="secondary" onClick={onTestClick} disabled={testStatus === 'testing'}>
                   {testStatus === 'testing' ? <Loader2 className="animate-spin" size={16}/> : <RefreshCw size={16}/>}
                 </Button>
               </div>
            </div>
            {testStatus !== 'idle' && (
                <div className={`text-xs px-2 py-1 rounded border ${testStatus === 'success' ? 'bg-green-900/30 border-green-800 text-green-300' : testStatus === 'error' ? 'bg-red-900/30 border-red-800 text-red-300' : 'bg-gray-800 border-gray-700 text-gray-300'}`}>
                   {testMsg}
                </div>
            )}

            <InputGroup 
                label={t.labelModel} 
                value={settings.model} 
                onChange={v => handleInputChange('model', v)} 
                placeholder="gpt-4o" 
            />
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase">{t.groupNetwork}</h3>
            <div className="grid grid-cols-2 gap-4">
               <InputGroup label={t.labelRetryCount} type="number" value={settings.retryCount} onChange={v => setSettings({...settings, retryCount: parseInt(v) || 0})} placeholder="3" />
               <InputGroup label={t.labelRetryDelay} type="number" value={settings.retryDelay} onChange={v => setSettings({...settings, retryDelay: parseInt(v) || 1000})} placeholder="1000" />
               <InputGroup label={t.labelMaxConsecutiveErrors} type="number" value={settings.maxConsecutiveErrors} onChange={v => setSettings({...settings, maxConsecutiveErrors: parseInt(v) || 3})} placeholder="3" />
               <InputGroup label={t.labelTimeout} type="number" value={settings.timeout} onChange={v => setSettings({...settings, timeout: parseInt(v) || 60})} placeholder="60" />
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase">{t.groupTokens}</h3>
            <div className="grid grid-cols-2 gap-4">
                <InputGroup 
                    label={t.labelMaxOutputTokens} 
                    type="number" 
                    value={settings.maxOutputTokens} 
                    onChange={v => setSettings({...settings, maxOutputTokens: parseInt(v) || 4096})} 
                    placeholder="4096" 
                />
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t.labelImageDetail}</label>
                    <select 
                        value={settings.imageDetail} 
                        onChange={(e) => setSettings({...settings, imageDetail: e.target.value})}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="auto">{t.detailAuto}</option>
                        <option value="low">{t.detailLow}</option>
                        <option value="high">{t.detailHigh}</option>
                    </select>
                </div>
            </div>
            <p className="text-xs text-gray-500">{t.helpTokens}</p>
          </div>
          
          <div className="border-t border-gray-800 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase">{t.groupExport}</h3>
             <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-sm text-gray-300 font-medium flex items-center gap-2">
                     <FolderOpen size={16} className="text-yellow-500"/>
                     {outputDirName ? (
                         <span>{t.labelCurrentFolder} <span className="text-white font-mono bg-gray-700 px-1 rounded">{outputDirName}</span></span>
                     ) : (
                         <span className="text-gray-500">No folder selected</span>
                     )}
                   </span>
                   <Button variant="secondary" className="text-xs py-1 h-8" onClick={handleSelectFolder}>
                      {t.btnSelectFolder}
                   </Button>
                </div>
                <p className="text-[10px] text-gray-500">{t.tipFolder}</p>
             </div>
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-4 flex flex-col">
            <h3 className="text-sm font-semibold text-blue-400 uppercase mb-2">{t.groupPrompt}</h3>
            
            <div className="flex flex-wrap gap-2 mb-2">
              <button 
                onClick={() => handleTemplateClick('character')}
                className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'character' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                <User size={14}/> {t.tplCharacter}
              </button>
              <button 
                onClick={() => handleTemplateClick('style')}
                className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'style' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                <Palette size={14}/> {t.tplStyle}
              </button>
              <button 
                onClick={() => handleTemplateClick('quality')}
                className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'quality' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                <Sparkles size={14}/> {t.tplQuality}
              </button>
              <button 
                onClick={() => handleTemplateClick('custom')}
                className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${activeTab === 'custom' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                <PenTool size={14}/> {t.tplCustom}
              </button>
            </div>

            <textarea 
              value={settings.systemPrompt} 
              onChange={e => {
                setSettings({
                    ...settings, 
                    systemPrompt: e.target.value, 
                    activeTemplateId: 'custom',
                    savedCustomPrompt: e.target.value 
                });
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white min-h-[200px] text-sm focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed resize-y" 
              placeholder="Enter system prompt here..."
            />
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase">{t.groupStrategy}</h3>
            <div className="flex gap-4">
              {['overwrite', 'append', 'prepend'].map(mode => (
                <label key={mode} className="flex items-center space-x-2 cursor-pointer text-gray-300">
                  <input 
                    type="radio" 
                    checked={settings.appendMode === mode} 
                    onChange={() => setSettings({...settings, appendMode: mode})} 
                    className="form-radio text-blue-600" 
                  />
                  <span className="capitalize text-sm">
                    {mode === 'overwrite' ? t.strategyOverwrite : mode === 'append' ? t.strategyAppend : t.strategyPrepend}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end shrink-0">
          <Button onClick={() => setIsSettingsOpen(false)}>{t.btnSaveSettings}</Button>
        </div>
      </div>
    </div>
  );
};

const RenameModal = ({ t, renamePattern, setRenamePattern, setRenameModalOpen, handleRename }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div className="bg-gray-800 w-full max-w-md rounded-lg border border-gray-600 shadow-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">{t.modalRenameTitle}</h3>
      <p className="text-gray-400 text-sm mb-4">{t.tipRename} <code className="bg-gray-700 px-1 rounded">lora_img_###</code></p>
      <InputGroup label={t.labelTemplate} value={renamePattern} onChange={setRenamePattern} placeholder="image_###" />
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={() => setRenameModalOpen(false)}>{t.btnCancel}</Button>
        <Button onClick={handleRename}>{t.btnConfirmRename}</Button>
      </div>
    </div>
  </div>
);

const BatchTagModal = ({ t, setOpen, handleBatchOperation }) => {
  const [mode, setMode] = useState('add'); 
  const [tagInput, setTagInput] = useState('');
  const [replaceInput, setReplaceInput] = useState('');
  const [position, setPosition] = useState('start'); 

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-md rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Tag size={18}/> {t.modalBatchTagTitle}</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="p-4 bg-gray-800/50 flex gap-2 border-b border-gray-800">
          <button onClick={() => setMode('add')} className={`flex-1 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'add' ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}><Plus size={16}/> {t.tabAdd}</button>
          <button onClick={() => setMode('remove')} className={`flex-1 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'remove' ? 'bg-red-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}><Minus size={16}/> {t.tabRemove}</button>
          <button onClick={() => setMode('replace')} className={`flex-1 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 ${mode === 'replace' ? 'bg-yellow-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}><Replace size={16}/> {t.tabReplace}</button>
        </div>

        <div className="p-6 space-y-4">
          {mode === 'add' && (
            <div className="space-y-4">
              <InputGroup label={t.labelTagContent} value={tagInput} onChange={setTagInput} placeholder="e.g. best quality, masterpiece" />
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t.labelPosition}</label>
                <div className="flex gap-4">
                   <label className="flex items-center space-x-2 cursor-pointer text-gray-300">
                     <input type="radio" checked={position === 'start'} onChange={() => setPosition('start')} className="form-radio text-blue-600" />
                     <span className="text-sm">{t.posStart}</span>
                   </label>
                   <label className="flex items-center space-x-2 cursor-pointer text-gray-300">
                     <input type="radio" checked={position === 'end'} onChange={() => setPosition('end')} className="form-radio text-blue-600" />
                     <span className="text-sm">{t.posEnd}</span>
                   </label>
                </div>
              </div>
            </div>
          )}

          {mode === 'remove' && (
             <InputGroup label={t.labelFind} value={tagInput} onChange={setTagInput} placeholder="e.g. watermark" />
          )}

          {mode === 'replace' && (
            <>
             <InputGroup label={t.labelFind} value={tagInput} onChange={setTagInput} placeholder="e.g. dog" />
             <InputGroup label={t.labelReplaceWith} value={replaceInput} onChange={setReplaceInput} placeholder="e.g. puppy" />
            </>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>{t.btnCancel}</Button>
          <Button onClick={() => handleBatchOperation(mode, tagInput, replaceInput, position)} disabled={!tagInput}>{t.btnExecute}</Button>
        </div>
      </div>
    </div>
  );
};

const StatsModal = ({ t, images, setOpen, setSearchTerm }) => {
  const stats = useMemo(() => {
    const tagCounts = {};
    let totalTags = 0;
    images.forEach(img => {
      if (!img.caption) return;
      const tags = img.caption.split(',').map(s => s.trim()).filter(s => s);
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        totalTags++;
      });
    });
    
    const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    return {
      sorted: sorted.slice(0, 50), 
      uniqueCount: Object.keys(tagCounts).length,
      avgPerImage: images.length ? (totalTags / images.length).toFixed(1) : 0,
      maxCount: sorted.length ? sorted[0][1] : 0
    };
  }, [images]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-4xl rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><BarChart3 size={18}/> {t.modalStatsTitle}</h2>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
        </div>
        
        <div className="p-4 grid grid-cols-3 gap-4 border-b border-gray-800 bg-gray-800/30 shrink-0">
           <div className="text-center">
             <div className="text-2xl font-bold text-white">{stats.uniqueCount}</div>
             <div className="text-xs text-gray-400 uppercase tracking-wider">{t.statsTotalTags}</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-white">{stats.avgPerImage}</div>
             <div className="text-xs text-gray-400 uppercase tracking-wider">{t.statsAvgTags}</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-white">{images.length}</div>
             <div className="text-xs text-gray-400 uppercase tracking-wider">{t.labelAll}</div>
           </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {stats.sorted.map(([tag, count]) => (
               <button 
                 key={tag}
                 onClick={() => { setSearchTerm(tag); setOpen(false); }}
                 className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 transition-colors group text-left"
               >
                 <div className="flex-1 min-w-0">
                   <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-200 truncate group-hover:text-blue-400 font-medium" title={tag}>{tag}</span>
                     <span className="text-gray-500 text-xs">{count}</span>
                   </div>
                   <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-blue-600 rounded-full" 
                       style={{ width: `${(count / stats.maxCount) * 100}%` }}
                     ></div>
                   </div>
                 </div>
               </button>
             ))}
           </div>
        </div>
        
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end shrink-0">
          <Button onClick={() => setOpen(false)}>{t.btnClose}</Button>
        </div>
      </div>
    </div>
  );
};

const GridView = ({ isRestoring, displayedImages, t, selectedIds, handleSelect, setViewMode, setActiveImageId, handleFileUpload, gridCols }) => (
  <div className="flex-1 overflow-y-auto bg-gray-950 p-2">
    {isRestoring && (
      <div className="h-32 flex items-center justify-center text-blue-400 gap-2">
        <Loader2 className="animate-spin" /> {t.loadingData}
      </div>
    )}

    {!isRestoring && (
      <div 
        className="grid gap-2 content-start pb-32"
        style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFileUpload({ target: { files: e.dataTransfer.files } }); }}
      >
        {displayedImages.map(img => (
          <div 
            key={img.id} 
            id={`image-card-${img.id}`}
            onClick={(e) => handleSelect(img.id, e.ctrlKey || e.metaKey)}
            onDoubleClick={() => { handleSelect(img.id, false); setViewMode('focus'); setActiveImageId(img.id); }}
            className={`
              group relative w-full aspect-square bg-gray-900 rounded-md overflow-hidden border cursor-pointer transition-all hover:shadow-lg
              ${selectedIds.has(img.id) ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-800 hover:border-gray-600'}
            `}
          >
            <div className="w-full h-full bg-black relative flex items-center justify-center">
              {img.url ? (
                <img src={img.url} alt={img.name} loading="lazy" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="text-gray-700" size={32} /></div>
              )}
              
              {selectedIds.has(img.id) && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-md z-10">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
              
              {img.status === 'processing' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <Loader2 size={24} className="animate-spin text-blue-400" />
                </div>
              )}
              
              {img.status === 'error' && (
                <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center z-10">
                  <AlertCircle size={32} className="text-white" />
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col justify-end min-h-[35%] opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                <div className="flex justify-between items-end">
                    <div className="flex-1 min-w-0 mr-1">
                      <p className="text-[10px] text-white font-medium truncate leading-tight drop-shadow-md">{img.name}</p>
                      <p className="text-[9px] text-gray-300 font-mono truncate drop-shadow-md">{img.width}x{img.height}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {img.status === 'done' && <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>}
                      {img.caption && <div className="text-[8px] bg-white/20 px-1 rounded text-white backdrop-blur-sm">TXT</div>}
                    </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!isRestoring && displayedImages.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/50">
            <Upload size={32} className="mb-3 opacity-50" />
            <p className="text-sm font-medium">{t.dragDrop}</p>
          </div>
        )}
      </div>
    )}
  </div>
);

const FocusView = ({ images, activeImageId, setActiveImageId, displayedImages, t, setViewMode, handleUpdateCaption, handleSelect, runAITagging, stopTagging, isProcessing, handleSaveSingle }) => {
  const activeImg = images.find(img => img.id === activeImageId);
  const currentIndex = displayedImages.findIndex(i => i.id === activeImageId);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) setActiveImageId(displayedImages[prevIndex].id);
      }
      else if (e.key === 'ArrowRight') {
        const nextIndex = currentIndex + 1;
        if (nextIndex < displayedImages.length) setActiveImageId(displayedImages[nextIndex].id);
      }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
         if(activeImg && !isProcessing) {
            handleSelect(activeImg.id, false);
            setTimeout(runAITagging, 100);
         }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, displayedImages, setActiveImageId, activeImg, handleSelect, runAITagging, isProcessing]);

  if (!activeImg) return <div className="p-10 text-white">Select an image</div>;

  const navigate = (dir) => {
    const nextIndex = currentIndex + dir;
    if (nextIndex >= 0 && nextIndex < displayedImages.length) {
      setActiveImageId(displayedImages[nextIndex].id);
    }
  };

  return (
    <div className="flex h-full bg-gray-950 overflow-hidden">
      <div className="flex-1 flex flex-col relative min-h-0 bg-black/90 group">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
           <Button variant="secondary" onClick={() => setViewMode('grid')} icon={Grid} className="bg-black/50 backdrop-blur border border-white/10 hover:bg-black/70">
             {t.btnReturnGrid}
           </Button>
        </div>
        <div className="flex-1 w-full h-full flex items-center justify-center p-4 min-h-0">
           <img src={activeImg.url} className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl rounded-sm" alt="preview" />
        </div>
        
        <button 
          onClick={() => navigate(-1)} 
          disabled={currentIndex <= 0} 
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-blue-600/80 disabled:opacity-0 transition-all z-10 opacity-0 group-hover:opacity-100 backdrop-blur"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={() => navigate(1)} 
          disabled={currentIndex >= displayedImages.length - 1} 
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 text-white hover:bg-blue-600/80 disabled:opacity-0 transition-all z-10 opacity-0 group-hover:opacity-100 backdrop-blur"
        >
          <ChevronRight size={32} />
        </button>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-2 rounded-full text-white text-sm backdrop-blur flex items-center gap-4 border border-white/10 shadow-lg">
           <span className="font-semibold">{activeImg.name}</span>
           <span className="w-px h-3 bg-white/30"></span>
           <span className="flex items-center text-gray-300 gap-1 text-xs font-mono">
             <Monitor size={12} /> {activeImg.width || '?'} x {activeImg.height || '?'} px
           </span>
           <span className="w-px h-3 bg-white/30"></span>
           <span className="text-gray-400 text-xs">{currentIndex + 1} / {displayedImages.length}</span>
        </div>
      </div>

      <div className="w-96 bg-gray-900 border-l border-gray-800 flex flex-col p-6 overflow-y-auto shrink-0 z-20 shadow-xl">
         <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
           {t.labelEdit}
           <span className={`text-xs px-2 py-0.5 rounded ${activeImg.status === 'done' ? 'bg-green-900 text-green-400' : 'bg-gray-800'}`}>
             {activeImg.status.toUpperCase()}
           </span>
         </h3>
         
         {activeImg.status === 'processing' && (
            <div className="mb-2 p-2 bg-blue-900/30 border border-blue-800 rounded text-blue-300 text-xs flex items-center gap-2 animate-pulse">
              <Loader2 size={12} className="animate-spin" /> {t.statusProcessing}
            </div>
         )}

         <div className="flex-1 flex flex-col gap-4">
           <div className="relative flex-1 min-h-[300px]">
             <textarea 
               value={activeImg.caption || ''}
               onChange={(e) => handleUpdateCaption(activeImg.id, e.target.value)}
               className="w-full h-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 leading-relaxed focus:ring-2 focus:ring-blue-500 outline-none resize-none font-sans text-sm"
               placeholder={t.placeholderEditor}
             />
             <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-gray-800/80 px-2 rounded">
               {(activeImg.caption || '').length} {t.chars}
             </div>
           </div>
           
           <div className="space-y-2">
              {isProcessing ? (
                <Button 
                  onClick={stopTagging} 
                  className="w-full animate-pulse bg-red-900/50 hover:bg-red-900 border border-red-500" 
                  variant="danger" 
                  icon={Square}
                >
                  {t.btnStopTagging}
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  className="w-full" 
                  icon={Play} 
                  onClick={() => { handleSelect(activeImg.id, false); setTimeout(runAITagging, 100); }}
                >
                  {t.btnRetagSingle}
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => handleUpdateCaption(activeImg.id, '')} icon={Trash2} className="text-xs">{t.btnClear}</Button>
                <Button variant="secondary" icon={Save} className="text-xs" onClick={() => handleSaveSingle(activeImg)}>
                  {t.btnSaveSingle}
                </Button>
              </div>
              <p className="text-xs text-gray-600 text-center pt-2">{t.tipShortcuts}</p>
           </div>

           <div className="border-t border-gray-800 pt-4 mt-2">
             <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1"><Terminal size={12}/> {t.labelApiLogs}</h4>
             <div className="bg-black/50 p-2 rounded text-[10px] font-mono text-gray-400 h-24 overflow-y-auto break-all border border-gray-800">
               {activeImg.log || 'No logs available.'}
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default function LoRA_TagMaster() {
  const [images, setImages] = useState([]);
  const [isRestoring, setIsRestoring] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeImageId, setActiveImageId] = useState(null);
  const [sortOption, setSortOption] = useState('nameAsc');
  const [batchTagModalOpen, setBatchTagModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [fatalError, setFatalError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [outputDirHandle, setOutputDirHandle] = useState(null);

  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      provider: 'openai', 
      apiKey: '', 
      baseUrl: 'https://api.openai.com/v1', 
      model: 'gpt-4o', 
      systemPrompt: 'Describe this image in detail for LoRA training. Use comma separated tags or natural language depending on preference.',
      appendMode: 'overwrite',
      retryCount: 3,
      retryDelay: 2000,
      maxConsecutiveErrors: 3,
      timeout: 60,
      maxOutputTokens: 4096,
      imageDetail: 'auto',
      activeTemplateId: 'custom',
      savedCustomPrompt: '',
      savedCustomApi: { baseUrl: '', model: '' }
    };
    try {
      const saved = localStorage.getItem('tagmaster_settings_v2');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [renamePattern, setRenamePattern] = useState(() => localStorage.getItem('tagmaster_renamePattern') || 'image_###');
  const [gridCols, setGridCols] = useState(() => parseInt(localStorage.getItem('tagmaster_gridCols')) || 6);
  const [lang, setLang] = useState(() => localStorage.getItem('tagmaster_lang') || 'zh');
  
  const stopProcessing = useRef(false);
  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);
  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('tagmaster_settings_v2', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('tagmaster_renamePattern', renamePattern);
  }, [renamePattern]);

  useEffect(() => {
    localStorage.setItem('tagmaster_gridCols', gridCols);
  }, [gridCols]);

  useEffect(() => {
    localStorage.setItem('tagmaster_lang', lang);
  }, [lang]);

  const syncTagsFromFolder = async (handle, currentImages) => {
    if (!handle || currentImages.length === 0) return;
    
    try {
        const txtEntries = new Map();
        for await (const entry of handle.values()) {
            if (entry.kind === 'file' && entry.name.endsWith('.txt')) {
                const file = await entry.getFile();
                const text = await file.text();
                const baseName = entry.name.substring(0, entry.name.lastIndexOf('.'));
                txtEntries.set(baseName, text);
            }
        }

        let hasUpdates = false;
        const updatedImages = currentImages.map(img => {
            const baseName = img.name.substring(0, img.name.lastIndexOf('.'));
            if (txtEntries.has(baseName)) {
                const newCaption = txtEntries.get(baseName);
                if (img.caption !== newCaption) {
                    hasUpdates = true;
                    const updatedImg = { ...img, caption: newCaption, status: 'done', log: 'Synced from local folder' };
                    // Async DB update
                    const { url, ...dbItem } = updatedImg;
                    dbService.addOrUpdate(dbItem);
                    return updatedImg;
                }
            }
            return img;
        });

        if (hasUpdates) {
            setImages(updatedImages);
        }
    } catch (err) {
        console.error("Failed to sync tags:", err);
    }
  };

  useEffect(() => {
    const restoreData = async () => {
      try {
        const storedImages = await dbService.getAll();
        let restoredImages = [];
        if (storedImages && storedImages.length > 0) {
          restoredImages = storedImages.map(img => {
            if (!img.file) return null;
            return { ...img, url: URL.createObjectURL(img.file) };
          }).filter(Boolean);
          setImages(restoredImages);
        }
        
        const result = await dbService.getHandle();
        if (result && result.handle) {
            setOutputDirHandle(result.handle);
            // Attempt to sync after restore if handle and images exist
            if (restoredImages.length > 0) {
                await syncTagsFromFolder(result.handle, restoredImages);
            }
        }
      } catch (err) {
        console.error("Restoration failed", err);
      } finally {
        setIsRestoring(false);
      }
    };
    restoreData();
  }, []);

  useEffect(() => {
    if (viewMode === 'grid' && activeImageId) {
      setTimeout(() => {
        const el = document.getElementById(`image-card-${activeImageId}`);
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
      }, 50);
    }
  }, [viewMode, activeImageId]);

  const displayedImages = useMemo(() => {
    let result = [...images];
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(img => 
        (img.name && img.name.toLowerCase().includes(lowerSearch)) || 
        (img.caption && img.caption.toLowerCase().includes(lowerSearch))
      );
    }

    return result.sort((a, b) => {
      switch (sortOption) {
        case 'nameAsc': return a.name.localeCompare(b.name, undefined, {numeric: true, sensitivity: 'base'});
        case 'nameDesc': return b.name.localeCompare(a.name, undefined, {numeric: true, sensitivity: 'base'});
        case 'dateNew': return (b.lastModified || 0) - (a.lastModified || 0);
        case 'dateOld': return (a.lastModified || 0) - (b.lastModified || 0);
        default: return 0;
      }
    });
  }, [images, sortOption, searchTerm]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const newImages = await Promise.all(files.map(async (file) => {
      const url = URL.createObjectURL(file);
      const dims = await getImageDimensions(url); 
      const imgObj = { 
        id: generateId(), 
        file, 
        width: dims.width, 
        height: dims.height, 
        name: file.name, 
        caption: '', 
        log: '',
        status: 'pending', 
        originalName: file.name, 
        lastModified: Date.now() 
      };
      await dbService.addOrUpdate(imgObj);
      return { ...imgObj, url };
    }));
    
    const combinedImages = [...images, ...newImages];
    setImages(combinedImages);
    
    // Sync new images with folder if handle exists
    if (outputDirHandle) {
        await syncTagsFromFolder(outputDirHandle, combinedImages);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    const idsToDelete = Array.from(selectedIds);
    for (const id of idsToDelete) await dbService.delete(id);
    
    const deletedImages = images.filter(img => selectedIds.has(img.id));
    deletedImages.forEach(img => {
      if (img.url) URL.revokeObjectURL(img.url);
    });

    setImages(prev => prev.filter(img => !selectedIds.has(img.id)));
    setSelectedIds(new Set());
    if (activeImageId && idsToDelete.includes(activeImageId)) {
      setActiveImageId(null);
      setViewMode('grid');
    }
  };

  const handleClearDB = async () => {
    if (window.confirm(t.alertClearDB)) {
      await dbService.clear();
      images.forEach(img => {
        if (img.url) URL.revokeObjectURL(img.url);
      });
      setImages([]);
      setSelectedIds(new Set());
      setActiveImageId(null);
      setViewMode('grid');
    }
  };

  const handleSelect = useCallback((id, multi) => {
    if (multi) {
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
        return newSet;
      });
    } else {
      setSelectedIds(new Set([id]));
      setActiveImageId(id);
    }
  }, []);

  const handleRename = async () => {
    if (!renamePattern) return;
    let counter = 1;
    const targets = displayedImages.filter(img => selectedIds.size === 0 || selectedIds.has(img.id));
    const targetIds = new Set(targets.map(t => t.id));
    
    // First, update state
    const updatedImages = images.map(img => {
      if (targetIds.has(img.id)) {
        const extension = img.name.split('.').pop();
        const numStr = String(counter++).padStart(3, '0');
        const newName = renamePattern.replace('###', numStr) + '.' + extension;
        return { ...img, name: newName, lastModified: Date.now() };
      }
      return img;
    });
    setImages(updatedImages);
    setRenameModalOpen(false);
    
    // Then persist and save to disk
    for (const img of updatedImages) {
      if (targetIds.has(img.id)) {
        const { url, ...dbItem } = img; 
        await dbService.addOrUpdate(dbItem);
        
        // Save to local folder if handle exists
        if (outputDirHandle) {
            try {
                // Save Image
                const imgHandle = await outputDirHandle.getFileHandle(img.name, { create: true });
                const writable = await imgHandle.createWritable();
                await writable.write(img.file);
                await writable.close();
                
                // Save Caption if exists
                if (img.caption) {
                    const txtName = img.name.substring(0, img.name.lastIndexOf('.')) + '.txt';
                    const txtHandle = await outputDirHandle.getFileHandle(txtName, { create: true });
                    const txtWritable = await txtHandle.createWritable();
                    await txtWritable.write(img.caption);
                    await txtWritable.close();
                }
            } catch (err) {
                console.error("Failed to save renamed file to disk:", err);
            }
        }
      }
    }
  };

  const handleBatchOperation = async (mode, input1, input2, position) => {
    const targets = displayedImages.filter(img => selectedIds.size === 0 || selectedIds.has(img.id));
    const targetIds = new Set(targets.map(t => t.id));

    const updatedImages = images.map(img => {
      if (targetIds.has(img.id)) {
        let newCaption = img.caption || '';
        
        if (mode === 'add') {
          if (position === 'start') {
             if (!newCaption.startsWith(input1)) {
                newCaption = input1 + (newCaption ? ', ' + newCaption : '');
             }
          } else {
             newCaption = (newCaption ? newCaption + ', ' : '') + input1;
          }
        } else if (mode === 'remove') {
          const parts = newCaption.split(',').map(s => s.trim()).filter(s => s !== input1);
          newCaption = parts.join(', ');
        } else if (mode === 'replace') {
          const parts = newCaption.split(',').map(s => s.trim()).map(s => s === input1 ? input2 : s);
          newCaption = parts.join(', ');
        }

        return { ...img, caption: newCaption, lastModified: Date.now() };
      }
      return img;
    });

    setImages(updatedImages);
    setBatchTagModalOpen(false);
    
    for (const img of updatedImages) {
      if (targetIds.has(img.id)) {
        const { url, ...dbItem } = img; 
        await dbService.addOrUpdate(dbItem);
      }
    }
  };

  const fetchWithRetry = async (url, options, retries, delay, timeoutSecs = 60) => {
    let lastError = null;
    const userSignal = options.signal;

    for (let i = 0; i <= retries; i++) {
      try {
        if (!navigator.onLine) {
           throw new Error("Offline / 网络断开");
        }

        if (userSignal?.aborted) {
           throw new DOMException('Aborted', 'AbortError');
        }
        
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => timeoutController.abort(), timeoutSecs * 1000);
        
        const onUserAbort = () => {
          timeoutController.abort();
        };

        if (userSignal) {
           userSignal.addEventListener('abort', onUserAbort);
        }
        
        try {
            const res = await fetch(url, { ...options, signal: timeoutController.signal });
            clearTimeout(timeoutId);
            if (userSignal) userSignal.removeEventListener('abort', onUserAbort);
            return res;
        } catch (fetchErr) {
            clearTimeout(timeoutId);
            if (userSignal) userSignal.removeEventListener('abort', onUserAbort);
            
            if (fetchErr.name === 'AbortError') {
                if (userSignal?.aborted) throw fetchErr;
                throw new Error(`Timeout (${timeoutSecs}s)`);
            }
            throw fetchErr;
        }

      } catch (err) {
        lastError = err;
        if (err.name === 'AbortError' && userSignal?.aborted) throw err;
        
        if (i === retries) throw err;
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastError;
  };

  const stopTagging = () => {
    stopProcessing.current = true;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsProcessing(false);
  };

  const runAITagging = async () => {
    if (isProcessing) return; 
    if (!settings.apiKey && settings.provider !== 'lmstudio' && settings.provider !== 'ollama') {
       if (!settings.apiKey) { alert(t.alertApiKey); setIsSettingsOpen(true); return; }
    }
    const targets = displayedImages.filter(img => selectedIds.has(img.id));
    if (targets.length === 0) { alert(t.alertSelect); return; }

    stopProcessing.current = false;
    abortControllerRef.current = new AbortController();
    setFatalError(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: targets.length });

    const extractContent = (data) => {
      if (!data) return "";
      if (typeof data === 'string') return data;
      
      if (data.choices && data.choices.length > 0) {
        const choice = data.choices[0];
        if (choice.message) {
             if (choice.message.content) return choice.message.content;
             if (choice.message.reasoning_content && !choice.message.content) return choice.message.reasoning_content; 
        }
        if (choice.delta && choice.delta.content) return choice.delta.content;
        if (choice.text) return choice.text;
      }
      
      if (data.candidates && data.candidates.length > 0) {
         const candidate = data.candidates[0];
         if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
            return candidate.content.parts[0].text || "";
         }
      }

      if (data.response) return data.response; 
      if (data.content) return data.content;
      if (data.generated_text) return data.generated_text;
      
      return ""; 
    };

    let consecutiveErrors = 0;
    const maxConsecutive = settings.maxConsecutiveErrors || 3;

    for (let i = 0; i < targets.length; i++) {
      if (stopProcessing.current) {
        break;
      }

      const img = targets[i];
      setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'processing', log: `Sending request to ${settings.model}...` } : p));
      
      try {
        const base64 = await fileToBase64(img.file);
        const payload = {
          model: settings.model,
          messages: [
            { role: "system", content: settings.systemPrompt },
            { 
                role: "user", 
                content: [
                    { type: "text", text: "Tag this image." }, 
                    { 
                        type: "image_url", 
                        image_url: { 
                            url: base64,
                            detail: settings.imageDetail || 'auto'
                        } 
                    }
                ] 
            }
          ],
          stream: false,
          max_tokens: settings.maxOutputTokens || 4096 
        };
        
        const response = await fetchWithRetry(
          `${settings.baseUrl}/chat/completions`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.apiKey || 'not-needed'}` },
            body: JSON.stringify(payload),
            signal: abortControllerRef.current.signal
          },
          settings.retryCount || 3,
          settings.retryDelay || 2000,
          settings.timeout || 60
        );

        if (!response) throw new Error("No response from server");
        
        const responseText = await response.text(); 
        
        if (!response.ok) {
           const msg = `HTTP ${response.status}: ${responseText.slice(0, 200)}`;
           if (response.status === 401 || response.status === 403) {
              throw new Error(`FATAL AUTH ERROR: ${msg}`);
           }
           if (response.status === 429) {
              throw new Error(`RATE LIMIT: ${msg}`);
           }
           throw new Error(msg);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch(e) {
            throw new Error("Invalid JSON response: " + responseText.slice(0, 100));
        }

        const newTags = extractContent(data);
        
        if (!newTags) {
            if (data.choices && data.choices[0] && data.choices[0].finish_reason === 'content_filter') {
               throw new Error("Content blocked by safety filters.");
            }
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`Gemini blocked: ${data.promptFeedback.blockReason}`);
            }
            throw new Error("Empty content received. Raw: " + responseText.slice(0, 100));
        }
        
        consecutiveErrors = 0;
        
        setImages(prev => prev.map(p => {
          if (p.id === img.id) {
            let finalCaption = newTags;
            if (settings.appendMode === 'append' && p.caption) finalCaption = p.caption + ', ' + newTags;
            if (settings.appendMode === 'prepend' && p.caption) finalCaption = newTags + ', ' + p.caption;
            
            const updatedImg = { 
                ...p, 
                caption: finalCaption, 
                status: 'done', 
                log: `Success. Model: ${settings.model}, Len: ${newTags.length}`,
                lastModified: Date.now() 
            };
            const { url, ...dbItem } = updatedImg;
            dbService.addOrUpdate(dbItem);
            return updatedImg;
          }
          return p;
        }));
      } catch (error) {
        if (error.name === 'AbortError' || stopProcessing.current) {
           setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'pending', log: 'Task cancelled.' } : p));
           break;
        }

        consecutiveErrors++;
        console.error("Tagging error", error);
        
        const errorMsg = error.message || "Unknown error";
        setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'error', log: `Error: ${errorMsg}` } : p));
        
        if (errorMsg.includes('FATAL AUTH')) {
           stopProcessing.current = true;
           setFatalError(`Authentication Failed. Please check your API Key.\n${errorMsg}`);
           break;
        }
        
        if (consecutiveErrors >= maxConsecutive) {
            stopProcessing.current = true;
            setFatalError(`Circuit Breaker Triggered: ${consecutiveErrors} consecutive errors.\nLast error: ${errorMsg}`);
            break;
        }
      }
      setProgress({ current: i + 1, total: targets.length });
    }
    setIsProcessing(false);
  };

  const handleUpdateCaption = (id, txt) => {
    setImages(prev => prev.map(img => {
      if (img.id === id) {
        const updated = { ...img, caption: txt, lastModified: Date.now() };
        const { url, ...dbItem } = updated;
        dbService.addOrUpdate(dbItem);
        return updated;
      }
      return img;
    }));
  };

  const handleTestApi = async () => {
     if (!settings.apiKey && settings.provider !== 'lmstudio' && settings.provider !== 'ollama') {
        throw new Error(t.alertApiKey);
     }
     
     const payload = {
          model: settings.model,
          messages: [{ role: "user", content: "hi" }],
          max_tokens: 5
     };

     const response = await fetchWithRetry(
          `${settings.baseUrl}/chat/completions`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${settings.apiKey || 'not-needed'}` },
            body: JSON.stringify(payload)
          },
          0, 0, 10
     );
     
     if (!response.ok) {
        const txt = await response.text();
        throw new Error(`HTTP ${response.status} ${txt.slice(0, 100)}`);
     }
  };

  const handleSelectFolder = async () => {
      try {
          if (!window.showDirectoryPicker) {
              alert("Your browser does not support the File System Access API. Please use Chrome or Edge.");
              return;
          }
          const handle = await window.showDirectoryPicker();
          if (handle) {
              setOutputDirHandle(handle);
              await dbService.saveHandle(handle);
              await syncTagsFromFolder(handle, images);
          }
      } catch (err) {
          if (err.name !== 'AbortError') {
             console.error("Error selecting folder:", err);
             alert("Failed to access folder: " + err.message);
          }
      }
  };

  const saveFileToDisk = async (filename, content) => {
      if (outputDirHandle) {
          try {
              const opts = { mode: 'readwrite' };
              if ((await outputDirHandle.queryPermission(opts)) !== 'granted') {
                 if ((await outputDirHandle.requestPermission(opts)) !== 'granted') {
                     throw new Error("Permission denied");
                 }
              }
              
              const fileHandle = await outputDirHandle.getFileHandle(filename, { create: true });
              const writable = await fileHandle.createWritable();
              await writable.write(content);
              await writable.close();
              return true; 
          } catch (err) {
              console.warn("Direct save failed, falling back to download:", err);
          }
      }
      
      const element = document.createElement("a");
      const file = new Blob([content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      return false;
  };

  const downloadTextFiles = async () => {
    const targets = displayedImages.filter(img => selectedIds.size === 0 || selectedIds.has(img.id));
    if (targets.length === 0) return;
    
    if (!outputDirHandle && targets.length > 10 && !window.confirm(t.alertDownload(targets.length))) return;
    
    for (let i = 0; i < targets.length; i++) {
       const img = targets[i];
       if (!img.caption) continue;
       const txtName = img.name.substring(0, img.name.lastIndexOf('.')) + ".txt";
       
       if (outputDirHandle) {
           await saveFileToDisk(txtName, img.caption);
       } else {
           setTimeout(() => {
             saveFileToDisk(txtName, img.caption);
           }, i * 200);
       }
    }
  };

  const handleSaveSingle = async (img) => {
    if (!img) return;
    const txtName = img.name.substring(0, img.name.lastIndexOf('.')) + ".txt";
    
    if (outputDirHandle) {
        if (window.confirm(`${t.confirmOverwrite}${outputDirHandle.name}/${txtName}`)) {
            await saveFileToDisk(txtName, img.caption || '');
        }
    } else {
        const element = document.createElement("a");
        const file = new Blob([img.caption || ''], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = txtName;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-100 font-sans overflow-hidden relative">
      <Sidebar 
        t={t} fileInputRef={fileInputRef} handleFileUpload={handleFileUpload} 
        setRenameModalOpen={setRenameModalOpen} setBatchTagModalOpen={setBatchTagModalOpen}
        setStatsModalOpen={setStatsModalOpen}
        handleDelete={handleDelete} selectedIds={selectedIds}
        handleClearDB={handleClearDB} isProcessing={isProcessing} images={images}
        runAITagging={runAITagging} stopTagging={stopTagging} progress={progress} downloadTextFiles={downloadTextFiles}
        setIsSettingsOpen={setIsSettingsOpen} lang={lang} setLang={setLang}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-6 shrink-0 z-20">
           <div className="flex items-center gap-4">
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`} 
                  title={t.btnReturnGrid}
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => { if(activeImageId) setViewMode('focus'); else if(images.length > 0) { setActiveImageId(images[0].id); setViewMode('focus'); } }} 
                  className={`p-2 rounded ${viewMode === 'focus' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`} 
                  title="Focus View"
                >
                  <ZoomIn size={18} />
                </button>
              </div>
              <div className="h-6 w-px bg-gray-700 mx-2"></div>
              
              <div className="flex items-center gap-2">
                 <SlidersHorizontal size={16} className="text-gray-500" />
                 <input 
                   type="range" 
                   min="2" 
                   max="12" 
                   value={gridCols} 
                   onChange={(e) => setGridCols(parseInt(e.target.value))} 
                   className="w-24 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                   title={t.labelGridSize}
                 />
              </div>

              <span className="text-sm text-gray-400 border-l border-gray-700 pl-4">{t.statusInfo(images.length, selectedIds.size)}</span>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="relative group mr-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={14} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t.labelSearch}
                  className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-48 pl-9 p-1.5"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
             </div>

             <div className="relative group">
               <Button variant="ghost" className="text-sm flex items-center gap-1">
                 <ArrowUpDown size={14} /> {t.labelSort}
               </Button>
               <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-xl py-1 hidden group-hover:block z-50">
                 <button onClick={() => setSortOption('nameAsc')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 ${sortOption === 'nameAsc' ? 'text-blue-400' : 'text-gray-300'}`}>
                   <ArrowUpAZ size={14}/> {t.sortNameAsc}
                 </button>
                 <button onClick={() => setSortOption('nameDesc')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 ${sortOption === 'nameDesc' ? 'text-blue-400' : 'text-gray-300'}`}>
                   <ArrowDownAZ size={14}/> {t.sortNameDesc}
                 </button>
                 <div className="h-px bg-gray-700 my-1"></div>
                 <button onClick={() => setSortOption('dateNew')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 ${sortOption === 'dateNew' ? 'text-blue-400' : 'text-gray-300'}`}>
                   <Calendar size={14}/> {t.sortDateNew}
                 </button>
                 <button onClick={() => setSortOption('dateOld')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 ${sortOption === 'dateOld' ? 'text-blue-400' : 'text-gray-300'}`}>
                   <Calendar size={14}/> {t.sortDateOld}
                 </button>
               </div>
             </div>
             <Button variant="ghost" onClick={() => setSelectedIds(new Set(images.map(i => i.id)))}>{t.btnSelectAll}</Button>
             <Button variant="ghost" onClick={() => setSelectedIds(new Set())}>{t.btnDeselect}</Button>
           </div>
        </div>

        {viewMode === 'grid' ? (
          <GridView 
            isRestoring={isRestoring} 
            displayedImages={displayedImages} 
            t={t} 
            selectedIds={selectedIds} 
            handleSelect={handleSelect} 
            setViewMode={setViewMode} 
            setActiveImageId={setActiveImageId}
            handleFileUpload={handleFileUpload}
            gridCols={gridCols}
          />
        ) : (
          <FocusView 
            images={images} 
            activeImageId={activeImageId} 
            setActiveImageId={setActiveImageId}
            displayedImages={displayedImages} 
            t={t} 
            setViewMode={setViewMode}
            handleUpdateCaption={handleUpdateCaption} 
            handleSelect={handleSelect}
            runAITagging={runAITagging}
            stopTagging={stopTagging}
            isProcessing={isProcessing}
            handleSaveSingle={handleSaveSingle}
          />
        )}
      </div>
      
      {isSettingsOpen && 
        <SettingsModal 
           t={t} settings={settings} setSettings={setSettings} setIsSettingsOpen={setIsSettingsOpen} 
           handleTestApi={handleTestApi} 
           handleSelectFolder={handleSelectFolder}
           outputDirName={outputDirHandle ? outputDirHandle.name : null}
        />
      }
      {renameModalOpen && <RenameModal t={t} renamePattern={renamePattern} setRenamePattern={setRenamePattern} setRenameModalOpen={setRenameModalOpen} handleRename={handleRename} />}
      {batchTagModalOpen && <BatchTagModal t={t} setOpen={setBatchTagModalOpen} handleBatchOperation={handleBatchOperation} />}
      {statsModalOpen && <StatsModal t={t} images={images} setOpen={setStatsModalOpen} setSearchTerm={setSearchTerm} />}
      
      {fatalError && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-red-500 rounded-xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                    <ShieldAlert size={24} /> {t.fatalErrorTitle}
                </h3>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">{t.fatalErrorDesc}</p>
                <div className="bg-black/50 p-3 rounded border border-red-900/50 text-red-200 text-xs font-mono mb-6 overflow-auto max-h-32 whitespace-pre-wrap break-all">
                    {fatalError}
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => { setFatalError(null); stopTagging(); }}>{t.btnClose}</Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}