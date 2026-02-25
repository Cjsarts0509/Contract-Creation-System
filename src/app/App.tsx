import { useState, useRef, useEffect } from 'react';
import { getContractTemplate, ContractData } from './utils/contractTemplates';
import { CONTRACT_CONFIG } from './utils/contractConfig';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Undo, Redo, Printer, 
  RotateCcw, Check, Save, RefreshCw, AlertTriangle, AlertCircle, Calendar, 
  ChevronLeft, ChevronRight, FileText, Image as ImageIcon, FileCode, X, Github
} from 'lucide-react';
import { useIsMobile } from './components/ui/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

// [중요] 스타일 파일 경로
import '../styles/fonts.css'; 

// ==========================================
// [상수] 설정 및 데이터
// ==========================================
const FONT_COLORS = [
  '#000000', '#FFFFFF', '#E0E0E0', '#9E9E9E', '#616161', '#424242', 
  '#263238', '#1E3A5F', '#0D47A1', '#1976D2', '#E53935', '#D32F2F',
  '#FF6F00', '#F57C00', '#FFC107', '#FFA000', '#66BB6A', '#43A047',
  '#26A69A', '#00897B', '#29B6F6', '#0288D1', '#42A5F5', '#1E88E5',
  '#5C6BC0', '#3F51B5', '#7E57C2', '#673AB7', '#AB47BC', '#8E24AA',
  '#EC407A', '#C2185B', '#EF5350', '#FF5722'
];

const PDF_CONFIG = {
  PAGE_WIDTH_MM: 210,
  PAGE_HEIGHT_MM: 297,
  MARGIN_TOP_MM: 20,
  MARGIN_BOTTOM_MM: 20,
  MARGIN_LEFT_MM: 15,
  MARGIN_RIGHT_MM: 15,
  MM_TO_PX: 3.78, // 1mm ≒ 3.78px
};

const formatDateString = (value: string) => {
  const numbers = value.replace(/[^0-9]/g, '');
  let formatted = numbers;
  if (numbers.length > 4) formatted = numbers.slice(0, 4) + '-' + numbers.slice(4);
  if (numbers.length > 6) formatted = numbers.slice(0, 4) + '-' + numbers.slice(4, 6) + '-' + numbers.slice(6, 8);
  return formatted;
};

const isRealDate = (dateStr: string) => {
  if (dateStr.length !== 10) return true; 
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

export default function App() {
  const isMobile = useIsMobile();

  // ----------------------------------------------------------------------
  // 1. 상태 관리
  // ----------------------------------------------------------------------
  const [contractType, setContractType] = useState<string>('');
  const [basicInfo, setBasicInfo] = useState({
    supplierName: '', ceo: '', address: '',
    contractDate: '', tradeStartDate: '', tradeEndDate: ''
  });
  const [tradeInfo, setTradeInfo] = useState<Record<string, string>>({});
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [warningModal, setWarningModal] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const [showSaveModal, setShowSaveModal] = useState(false);
  
  const [calendarTarget, setCalendarTarget] = useState<keyof typeof basicInfo | null>(null);
  const [currentCalDate, setCurrentCalDate] = useState(new Date());

  const editorRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef<boolean>(false);
  
  const [selectedTable, setSelectedTable] = useState<HTMLTableElement | null>(null);
  const [selectedCell, setSelectedCell] = useState<HTMLTableCellElement | null>(null);
  const [fontSize, setFontSize] = useState<string>('13');
  const [fontColor, setFontColor] = useState<string>('#000000');
  const [cellBgColor, setCellBgColor] = useState<string>('#ffffff');
  const [fontStyle, setFontStyle] = useState<string>('normal');
  const [textAlign, setTextAlign] = useState<string>('left');
  
  const [tableWidth, setTableWidth] = useState('');
  const [tableHeight, setTableHeight] = useState('');
  const [cellWidth, setCellWidth] = useState('');
  const [cellHeight, setCellHeight] = useState('');
  
  const savedSelectionRef = useRef<Range | null>(null);

  // 모바일 탭 상태
  const [mobileTab, setMobileTab] = useState<'input' | 'preview'>('input');
  // 현재 에디터 내용 저장용 (모바일 탭 전환 시 유지)
  const [currentEditorContent, setCurrentEditorContent] = useState<string>('');

  // ----------------------------------------------------------------------
  // 2. 비즈니스 로직
  // ----------------------------------------------------------------------
  const handleBasicInfoChange = (field: string, value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateDateRange = (startDate: string, endDate: string) => {
    if (startDate.length === 10 && endDate.length === 10) {
      if (startDate > endDate) return false;
    }
    return true;
  };

  const handleDateChange = (field: keyof typeof basicInfo, value: string) => {
    const formattedDate = formatDateString(value);
    setBasicInfo(prev => {
      const newState = { ...prev, [field]: formattedDate };
      if (newState.tradeStartDate && newState.tradeEndDate) {
        if (!validateDateRange(newState.tradeStartDate, newState.tradeEndDate)) {
           setTimeout(() => {
             setWarningModal({ show: true, msg: '거래 시작일은 종료일보다 늦을 수 없습니다.' });
             setBasicInfo(current => ({ ...current, [field]: '' }));
           }, 100);
        }
      }
      return newState;
    });
  };

  const handleDateBlur = (field: keyof typeof basicInfo) => {
    const value = basicInfo[field];
    if (value && !isRealDate(value as string)) {
      setWarningModal({ show: true, msg: '존재하지 않는 날짜입니다.' });
      setBasicInfo(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectDateFromCalendar = (day: number) => {
    if (!calendarTarget) return;
    const y = currentCalDate.getFullYear();
    const m = String(currentCalDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const selectedDate = `${y}-${m}-${d}`;
    setBasicInfo(prev => {
      const newState = { ...prev, [calendarTarget]: selectedDate };
      if (!validateDateRange(newState.tradeStartDate, newState.tradeEndDate)) {
        setTimeout(() => {
          setWarningModal({ show: true, msg: '거래 시작일은 종료일보다 늦을 수 없습니다.' });
          setBasicInfo(current => ({ ...current, [calendarTarget]: '' }));
        }, 100);
        return prev;
      }
      return newState;
    });
    setCalendarTarget(null);
  };

  const renderCalendar = () => {
    const y = currentCalDate.getFullYear();
    const m = currentCalDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const lastDate = new Date(y, m + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= lastDate; i++) days.push(i);
    
    // 모바일 최적화 스타일
    const modalClass = isMobile 
      ? "bg-white rounded-lg shadow-2xl p-5 w-[90%] max-w-[360px]" 
      : "bg-white rounded-lg shadow-2xl p-5 w-80";
      
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
        <div className={modalClass}>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentCalDate(new Date(y, m - 1))} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-5 h-5"/></button>
            <span className="font-bold text-gray-700">{y}년 {m + 1}월</span>
            <button onClick={() => setCurrentCalDate(new Date(y, m + 1))} className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-5 h-5"/></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['일','월','화','수','목','금','토'].map(d => <span key={d} className="text-xs font-medium text-gray-400">{d}</span>)}
            {days.map((d, i) => (
              <button key={i} disabled={!d} onClick={() => d && selectDateFromCalendar(d)} 
                className={`h-9 rounded-md text-sm transition-colors ${d ? 'hover:bg-[#5c7cfa] hover:text-white text-gray-700' : 'cursor-default'}`}>
                {d}
              </button>
            ))}
          </div>
          <button onClick={() => setCalendarTarget(null)} className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-800 font-medium">닫기</button>
        </div>
      </div>
    );
  };

  const handleContractTypeSelect = (type: string) => {
    setContractType(type);
    setTradeInfo({}); 
    // 비동기 상태 문제 해결: 상태가 아닌 전달받은 type과 현재 basicInfo    바로 사용
    const template = getContractTemplate(type, { ...basicInfo, tradePeriod: '', ...tradeInfo });
    if (editorRef.current) editorRef.current.innerHTML = template;
    setCurrentEditorContent(template);
    setHistory([template]);
    setHistoryIndex(0);
    
    // 모바일에서는 양식 선택 시 자동으로 미리보기 탭으로 이동 (사용성 개선)
    // if (isMobile) setMobileTab('preview'); // 사용자가 원할지 모르니 일단 주석 처리
  };

  const handleTradeInfoChange = (field: string, value: string, type?: string) => {
    let finalValue = value;
    if (field.toLowerCase().includes('commission') || field === 'marginRate') {
        const numbersOnly = value.replace(/[^0-9]/g, '');
        if (Number(numbersOnly) > 100) {
            setWarningModal({ show: true, msg: '수수료율은 100을 초과할 수 없습니다.' });
            finalValue = ''; 
        } else {
            finalValue = numbersOnly.slice(0, 3);
        }
    } else if (type === 'number') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      finalValue = numbersOnly ? Number(numbersOnly).toLocaleString() : '';
    }
    setTradeInfo(prev => ({ ...prev, [field]: finalValue }));
  };

  const handleReset = () => {
    setBasicInfo({ supplierName: '', ceo: '', address: '', contractDate: '', tradeStartDate: '', tradeEndDate: '' });
    setTradeInfo({});
  };

  const confirmSystemReset = () => {
    setContractType('');
    handleReset();
    const initialContent = '<div class="contract-page bg-white mx-auto shadow-sm border border-gray-200" style="width: 210mm; height: 297mm; padding: 25.4mm 19mm;"><p class="text-gray-400 text-center" style="margin-top: 120px;">매입처거래구분을 선택하면 계약서 양식이 표시됩니다.</p></div>';
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent;
    }
    setCurrentEditorContent(initialContent);
    setHistory([]); setHistoryIndex(-1); setShowResetConfirm(false);
  };

  const handleApply = () => {
    if (!contractType) { alert('계약서 양식을 먼저 선택해주세요.'); return; }
    const start = basicInfo.tradeStartDate;
    const end = basicInfo.tradeEndDate;
    let period = '';
    if (start && end) {
      const s = new Date(start); const e = new Date(end);
      let y = e.getFullYear() - s.getFullYear();
      let m = e.getMonth() - s.getMonth();
      if (m < 0) { y--; m += 12; }
      period = `${y > 0 ? y + '년 ' : ''}${m > 0 ? m + '개월' : '0개월'}간`;
    }
    const data: ContractData = { ...basicInfo, tradePeriod: period, ...tradeInfo };
    const updated = getContractTemplate(contractType, data);
    if (editorRef.current) editorRef.current.innerHTML = updated;
    setCurrentEditorContent(updated);
    addToHistory(updated);
    
    // 모바일에서는 적용 후 미리보기 탭으로 이동
    if (isMobile) {
      setMobileTab('preview');
    }
  };

  // ----------------------------------------------------------------------
  // 3. 에디터 히스토리 및 서식 도구
  // ----------------------------------------------------------------------
  const addToHistory = (content: string) => {
    if (isRestoringRef.current) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(content);
    if (newHistory.length > 50) newHistory.shift();
    else setHistoryIndex(historyIndex + 1);
    setHistory(newHistory);
  };

  const handleUndo = () => {
    if (historyIndex > 0 && editorRef.current) {
      isRestoringRef.current = true;
      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      editorRef.current.innerHTML = content;
      setCurrentEditorContent(content);
      setHistoryIndex(newIndex);
      setTimeout(() => { isRestoringRef.current = false; }, 100);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && editorRef.current) {
      isRestoringRef.current = true;
      const newIndex = historyIndex + 1;
      const content = history[newIndex];
      editorRef.current.innerHTML = content;
      setCurrentEditorContent(content);
      setHistoryIndex(newIndex);
      setTimeout(() => { isRestoringRef.current = false; }, 100);
    }
  };

  const handleInput = () => {
    if (isRestoringRef.current || !editorRef.current) return;
    const content = editorRef.current.innerHTML;
    setCurrentEditorContent(content);
    
    if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
    inputTimeoutRef.current = setTimeout(() => {
      addToHistory(content);
    }, 1000);
  };
  
  // 모바일 탭 전환 시 에디터 내용 복구
  useEffect(() => {
    if (isMobile && mobileTab === 'preview' && editorRef.current && currentEditorContent) {
       editorRef.current.innerHTML = currentEditorContent;
    }
  }, [mobileTab, isMobile]);

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    if (selection.rangeCount > 0) savedSelectionRef.current = selection.getRangeAt(0).cloneRange();
    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer as HTMLElement;
    if (!editorRef.current?.contains(element)) return;
    
    const table = element?.closest('table') as HTMLTableElement;
    setSelectedTable(table || null);
    if (table) { setTableWidth(table.offsetWidth + 'px'); setTableHeight(table.offsetHeight + 'px'); }
    
    const cell = element?.closest('td') as HTMLTableCellElement;
    setSelectedCell(cell || null);
    if (cell) { setCellBgColor(window.getComputedStyle(cell).backgroundColor); setCellWidth(cell.offsetWidth + 'px'); setCellHeight(cell.offsetHeight + 'px'); }
    
    if (element && editorRef.current?.contains(element)) {
      const computedStyle = window.getComputedStyle(element);
      setFontSize(parseInt(computedStyle.fontSize).toString());
      setFontColor(computedStyle.color);
      setTextAlign(computedStyle.textAlign);
      setFontStyle(parseInt(computedStyle.fontWeight) >= 700 ? 'bold' : 'normal');
    }
  };

  const applyCommand = (cmd: string, arg?: string) => { document.execCommand(cmd, false, arg); if(editorRef.current) { addToHistory(editorRef.current.innerHTML); setCurrentEditorContent(editorRef.current.innerHTML); } };
  const applyFontColor = (color: string) => { setFontColor(color); applyCommand('foreColor', color); };
  const applyCellBgColor = (color: string) => { if(selectedCell) { selectedCell.style.backgroundColor = color; setCellBgColor(color); if(editorRef.current) { addToHistory(editorRef.current.innerHTML); setCurrentEditorContent(editorRef.current.innerHTML); } }};
  const applyFontStyle = (style: string) => { setFontStyle(style); applyCommand(style === 'bold' ? 'bold' : 'removeFormat'); };
  const applyTextAlign = (align: string) => { setTextAlign(align); applyCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`); };
  
  const changeFontSize = (delta: number) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) { alert('텍스트를 먼저    택해주세요.'); return; }
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    let startNode = range.startContainer;
    let element = startNode.nodeType === Node.TEXT_NODE ? startNode.parentElement : startNode as HTMLElement;
    if (!element || !editorRef.current?.contains(element)) return;

    const currentStyle = window.getComputedStyle(element);
    const currentSize = parseInt(currentStyle.fontSize) || 13;
    const newSize = Math.max(8, Math.min(72, currentSize + delta));
    setFontSize(newSize.toString());

    // (기존 폰트 크기 변경 로직 생략 없이 그대로 유지)
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
        range.commonAncestorContainer, NodeFilter.SHOW_TEXT, 
        { acceptNode: (node) => range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
    );
    while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
    
    if (textNodes.length === 0) return;

    let firstProcessedNode: Node | null = null;
    let lastProcessedNode: Node | null = null;

    textNodes.forEach(node => {
      let targetNode: Node = node;
      if (node === range.startContainer && range.startOffset > 0) targetNode = (node as Text).splitText(range.startOffset);
      if (node === range.endContainer && range.endOffset < node.nodeValue!.length) {
        let endOffset = range.endOffset;
        if (node === range.startContainer) endOffset -= range.startOffset;
        (targetNode as Text).splitText(endOffset);
      } else if (node === range.endContainer && range.endOffset < node.nodeValue!.length) {
         (node as Text).splitText(range.endOffset);
      }

      const parent = targetNode.parentElement;
      if (parent && parent.tagName === 'SPAN' && parent.childNodes.length === 1 && parent.firstChild === targetNode) {
         parent.style.fontSize = `${newSize}px`;
         if (!firstProcessedNode) firstProcessedNode = targetNode;
         lastProcessedNode = targetNode;
      } else {
         const span = document.createElement('span');
         span.style.fontSize = `${newSize}px`;
         targetNode.parentNode?.insertBefore(span, targetNode);
         span.appendChild(targetNode);
         if (!firstProcessedNode) firstProcessedNode = targetNode;
         lastProcessedNode = targetNode;
      }
    });

    if (firstProcessedNode && lastProcessedNode) {
       selection.removeAllRanges();
       const newRange = document.createRange();
       newRange.selectNodeContents(firstProcessedNode.parentNode as Node); 
       newRange.setStart(firstProcessedNode, 0);
       newRange.setEnd(lastProcessedNode, (lastProcessedNode as Text).length);
       selection.addRange(newRange);
    }
    if (editorRef.current) {
        addToHistory(editorRef.current.innerHTML);
        setCurrentEditorContent(editorRef.current.innerHTML);
    }
  };
  
  const insertTable = () => applyCommand('insertHTML', `<table class="contract-table editable-table" style="width:100%; border-collapse:collapse; margin:15px 0;"><tbody><tr><td style="border:1px solid #000; padding:8px;">Cell</td><td style="border:1px solid #000; padding:8px;">Cell</td></tr><tr><td style="border:1px solid #000; padding:8px;">Cell</td><td style="border:1px solid #000; padding:8px;">Cell</td></tr></tbody></table><br/>`);
  const addTableRow = () => { if(selectedTable) { const row = selectedTable.insertRow(); for(let i=0; i<selectedTable.rows[0].cells.length; i++) { const cell = row.insertCell(); cell.innerHTML='Cell'; cell.style.border='1px solid #000'; cell.style.padding='8px'; } } };
  const removeTableRow = () => { if(selectedTable && selectedTable.rows.length > 1) selectedTable.deleteRow(selectedTable.rows.length-1); };
  const addTableColumn = () => { if(selectedTable) { for(let i=0; i<selectedTable.rows.length; i++) { const cell = selectedTable.rows[i].insertCell(); cell.innerHTML='Cell'; cell.style.border='1px solid #000'; cell.style.padding='8px'; } } };
  const removeTableColumn = () => { if(selectedTable && selectedTable.rows[0].cells.length > 1) { for(let i=0; i<selectedTable.rows.length; i++) { selectedTable.rows[i].deleteCell(selectedTable.rows[i].cells.length-1); } } };

  // =================================================================
  // [핵심] PDF 저장 및 스마트 페이지네이션 (oklch 방어 + 여백 준수)
  // =================================================================
  const getFileName = (ext: string) => {
    const supplier = basicInfo.supplierName || '매입처명';
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const typeNameMap: Record<string, string> = { 'direct': '직매입 거래계약서', 'directPB': '제조 위탁 계약서', 'specific': '특정 매입 거래계약서', 'specificDelivery': '배송 대행 계약서' };
    const typeName = typeNameMap[contractType] || '거래계약서';
    return `${typeName}_${supplier}_${yyyy}${mm}${dd}.${ext}`;
  };

  const executeSave = async (format: 'pdf' | 'jpg' | 'html') => {
    if (!editorRef.current) return;
    if (editorRef.current.innerText.trim().length < 10) { alert('저장할 문서 내용이 없습니다.'); return; }

    try {
      const fileName = getFileName(format);
      if (format === 'html') {
        const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${fileName}</title><style>body{font-family:sans-serif;line-height:1.5;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #000;padding:8px;}</style></head><body>${editorRef.current.innerHTML}</body></html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setShowSaveModal(false);
        return;
      }

      document.body.style.cursor = 'wait';

      // 1. 임시 컨테이너 준비 (oklch 에러 방지용 스타일 강제 주입)
      const container = document.createElement('div');
      Object.assign(container.style, { 
        position: 'fixed', top: '0', left: '-10000px', zIndex: '-1000',
        fontFamily: 'sans-serif', lineHeight: '1.6',
        color: '#000000', backgroundColor: '#ffffff',
        width: '210mm' // 모바일에서도 너비 강제
      });
      
      // [핵심] oklch 함수가 호출되지 않도록 CSS 변수들을 고정값(Hex)으로 덮어씀
      const varsToReset = ['--background', '--foreground', '--primary', '--secondary', '--muted', '--accent', '--destructive', '--border', '--input', '--ring', '--popover', '--card'];
      varsToReset.forEach(v => container.style.setProperty(v, '#ffffff'));
      container.style.setProperty('--foreground', '#000000');
      
      document.body.appendChild(container);

      const pages: HTMLDivElement[] = [];
      const createNewPage = () => {
        const page = document.createElement('div');
        page.className = 'contract-page'; // 스타일 상속
        Object.assign(page.style, {
          width: `${PDF_CONFIG.PAGE_WIDTH_MM}mm`, height: `${PDF_CONFIG.PAGE_HEIGHT_MM}mm`,
          padding: `${PDF_CONFIG.MARGIN_TOP_MM}mm ${PDF_CONFIG.MARGIN_RIGHT_MM}mm ${PDF_CONFIG.MARGIN_BOTTOM_MM}mm ${PDF_CONFIG.MARGIN_LEFT_MM}mm`,
          backgroundColor: '#ffffff', color: '#000000', boxSizing: 'border-box', overflow: 'hidden', position: 'relative',
          margin: '0', boxShadow: 'none'
        });
        container.appendChild(page);
        pages.push(page);
        return page;
      };

      let currentPage = createNewPage();
      const MAX_HEIGHT_PX = (PDF_CONFIG.PAGE_HEIGHT_MM - PDF_CONFIG.MARGIN_TOP_MM - PDF_CONFIG.MARGIN_BOTTOM_MM) * PDF_CONFIG.MM_TO_PX - 20; 
      let currentHeight = 0;

      // [기능 1] 표 쪼개기
      const appendTableSmartly = (table: HTMLTableElement) => {
        const tableClone = table.cloneNode(true) as HTMLTableElement;
        currentPage.appendChild(tableClone);
        const h = tableClone.offsetHeight;
        if (currentHeight + h <= MAX_HEIGHT_PX) {
          currentHeight += h + 15;
          return;
        }
        currentPage.removeChild(tableClone);
        
        const thead = table.querySelector('thead');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        
        let stub = document.createElement('table');
        stub.className = table.className; stub.style.cssText = table.style.cssText;
        if(thead) stub.appendChild(thead.cloneNode(true));
        let tbody = document.createElement('tbody');
        stub.appendChild(tbody);
        currentPage.appendChild(stub);
        currentHeight += (thead ? thead.offsetHeight : 0);

        for (const row of rows) {
          const r = row.cloneNode(true);
          tbody.appendChild(r);
          const stubH = stub.offsetHeight;
          if (currentHeight + stubH > MAX_HEIGHT_PX) {
            tbody.removeChild(r);
            currentPage = createNewPage();
            currentHeight = 0;
            stub = document.createElement('table');
            stub.className = table.className; stub.style.cssText = table.style.cssText;
            if(thead) stub.appendChild(thead.cloneNode(true));
            tbody = document.createElement('tbody');
            stub.appendChild(tbody);
            currentPage.appendChild(stub);
            tbody.appendChild(row.cloneNode(true));
            currentHeight = stub.offsetHeight;
          }
        }
        currentHeight = stub.offsetHeight + 15;
      };

      // [기능 2] 텍스트 쪼개기
      const appendBlockSmartly = (element: HTMLElement) => {
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.marginTop = '0'; clone.style.marginBottom = '10px';
        currentPage.appendChild(clone);
        const h = clone.offsetHeight;

        if (currentHeight + h <= MAX_HEIGHT_PX) {
          currentHeight += h;
          return;
        }
        currentPage.removeChild(clone);
        
        let currentBlock = element.cloneNode(false) as HTMLElement;
        currentBlock.style.marginTop = '0'; currentBlock.style.marginBottom = '0';
        currentPage.appendChild(currentBlock);
        
        const childNodes = Array.from(element.childNodes);
        for (const child of childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            const textContent = child.textContent || '';
            const words = textContent.split(/(\s+)/);
            for (const word of words) {
              const textNode = document.createTextNode(word);
              currentBlock.appendChild(textNode);
              if (currentHeight + currentBlock.offsetHeight > MAX_HEIGHT_PX) {
                 currentBlock.removeChild(textNode);
                 currentPage = createNewPage();
                 currentHeight = 0;
                 currentBlock = element.cloneNode(false) as HTMLElement;
                 currentBlock.style.marginTop = '0';
                 currentPage.appendChild(currentBlock);
                 currentBlock.appendChild(document.createTextNode(word));
              }
            }
          } else {
            const elClone = child.cloneNode(true);
            currentBlock.appendChild(elClone);
            if (currentHeight + currentBlock.offsetHeight > MAX_HEIGHT_PX) {
               currentBlock.removeChild(elClone);
               currentPage = createNewPage();
               currentHeight = 0;
               currentBlock = element.cloneNode(false) as HTMLElement;
               currentBlock.style.marginTop = '0';
               currentPage.appendChild(currentBlock);
               currentBlock.appendChild(child.cloneNode(true));
            }
          }
        }
        currentHeight += currentBlock.offsetHeight + 10;
      };

      const contentWrapper = editorRef.current.querySelector('.contract-page') || editorRef.current;
      const childNodes = Array.from(contentWrapper.children) as HTMLElement[];

      for (const child of childNodes) {
        if (child.tagName === 'TABLE') {
          appendTableSmartly(child as HTMLTableElement);
        } else {
          appendBlockSmartly(child);
        }
      }

      if (format === 'jpg') {
        container.style.width = '210mm'; container.style.height = 'auto';
        pages.forEach(p => p.style.marginBottom = '20px');
        const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        const link = document.createElement('a'); link.download = fileName; link.href = canvas.toDataURL('image/jpeg', 0.9); link.click();
      } else if (format === 'pdf') {
        const pdf = new jsPDF('p', 'mm', 'a4');
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          // 모바일 메모리 최적화를 위해 scale 조정 가능 (현재는 2 유지)
          // 텍스트 겹침 방지를 위해 windowWidth 등 옵션 추가 고려 가능하나, width 지정으로 충분할 것으로 예상
          const canvas = await html2canvas(page, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#ffffff', 
            width: page.offsetWidth, 
            height: page.offsetHeight 
          });
          if (i > 0) pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
        }
        pdf.save(fileName);
      }

      document.body.removeChild(container);
      document.body.style.cursor = 'default';
      setShowSaveModal(false);
      alert('저장이 완료되었습니다.');

    } catch (error: any) {
      console.error(error); alert('저장 실패: ' + error.message); document.body.style.cursor = 'default';
    }
  };

  const handleSaveClick = () => { 
    if (!editorRef.current?.innerHTML || editorRef.current.innerHTML.includes('매입처거래구분을 선택하면')) { alert('내용이 없습니다.'); return; }
    
    // 모바일에서는 바로 PDF 저장 (옵션 모달 생략, 인쇄 삭제)
    if (isMobile) {
      if (confirm('PDF로 저장하시겠습니까?')) {
        executeSave('pdf');
      }
      return;
    }
    
    setShowSaveModal(true); 
  };
  
  const handlePrint = () => { if (!editorRef.current?.innerHTML || editorRef.current.innerHTML.includes('매입처거래구분을 선택하면')) { alert('내용이 없습니다.'); return; } window.print(); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); handleUndo(); }
      else if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') || (e.ctrlKey && e.key.toLowerCase() === 'y')) { e.preventDefault(); handleRedo(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
    };
  });

  // ----------------------------------------------------------------------
  // 4. 컴포넌트 렌더링 (입력 폼 등) - 재사용을 위해 변수로 분리
  // ----------------------------------------------------------------------
  const ContractTypeButtons = (
    <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 gap-2'}`}>
      {['direct', 'directPB', 'specific', 'specificDelivery', 'contractETC1', 'contractETC2', 'contractETC3', 'contractETC4', 'contractETC5', 'contractETC6'].map((type, idx) => (
        <button key={type} onClick={() => handleContractTypeSelect(type)} className={`px-4 ${isMobile ? 'py-3 text-base' : 'py-2 text-sm'} rounded transition-colors ${contractType === type ? 'bg-[#5c7cfa] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
          {['직매입', '직매입(PB)', '특정매입', '특정매입(배송대행)', '???', '???', '???', '???', '???', '???'][idx]}
        </button>
      ))}
    </div>
  );

  const BasicInfoInputs = (
    <div className="space-y-2">
      {[{ label: '매입처명', key: 'supplierName' }, { label: '대표이사', key: 'ceo' }, { label: '사업장주소', key: 'address' }].map((item) => (
        <div key={item.key} className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-[100px_1fr] gap-2 items-center'}`}>
          <label className={`bg-gray-50 px-3 py-2 text-sm text-gray-700 ${isMobile ? 'font-semibold' : ''}`}>{item.label}</label>
          <input type="text" value={basicInfo[item.key as keyof typeof basicInfo]} onChange={(e) => handleBasicInfoChange(item.key, e.target.value)} className={`border border-gray-300 px-3 ${isMobile ? 'py-3' : 'py-2'} rounded text-sm focus:outline-none focus:border-[#5c7cfa]`} placeholder={`${item.label} 입력`} />
        </div>
      ))}
      {[{ label: '계약일자', key: 'contractDate' }, { label: '거래시작일자', key: 'tradeStartDate' }, { label: '거래종료일자', key: 'tradeEndDate' }].map((item) => (
        <div key={item.key} className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-[100px_1fr] gap-2 items-center'}`}>
          <label className={`bg-gray-50 px-3 py-2 text-sm text-gray-700 ${isMobile ? 'font-semibold' : ''}`}>{item.label}</label>
          <div className="relative flex items-center">
            <input type="text" value={basicInfo[item.key as keyof typeof basicInfo]} placeholder="YYYY-MM-DD" maxLength={10} onChange={(e) => handleDateChange(item.key as keyof typeof basicInfo, e.target.value)} onBlur={() => handleDateBlur(item.key as keyof typeof basicInfo)} className={`w-full border border-gray-300 px-3 ${isMobile ? 'py-3' : 'py-2'} rounded text-sm focus:outline-none focus:border-[#5c7cfa] pr-10`} />
            <button onClick={() => setCalendarTarget(item.key as keyof typeof basicInfo)} className="absolute right-2 p-2 text-gray-400 hover:text-[#5c7cfa] transition-colors"><Calendar className="w-5 h-5"/></button>
          </div>
        </div>
      ))}
    </div>
  );

  const TradeInfoInputs = (
    <div className="space-y-2">
      {contractType && CONTRACT_CONFIG[contractType] ? (
        CONTRACT_CONFIG[contractType].map((field) => (
          <div key={field.key} className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-[120px_1fr] gap-2 items-center'}`}>
            <label className={`bg-gray-50 px-3 py-2 text-sm text-gray-700 ${isMobile ? 'font-semibold' : ''}`}>{field.label}</label>
            <input type="text" value={tradeInfo[field.key] || ''} onChange={(e) => handleTradeInfoChange(field.key, e.target.value, field.type)} className={`border border-gray-300 px-3 ${isMobile ? 'py-3' : 'py-2'} rounded text-sm focus:outline-none focus:border-[#5c7cfa]`} placeholder={field.placeholder} />
          </div>
        ))
      ) : (<p className="text-sm text-gray-500 text-center py-4">계약서 양식을 선택해주세요.</p>)}
    </div>
  );

  const ActionButtons = (
    <section className="flex flex-wrap gap-2">
      <button onClick={handleReset} className="flex-1 bg-gray-500 text-white px-3 py-2.5 rounded hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><RotateCcw className="w-4 h-4" />초기화</button>
      <button onClick={handleApply} className="flex-1 bg-[#5c7cfa] text-white px-3 py-2.5 rounded hover:bg-[#4c6cdf] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Check className="w-4 h-4" />적용</button>
      <button onClick={handleSaveClick} className="flex-1 bg-[#51cf66] text-white px-3 py-2.5 rounded hover:bg-[#40c057] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Save className="w-4 h-4" />저장</button>
      {!isMobile && <button onClick={handlePrint} className="flex-1 bg-[#EF5350] text-white px-3 py-2.5 rounded hover:bg-[#E53935] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Printer className="w-4 h-4" />인쇄</button>}
      <button onClick={() => setShowResetConfirm(true)} className="flex-1 bg-red-600 text-white px-3 py-2.5 rounded hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><RefreshCw className="w-4 h-4" /><span className="leading-none text-center">전체<br/>초기화</span></button>
    </section>
  );

  // ----------------------------------------------------------------------
  // 5. 화면 렌더링
  // ----------------------------------------------------------------------
  return (
    <div className="size-full flex bg-gray-50 relative font-sans">
      
      {/* 1. 전체 초기화 모달 */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[360px] text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 초기화</h3>
            <p className="text-sm text-gray-500 mb-6">모든 입력 데이터와 계약서 내용이 삭제됩니다.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium">아니오</button>
              <button onClick={confirmSystemReset} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium shadow-sm">초기화</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 저장 방식 선택 모달 (데스크탑만) */}
      {showSaveModal && !isMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[400px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">저장 방식 선택</h3>
            <div className="space-y-3">
              <button onClick={() => executeSave('pdf')} className="w-full flex items-center p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all group">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200"><FileText className="w-5 h-5 text-blue-600" /></div>
                <div className="text-left"><div className="font-medium text-gray-800">PDF로 저장</div><div className="text-xs text-gray-500">인쇄 및 배포용 (페이지 자동 분할)</div></div>
              </button>
              <button onClick={() => executeSave('jpg')} className="w-full flex items-center p-3 border rounded-lg hover:bg-green-50 hover:border-green-300 transition-all group">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-200"><ImageIcon className="w-5 h-5 text-green-600" /></div>
                <div className="text-left"><div className="font-medium text-gray-800">JPG 이미지로 저장</div><div className="text-xs text-gray-500">전체 내용을 하나의 이미지로 저장</div></div>
              </button>
              <button onClick={() => executeSave('html')} className="w-full flex items-center p-3 border rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all group">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-orange-200"><FileCode className="w-5 h-5 text-orange-600" /></div>
                <div className="text-left"><div className="font-medium text-gray-800">HTML 코드로 저장</div><div className="text-xs text-gray-500">웹 게시용 원본 코드 저장</div></div>
              </button>
            </div>
            <button onClick={() => setShowSaveModal(false)} className="w-full mt-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 font-medium flex items-center justify-center gap-1"><X className="w-4 h-4" /> 취소</button>
          </div>
        </div>
      )}

      {/* 3. 경고 메시지 모달 */}
      {warningModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[320px] text-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 mx-auto"><AlertCircle className="w-6 h-6 text-orange-600" /></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">입력 오류</h3>
            <p className="text-sm text-gray-500 mb-6 whitespace-pre-line">{warningModal.msg}</p>
            <button onClick={() => setWarningModal({ show: false, msg: '' })} className="w-full px-4 py-2 bg-[#5c7cfa] text-white rounded-md hover:bg-[#4c6cdf] font-medium shadow-sm">확인</button>
          </div>
        </div>
      )}

      {calendarTarget && renderCalendar()}

      {/* 데스크탑 레이아웃 */}
      {!isMobile && (
        <>
          {/* --- [좌측: 입력 패널] --- */}
          <div className="w-[30%] bg-white border-r border-gray-300 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#5c7cfa]">
                <h1 className="text-lg font-semibold text-[#3e5168]">계약서 작성 시스템</h1>
                <a href="https://github.com/Cjsarts0509/Contract-Creation-System" target="_blank" rel="noopener noreferrer" className="ml-auto text-gray-400 hover:text-black transition-colors" title="GitHub 저장소 이동">
                  <Github className="w-5 h-5" />
                </a>
              </div>
              <section className="mb-6">
                <h4 className="bg-[#5c7cfa] text-white px-4 py-2 text-sm font-medium mb-3">계약서 양식</h4>
                {ContractTypeButtons}
              </section>
              <section className="mb-6">
                <h4 className="bg-[#5c7cfa] text-white px-4 py-2 text-sm font-medium mb-3">매입처기본정보</h4>
                {BasicInfoInputs}
              </section>
              <section className="mb-6">
                <h4 className="bg-[#5c7cfa] text-white px-4 py-2 text-sm font-medium mb-3">매입처거래정보</h4>
                {TradeInfoInputs}
              </section>
              {ActionButtons}
            </div>
          </div>

          {/* --- [중앙: 에디터 패널] --- */}
          <div className="w-[50%] bg-gray-100 overflow-y-auto">
            <div className="sticky top-0 z-10 bg-gray-100 p-6 pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#3e5168]">계약서 내용</h3>
                <div className="flex gap-2">
                  <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 shadow-sm"><Undo className="w-4 h-4" /></button>
                  <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-50 shadow-sm"><Redo className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div ref={editorRef} contentEditable={true} suppressContentEditableWarning onInput={handleInput} className="contract-editor bg-white min-h-[800px] focus:outline-none shadow-sm" dangerouslySetInnerHTML={{ __html: '<div class="contract-page bg-white mx-auto shadow-sm border border-gray-200" style="width: 210mm; height: 297mm; padding: 25.4mm 19mm;"><p class="text-gray-400 text-center" style="margin-top: 120px;">매입처거래구분을 선택하면 계약서 양식이 표시됩니다.</p></div>' }} />
            </div>
          </div>

          {/* --- [우측: 서식 패널] --- */}
          <div className="w-[20%] bg-white border-l border-gray-300 overflow-y-auto p-6">
            <h3 className="text-lg font-semibold text-[#3e5168] mb-6">서식</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">폰트 크기</label>
              <div className="flex gap-2">
                <input type="number" value={fontSize} readOnly className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm bg-gray-50" placeholder="13" />
                <button onClick={() => changeFontSize(-1)} className="px-3 py-2 bg-[#5c7cfa] text-white rounded hover:bg-[#4c6cdf] text-sm w-10">-</button>
                <button onClick={() => changeFontSize(1)} className="px-3 py-2 bg-[#5c7cfa] text-white rounded hover:bg-[#4c6cdf] text-sm w-10">+</button>
              </div>
            </div>
            <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">폰트 스타일</label><div className="grid grid-cols-2 gap-2">{[{ value: 'normal', label: '보통' }, { value: 'bold', label: '굵게' }].map(({ value, label }) => (<button key={value} onClick={() => applyFontStyle(value)} className={`px-3 py-2 border rounded text-sm ${fontStyle === value ? 'bg-[#5c7cfa] text-white border-[#5c7cfa]' : 'bg-white text-gray-700 border-gray-300'}`} style={{ fontWeight: value === 'bold' ? '700' : 'normal' }}>{label}</button>))}</div></div>
            <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">텍스트 색상</label><div className="grid grid-cols-6 gap-1.5">{FONT_COLORS.map(color => (<button key={color} onClick={() => applyFontColor(color)} className="w-full aspect-square rounded border-2 hover:scale-110 transition-transform" style={{ backgroundColor: color, borderColor: fontColor === color ? '#5c7cfa' : '#d1d5db' }} title={color} />))}</div></div>
            <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">정렬</label><div className="grid grid-cols-3 gap-2">{[{ value: 'left', label: '좌측' }, { value: 'center', label: '가운데' }, { value: 'right', label: '우측' }].map(({ value, label }) => (<button key={value} onClick={() => applyTextAlign(value)} className={`px-3 py-2 border rounded text-sm ${textAlign === value ? 'bg-[#5c7cfa] text-white border-[#5c7cfa]' : 'bg-white text-gray-700 border-gray-300'}`}>{label}</button>))}</div></div>
            <div className="mb-6"><button onClick={insertTable} className="w-full bg-[#5c7cfa] text-white px-4 py-2 rounded hover:bg-[#4c6cdf] transition-colors text-sm font-medium">표 삽입</button></div>
            {selectedTable && (
              <div className="mb-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">표 편집</h4>
                <div className="grid grid-cols-2 gap-2 border-t pt-4">
                  <button onClick={addTableRow} className="px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 text-sm">+ 행</button>
                  <button onClick={removeTableRow} className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 text-sm">- 행</button>
                  <button onClick={addTableColumn} className="px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 text-sm">+ 열</button>
                  <button onClick={removeTableColumn} className="px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 text-sm">- 열</button>
                </div>
                {selectedCell && (<div className="mt-6 pt-4 border-t border-gray-200"><label className="block text-sm font-medium text-gray-700 mb-2">셀 배경색</label><div className="grid grid-cols-6 gap-1.5">{FONT_COLORS.map(color => (<button key={color} onClick={() => applyCellBgColor(color)} className="w-full aspect-square rounded border-2 hover:scale-110 transition-transform" style={{ backgroundColor: color, borderColor: cellBgColor === color ? '#5c7cfa' : '#d1d5db' }} title={color} />))}</div></div>)}
              </div>
            )}
          </div>
        </>
      )}

      {/* 모바일 레이아웃 */}
      {isMobile && (
        <div className="w-full flex flex-col h-[100dvh]">
          <Tabs value={mobileTab} onValueChange={(v: string) => setMobileTab(v as 'input' | 'preview')} className="flex flex-col h-full">
            <div className="bg-white border-b px-4 py-2 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-2">
                 <h1 className="text-lg font-bold text-[#3e5168]">계약서 시스템</h1>
                 <a href="https://github.com/Cjsarts0509/Contract-Creation-System" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors" title="GitHub 저장소 이동">
                   <Github className="w-5 h-5" />
                 </a>
               </div>
               <TabsList className="grid w-40 grid-cols-2">
                <TabsTrigger value="input">입력</TabsTrigger>
                <TabsTrigger value="preview">미리보기</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="input" className="flex-1 overflow-y-auto p-4 bg-gray-50 mt-0">
              <section className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-bold mb-4 border-b pb-2 text-[#5c7cfa]">계약서 양식</h4>
                {ContractTypeButtons}
              </section>
              <section className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-bold mb-4 border-b pb-2 text-[#5c7cfa]">기본 정보</h4>
                {BasicInfoInputs}
              </section>
              <section className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <h4 className="text-lg font-bold mb-4 border-b pb-2 text-[#5c7cfa]">거래 정보</h4>
                {TradeInfoInputs}
              </section>
              <div className="h-20"></div> {/* 하단 버튼 공간 확보 */}
              
              {/* 하단 고정 버튼 */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-2 z-40">
                 {ActionButtons}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden relative mt-0 bg-gray-200">
               <div className="absolute inset-0 overflow-auto p-4 flex justify-center items-start">
                  <div className="w-fit">
                    <div ref={editorRef} contentEditable={true} suppressContentEditableWarning onInput={handleInput} className="contract-editor bg-white min-h-[800px] shadow-lg origin-top scale-[0.8] md:scale-100" style={{ transformOrigin: 'top center' }} dangerouslySetInnerHTML={{ __html: currentEditorContent || '<div class="contract-page bg-white mx-auto shadow-sm border border-gray-200" style="width: 210mm; height: 297mm; padding: 25.4mm 19mm;"><p class="text-gray-400 text-center" style="margin-top: 120px;">매입처거래구분을 선택하면 계약서 양식이 표시됩니다.</p></div>' }} />
                  </div>
               </div>
               
               {/* 플로팅 액션 버튼 (FAB) */}
               <div className="fixed bottom-6 right-6 flex gap-3 z-50">
                  <button onClick={handleUndo} disabled={historyIndex <= 0} className="w-12 h-12 rounded-full bg-white shadow-lg border flex items-center justify-center text-gray-700 active:bg-gray-100"><Undo className="w-6 h-6"/></button>
                  <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="w-12 h-12 rounded-full bg-white shadow-lg border flex items-center justify-center text-gray-700 active:bg-gray-100"><Redo className="w-6 h-6"/></button>
                  <button onClick={handleSaveClick} className="w-14 h-14 rounded-full bg-[#51cf66] shadow-lg flex items-center justify-center text-white active:bg-[#40c057]"><Save className="w-7 h-7"/></button>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}