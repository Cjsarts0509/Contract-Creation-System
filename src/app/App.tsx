import { useState, useRef, useEffect, useCallback } from 'react';
import { getContractTemplate, ContractData } from './utils/contractTemplates';
import { CONTRACT_CONFIG } from './utils/contractConfig';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Undo, Redo, Printer, 
  RotateCcw, Check, Save, RefreshCw, AlertTriangle, Calendar, 
  ChevronLeft, ChevronRight, FileText, ImageIcon, X, Github
} from 'lucide-react';
import { useIsMobile } from './components/ui/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

// [중요] 스타일 파일 경로
import '../styles/fonts.css'; 

// ==========================================
// [상수] 설정 및 데이터
// ==========================================
const FONT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#CCCCCC', '#FFFFFF', // 무채색
  '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9900FF', '#FF00FF', // 원색/형광
  '#f87171', '#fbbf24', '#a3e635', '#38bdf8', '#818cf8', '#e879f9'  // 파스텔/밝은색
];

const PDF_CONFIG = {
  PAGE_WIDTH_MM: 210,
  PAGE_HEIGHT_MM: 297,
  MARGIN_TOP_MM: 20,
  MARGIN_BOTTOM_MM: 20,
  MARGIN_LEFT_MM: 15,
  MARGIN_RIGHT_MM: 15,
  MM_TO_PX: 3.78,
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
  const isMobileHook = useIsMobile();
   
  // 태블릿 감지 로직
  const [isDesktopLike, setIsDesktopLike] = useState(false);
  useEffect(() => {
    const checkDimensions = () => {
      setIsDesktopLike(window.innerWidth >= 768);
    };
    checkDimensions();
    window.addEventListener('resize', checkDimensions);
    return () => window.removeEventListener('resize', checkDimensions);
  }, []);

  const isMobile = isMobileHook && !isDesktopLike;

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

  const editorRef = useRef<HTMLDivElement | null>(null);
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
    
  const savedSelectionRef = useRef<Range | null>(null);
  const [mobileTab, setMobileTab] = useState<'input' | 'preview'>('input');
  
  const initialContent = '<div class="contract-page bg-white mx-auto shadow-sm border border-gray-200" style="width: 210mm; height: 297mm; padding: 25.4mm 19mm;"><p class="text-gray-400 text-center" style="margin-top: 120px;">매입처거래구분을 선택하면 계약서 양식이 표시됩니다.</p></div>';
  const [currentEditorContent, setCurrentEditorContent] = useState<string>(initialContent);

  // Callback Ref를 사용하여 에디터 마운트 시 내용 즉시 동기화
  const setEditorRef = useCallback((node: HTMLDivElement | null) => {
    editorRef.current = node; 
    if (node && currentEditorContent !== undefined && node.innerHTML !== currentEditorContent) {
      node.innerHTML = currentEditorContent;
    }
  }, [currentEditorContent]);

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
    const template = getContractTemplate(type, { ...basicInfo, tradePeriod: '', ...tradeInfo });
    setCurrentEditorContent(template);
    setHistory([template]);
    setHistoryIndex(0);
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
    setCurrentEditorContent(initialContent);
    setHistory([initialContent]); 
    setHistoryIndex(0); 
    setShowResetConfirm(false);
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
     
    setCurrentEditorContent(updated);
    addToHistory(updated);
     
    if (isMobile) {
      setMobileTab('preview');
    }
  };

  // ----------------------------------------------------------------------
  // 3. 에디터 히스토리 및 서식 도구
  // ----------------------------------------------------------------------
  const addToHistory = (content: string) => {
    if (isRestoringRef.current) return;
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(content);
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => (prev < 49 ? prev + 1 : 49));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isRestoringRef.current = true;
      const newIndex = historyIndex - 1;
      const content = history[newIndex];
      setCurrentEditorContent(content);
      setHistoryIndex(newIndex);
      setTimeout(() => { isRestoringRef.current = false; }, 10);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isRestoringRef.current = true;
      const newIndex = historyIndex + 1;
      const content = history[newIndex];
      setCurrentEditorContent(content);
      setHistoryIndex(newIndex);
      setTimeout(() => { isRestoringRef.current = false; }, 10);
    }
  };

  const handleInput = () => {
    if (isRestoringRef.current || !editorRef.current) return;
    const content = editorRef.current.innerHTML;
    setCurrentEditorContent(content);
    if (inputTimeoutRef.current) clearTimeout(inputTimeoutRef.current);
    inputTimeoutRef.current = setTimeout(() => { addToHistory(content); }, 500);
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (selection.rangeCount > 0) savedSelectionRef.current = range.cloneRange();
    let element = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer as HTMLElement;
    if (!editorRef.current?.contains(element)) return;
     
    const table = element?.closest('table') as HTMLTableElement;
    setSelectedTable(table || null);
    const cell = element?.closest('td') as HTMLTableCellElement;
    setSelectedCell(cell || null);
     
    if (element && editorRef.current?.contains(element)) {
      const computedStyle = window.getComputedStyle(element);
      setFontSize(parseInt(computedStyle.fontSize).toString());
      setFontColor(computedStyle.color);
      setTextAlign(computedStyle.textAlign);
      setFontStyle(parseInt(computedStyle.fontWeight) >= 700 ? 'bold' : 'normal');
    }
  };

  const applyCommand = (cmd: string, arg?: string) => { 
    document.execCommand(cmd, false, arg); 
    if(editorRef.current) { 
        const content = editorRef.current.innerHTML;
        setCurrentEditorContent(content);
        addToHistory(content);
    } 
  };
  const applyFontColor = (color: string) => { setFontColor(color); applyCommand('foreColor', color); };
  const applyCellBgColor = (color: string) => { 
      if(selectedCell) { 
          selectedCell.style.backgroundColor = color; 
          setCellBgColor(color); 
          if(editorRef.current) { 
            const content = editorRef.current.innerHTML;
            setCurrentEditorContent(content);
            addToHistory(content);
          } 
      }};
  const applyFontStyle = (style: string) => { setFontStyle(style); applyCommand(style === 'bold' ? 'bold' : 'removeFormat'); };
  const applyTextAlign = (align: string) => { setTextAlign(align); applyCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`); };
  
  const changeFontSize = (delta: number) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) { alert('텍스트를 먼저 택해주세요.'); return; }
    
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    let startNode = range.startContainer;
    let element = startNode.nodeType === Node.TEXT_NODE ? startNode.parentElement : startNode as HTMLElement;
    if (!element || !editorRef.current?.contains(element)) return;

    const currentStyle = window.getComputedStyle(element);
    const currentSize = parseInt(currentStyle.fontSize) || 13;
    const newSize = Math.max(8, Math.min(72, currentSize + delta));
    setFontSize(newSize.toString());

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
        const content = editorRef.current.innerHTML;
        setCurrentEditorContent(content);
        addToHistory(content);
    }
  };

  const changeTableSize = (type: 'width' | 'height', delta: number) => {
    if (!selectedTable) return;
    const current = type === 'width' ? selectedTable.offsetWidth : selectedTable.offsetHeight;
    selectedTable.style[type] = `${current + delta}px`;
    if (editorRef.current) { 
        const content = editorRef.current.innerHTML;
        setCurrentEditorContent(content);
        addToHistory(content);
    }
  };

  const changeCellSize = (type: 'width' | 'height', delta: number) => {
    if (!selectedCell) return;
    const current = type === 'width' ? selectedCell.offsetWidth : selectedCell.offsetHeight;
    selectedCell.style[type] = `${current + delta}px`;
    if (editorRef.current) { 
        const content = editorRef.current.innerHTML;
        setCurrentEditorContent(content);
        addToHistory(content);
    }
  };

  const insertTable = () => applyCommand('insertHTML', `<table class="contract-table editable-table" style="width:100%; border-collapse:collapse; margin:15px 0;"><tbody><tr><td style="border:1px solid #000; padding:8px;">Cell</td><td style="border:1px solid #000; padding:8px;">Cell</td></tr><tr><td style="border:1px solid #000; padding:8px;">Cell</td><td style="border:1px solid #000; padding:8px;">Cell</td></tr></tbody></table><br/>`);
  const addTableRow = () => { if(selectedTable) { const row = selectedTable.insertRow(); for(let i=0; i<selectedTable.rows[0].cells.length; i++) { const cell = row.insertCell(); cell.innerHTML='Cell'; cell.style.border='1px solid #000'; cell.style.padding='8px'; } } };
  const removeTableRow = () => { if(selectedTable && selectedTable.rows.length > 1) selectedTable.deleteRow(selectedTable.rows.length-1); };
  const addTableColumn = () => { if(selectedTable) { for(let i=0; i<selectedTable.rows.length; i++) { const cell = selectedTable.rows[i].insertCell(); cell.innerHTML='Cell'; cell.style.border='1px solid #000'; cell.style.padding='8px'; } } };
  const removeTableColumn = () => { if(selectedTable && selectedTable.rows[0].cells.length > 1) { for(let i=0; i<selectedTable.rows.length; i++) { selectedTable.rows[i].deleteCell(selectedTable.rows[i].cells.length-1); } } };

  // =================================================================
  // [핵심] PDF 저장 로직
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
    let sourceElement = editorRef.current;
    
    // 원본이 없으면 에디터 내용을 HTML 문자열에서 생성
    if (!sourceElement && currentEditorContent) {
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = currentEditorContent;
        sourceElement = tempContainer;
    }

    if (!sourceElement) return;

    try {
      const fileName = getFileName(format);
      
      // HTML 저장
      if (format === 'html') {
        const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${fileName}</title><style>body{font-family:sans-serif;line-height:1.5;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #000;padding:8px;}</style></head><body>${currentEditorContent}</body></html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setShowSaveModal(false);
        return;
      }
      
      // 로딩 표시
      document.body.style.cursor = 'wait';

      // 1. 페이지 분할 (PDF/JPG 공통)
      // 화면 밖 임시 컨테이너에 페이지별로 내용을 나눔
      const container = document.createElement('div');
      Object.assign(container.style, { position: 'fixed', top: '0', left: '-10000px', zIndex: '-1000', fontFamily: 'sans-serif', width: '210mm' });
      document.body.appendChild(container);

      const pages: HTMLDivElement[] = [];
      const createNewPage = () => {
        const page = document.createElement('div');
        page.className = 'contract-page';
        Object.assign(page.style, { width: `210mm`, height: `297mm`, padding: `20mm 15mm`, backgroundColor: '#ffffff', color: '#000000', boxSizing: 'border-box', overflow: 'hidden' });
        container.appendChild(page);
        pages.push(page);
        return page;
      };

      let currentPage = createNewPage();
      const MAX_HEIGHT_PX = (297 - 40) * 3.78; 
      let currentHeight = 0;
      
      // 에디터 내용 복사 및 페이지 분할
      const childNodes = Array.from((sourceElement.querySelector('.contract-page') || sourceElement).children) as HTMLElement[];
      for (const child of childNodes) {
        const clone = child.cloneNode(true) as HTMLElement;
        currentPage.appendChild(clone);
        if (currentHeight + clone.offsetHeight > MAX_HEIGHT_PX) {
          currentPage.removeChild(clone);
          currentPage = createNewPage();
          currentPage.appendChild(clone);
          currentHeight = clone.offsetHeight;
        } else {
          currentHeight += clone.offsetHeight;
        }
      }
      
      if (format === 'jpg') {
         // [원초적 해결] CSS 파싱 에러 방지: 
         // 1. 모든 요소의 Computed Style을 인라인 스타일로 박제
         // 2. Class 속성 제거 (외부 CSS 의존성 제거)
         // 3. Iframe을 생성하여 외부 CSS 파일 없이(No Stylesheet) 렌더링 후 캡처
         
         // 1 & 2. 스타일 박제 및 클래스 제거 함수
         const flattenStyles = (node: HTMLElement) => {
            const computed = window.getComputedStyle(node);
            
            // oklch to RGB 변환기
            const cvs = document.createElement('canvas');
            cvs.width = 1; cvs.height = 1;
            const ctx = cvs.getContext('2d');
            const toRgb = (val: string) => {
                if(!ctx || !val || (!val.includes('oklch') && !val.includes('oklab'))) return val;
                ctx.fillStyle = val;
                return ctx.fillStyle === 'rgba(0, 0, 0, 0)' && val !== 'transparent' ? val : ctx.fillStyle;
            };

            const properties = [
                'display', 'position', 'width', 'height', 'margin', 'padding', 'border',
                'border-top', 'border-bottom', 'border-left', 'border-right',
                'border-collapse', 'border-spacing',
                'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'color',
                'background', 'background-color',
                'text-align', 'vertical-align', 'line-height', 'white-space', 'word-break',
                'box-shadow', 'opacity', 'visibility', 'z-index'
            ];
            
            properties.forEach(prop => {
                let val = computed.getPropertyValue(prop);
                if(val && (val.includes('oklch') || val.includes('oklab'))) {
                    val = val.replace(/(oklch|oklab)\([^)]+\)/g, (m) => toRgb(m));
                }
                if(val) node.style.setProperty(prop, val, 'important');
            });

            node.removeAttribute('class');
            
            Array.from(node.children).forEach(child => {
                if(child instanceof HTMLElement) flattenStyles(child);
            });
         };

         // 임시 컨테이너에 대해 스타일 박제 수행
         flattenStyles(container);

         // 3. 격리된 Iframe 생성
         const iframe = document.createElement('iframe');
         Object.assign(iframe.style, { position: 'fixed', top: '-10000px', left: '-10000px', width: '210mm', height: (297 * pages.length) + 'mm', border: 'none' });
         document.body.appendChild(iframe);
         
         const doc = iframe.contentDocument || iframe.contentWindow?.document;
         if (!doc) throw new Error("Iframe error");

         // CSS 파일 링크 없이 순수 HTML(인라인 스타일 포함)만 주입
         doc.open();
         doc.write('<html><head><style>body { margin: 0; padding: 0; background: white; } * { box-sizing: border-box; }</style></head><body></body></html>');
         doc.close();
         
         // 박제된 컨테이너 내용을 Iframe Body로 이동
         doc.body.innerHTML = container.innerHTML;

         // 이미지 로딩 대기 등 안전장치
         await new Promise(r => setTimeout(r, 100));

         // 4. 캡처 수행 (Iframe 내부 대상)
         const canvas = await html2canvas(doc.body, { 
             scale: 2, 
             useCORS: true,
             backgroundColor: '#ffffff'
             // Iframe 내부에는 외부 CSS가 없으므로 ignoreElements 불필요
         });
         
         const link = document.createElement('a'); 
         link.download = fileName; 
         link.href = canvas.toDataURL('image/jpeg', 0.9); 
         link.click();
         
         document.body.removeChild(iframe);

      } else {
        // [유지] PDF 저장 로직 (건드리지 않음)
        const pdf = new jsPDF('p', 'mm', 'a4');
        for (let i = 0; i < pages.length; i++) {
          const canvas = await html2canvas(pages[i], { scale: 2, useCORS: true });
          if (i > 0) pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
        }
        pdf.save(fileName);
      }
      
      document.body.removeChild(container);
      document.body.style.cursor = 'default';
      setShowSaveModal(false);
      alert('저장이 완료되었습니다.');

    } catch (e: any) { 
        alert('저장 실패: ' + e.message); 
        document.body.style.cursor = 'default'; 
    }
  };

  const handleSaveClick = () => { 
    if (!currentEditorContent || currentEditorContent.includes('매입처거래구분을 선택하면')) { alert('내용이 없습니다.'); return; }
    if (isMobile) { if (confirm('PDF로 저장하시겠습니까?')) { executeSave('pdf'); } return; }
    setShowSaveModal(true); 
  };
   
  const handlePrint = () => { if (!currentEditorContent || currentEditorContent.includes('매입처거래구분을 선택하면')) { alert('내용이 없습니다.'); return; } window.print(); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isZ = e.key.toLowerCase() === 'z';
      const isY = e.key.toLowerCase() === 'y';
      if (e.ctrlKey || e.metaKey) {
        if (isZ && !e.shiftKey) { e.preventDefault(); handleUndo(); }
        else if ((isZ && e.shiftKey) || isY) { e.preventDefault(); handleRedo(); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [history, historyIndex]);

  // ----------------------------------------------------------------------
  // 4. 컴포넌트 렌더링
  // ----------------------------------------------------------------------
  return (
    // [수정] 인쇄 시 스타일 적용 (print:h-auto print:overflow-visible 등)
    <div className="h-screen w-full flex bg-gray-50 relative font-sans overflow-hidden print:h-auto print:overflow-visible print:block print:bg-white">
      
      {/* [수정] 인쇄 전용 스타일: @page margin 20mm 15mm로 설정하여 모든 페이지에 여백 적용 */}
      <style>{`
        @media print {
          @page { margin: 20mm 15mm; size: auto; }
          body { margin: 0; background-color: white; }
          .contract-page {
            width: 100% !important; /* A4 너비에 맞춤 */
            height: auto !important; /* 내용 길이에 따라 자동 확장 */
            min-height: auto !important;
            margin: 0 !important;
            padding: 0 !important; /* @page에서 여백을 처리하므로 여기선 제거 */
            border: none !important;
            box-shadow: none !important;
            overflow: visible !important;
          }
        }
      `}</style>
        
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm print:hidden">
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

      {showSaveModal && !isMobile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[400px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">저장 방식 선택</h3>
            <div className="space-y-3">
              <button onClick={() => executeSave('pdf')} className="w-full flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-all group">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"><FileText className="w-5 h-5 text-blue-600" /></div>
                <div className="text-left"><div className="font-medium text-gray-800">PDF로 저장</div><div className="text-xs text-gray-500">인쇄 및 배포용</div></div>
              </button>
              <button onClick={() => executeSave('jpg')} className="w-full flex items-center p-3 border rounded-lg hover:bg-green-50 transition-all group">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3"><ImageIcon className="w-5 h-5 text-green-600" /></div>
                <div className="text-left"><div className="font-medium text-gray-800">JPG 이미지로 저장</div><div className="text-xs text-gray-500">이미지로 저장</div></div>
              </button>
            </div>
            <button onClick={() => setShowSaveModal(false)} className="w-full mt-4 py-2 border rounded-md flex items-center justify-center gap-1"><X className="w-4 h-4" /> 취소</button>
          </div>
        </div>
      )}

      {warningModal.show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[320px] text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">입력 오류</h3>
            <p className="text-sm text-gray-500 mb-6">{warningModal.msg}</p>
            <button onClick={() => setWarningModal({ show: false, msg: '' })} className="w-full px-4 py-2 bg-[#5c7cfa] text-white rounded font-medium">확인</button>
          </div>
        </div>
      )}

      {calendarTarget && renderCalendar()}

      {!isMobile && (
        <>
          {/* [수정] 좌측 사이드바: 인쇄 시 숨김 */}
          <div className="w-[30%] h-full bg-white border-r border-gray-300 overflow-y-auto print:hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-[#5c7cfa]">
                <h1 className="text-lg font-semibold text-[#3e5168]">계약서 작성 시스템</h1>
                <a href="https://github.com/Cjsarts0509/Contract-Creation-System" target="_blank" rel="noopener noreferrer" className="ml-auto text-gray-400 hover:text-black transition-colors"><Github className="w-5 h-5" /></a>
              </div>
              
              <section className="mb-6">
                <h4 className="bg-[#5c7cfa] text-white px-4 py-2 text-sm font-medium mb-3">계약서 양식</h4>
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 gap-2'}`}>
                  {['direct', 'directPB', 'specific', 'specificDelivery', 'contractETC1', 'contractETC2', 'contractETC3', 'contractETC4', 'contractETC5', 'contractETC6'].map((type, idx) => (
                    <button key={type} onClick={() => handleContractTypeSelect(type)} className={`px-4 ${isMobile ? 'py-3 text-base' : 'py-2 text-sm'} rounded transition-colors ${contractType === type ? 'bg-[#5c7cfa] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {['직매입', '직매입(PB)', '특정매입', '특정매입(배송대행)', '???', '???', '???', '???', '???', '???'][idx]}
                    </button>
                  ))}
                </div>
              </section>

              <section className="mb-6">
                <h4 className="bg-[#5c7cfa] text-white px-4 py-2 text-sm font-medium mb-3">매입처기본정보</h4>
                <div className="space-y-2">
                  {[{ label: '매입처명', key: 'supplierName' }, { label: '대표이사', key: 'ceo' }, { label: '사업장주소', key: 'address' }].map((item) => (
                    <div key={item.key} className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-[150px_1fr] gap-2 items-center'}`}>
                      <label className={`bg-gray-50 px-3 py-2 text-sm text-gray-700 ${isMobile ? 'font-semibold' : ''}`}>{item.label}</label>
                      <input type="text" value={basicInfo[item.key as keyof typeof basicInfo]} onChange={(e) => handleBasicInfoChange(item.key, e.target.value)} className={`border border-gray-300 px-3 ${isMobile ? 'py-3' : 'py-2'} rounded text-sm focus:outline-none focus:border-[#5c7cfa]`} placeholder={`${item.label} 입력`} />
                    </div>
                  ))}
                  {[{ label: '계약일자', key: 'contractDate' }, { label: '거래시작일자', key: 'tradeStartDate' }, { label: '거래종료일자', key: 'tradeEndDate' }].map((item) => (
                    <div key={item.key} className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-[150px_1fr] gap-2 items-center'}`}>
                      <label className={`bg-gray-50 px-3 py-2 text-sm text-gray-700 ${isMobile ? 'font-semibold' : ''}`}>{item.label}</label>
                      <div className="relative flex items-center">
                        <input type="text" value={basicInfo[item.key as keyof typeof basicInfo]} placeholder="YYYY-MM-DD(-제외하고입력)" maxLength={10} onChange={(e) => handleDateChange(item.key as keyof typeof basicInfo, e.target.value)} onBlur={() => handleDateBlur(item.key as keyof typeof basicInfo)} className={`w-full border border-gray-300 px-3 ${isMobile ? 'py-3' : 'py-2'} rounded text-sm focus:outline-none focus:border-[#5c7cfa] pr-10`} />
                        <button onClick={() => setCalendarTarget(item.key as keyof typeof basicInfo)} className="absolute right-2 p-2 text-gray-400 hover:text-[#5c7cfa] transition-colors"><Calendar className="w-5 h-5"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="mb-6">
                <h4 className="bg-[#5c7cfa] text-white px-4 py-2 text-sm font-medium mb-3">매입처거래정보</h4>
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
              </section>

              <section className="flex flex-wrap gap-2">
                <button onClick={handleReset} className="flex-1 bg-gray-500 text-white px-3 py-2.5 rounded hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><RotateCcw className="w-4 h-4" />초기화</button>
                <button onClick={handleApply} className="flex-1 bg-[#5c7cfa] text-white px-3 py-2.5 rounded hover:bg-[#4c6cdf] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Check className="w-4 h-4" />적용</button>
                <button onClick={handleSaveClick} className="flex-1 bg-[#51cf66] text-white px-3 py-2.5 rounded hover:bg-[#40c057] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Save className="w-4 h-4" />저장</button>
                {!isMobile && <button onClick={handlePrint} className="flex-1 bg-[#EF5350] text-white px-3 py-2.5 rounded hover:bg-[#E53935] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Printer className="w-4 h-4" />인쇄</button>}
                <button onClick={() => setShowResetConfirm(true)} className="flex-1 bg-red-600 text-white px-3 py-2.5 rounded hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><RefreshCw className="w-4 h-4" /><span className="leading-none text-center">전체<br/>초기화</span></button>
              </section>
            </div>
          </div>

          {/* [수정] 중앙 영역: 인쇄 시 전체 화면 사용, absolute 제거하고 static으로 변경하여 페이지 흐름 따름 */}
          <div className="w-[50%] h-full bg-gray-100 flex flex-col relative print:w-full print:static print:h-auto print:block">
            {/* 고정된 헤더: 인쇄 시 숨김 */}
            <div className="px-6 py-4 flex justify-between items-center bg-gray-100 shrink-0 border-b border-gray-200 z-10 print:hidden">
              <h3 className="text-lg font-semibold text-[#3e5168]">계약서 내용</h3>
              <div className="flex gap-2">
                <button onMouseDown={(e) => e.preventDefault()} onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 bg-white border rounded shadow-sm disabled:opacity-30"><Undo className="w-4 h-4" /></button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 bg-white border rounded shadow-sm disabled:opacity-30"><Redo className="w-4 h-4" /></button>
              </div>
            </div>
            {/* 스크롤 가능한 에디터 영역: 인쇄 시 스크롤 해제 */}
            <div className="flex-1 overflow-y-auto p-6 print:overflow-visible print:p-0 print:m-0 print:h-auto">
              <div ref={setEditorRef} contentEditable={true} suppressContentEditableWarning onInput={handleInput} className="contract-editor bg-white min-h-[800px] focus:outline-none shadow-sm print:shadow-none print:min-h-0" />
            </div>
          </div>

          {/* [수정] 우측 사이드바: 인쇄 시 숨김 */}
          <div className="w-[20%] h-full bg-white border-l border-gray-300 overflow-y-auto p-6 print:hidden">
            <h3 className="text-lg font-semibold text-[#3e5168] mb-6">텍스트 서식</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">크기</label>
              <div className="flex gap-2">
                <input type="number" value={fontSize} readOnly className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm bg-gray-50" />
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeFontSize(-1)} className="px-3 py-2 bg-[#5c7cfa] text-white rounded text-sm w-10">-</button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeFontSize(1)} className="px-3 py-2 bg-[#5c7cfa] text-white rounded text-sm w-10">+</button>
              </div>
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">스타일</label>
                <div className="grid grid-cols-2 gap-2">
                    {[{ value: 'normal', label: '보통' }, { value: 'bold', label: '굵게' }].map(({ value, label }) => (
                        <button key={value} onMouseDown={(e) => e.preventDefault()} onClick={() => applyFontStyle(value)} className={`px-3 py-2 border rounded text-sm ${fontStyle === value ? 'bg-[#5c7cfa] text-white border-[#5c7cfa]' : 'bg-white text-gray-700 border-gray-300'}`} style={{ fontWeight: value === 'bold' ? '700' : 'normal' }}>{label}</button>
                    ))}
                </div>
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">색상</label>
                <div className="grid grid-cols-6 gap-1.5">
                    {FONT_COLORS.map(color => (
                        <button key={color} onMouseDown={(e) => e.preventDefault()} onClick={() => applyFontColor(color)} className="w-full aspect-square rounded border-2" style={{ backgroundColor: color, borderColor: fontColor === color ? '#5c7cfa' : '#d1d5db' }} />
                    ))}
                </div>
            </div>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
                <div className="grid grid-cols-3 gap-2">
                    {[{ value: 'left', label: '좌측' }, { value: 'center', label: '가운데' }, { value: 'right', label: '우측' }].map(({ value, label }) => (
                        <button key={value} onMouseDown={(e) => e.preventDefault()} onClick={() => applyTextAlign(value)} className={`px-3 py-2 border rounded text-sm ${textAlign === value ? 'bg-[#5c7cfa] text-white border-[#5c7cfa]' : 'bg-white text-gray-700 border-gray-300'}`}>{label}</button>
                    ))}
                </div>
            </div>
            <div className="mb-4">
                <button onMouseDown={(e) => e.preventDefault()} onClick={insertTable} className="w-full bg-[#5c7cfa] text-white px-4 py-2 rounded text-sm font-medium">표 삽입</button>
            </div>
             
            {selectedTable && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-2">표 전체 크기</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between bg-gray-50 border rounded p-1">
                      <span className="text-[10px] px-1 font-bold">너비</span>
                      <div className="flex">
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeTableSize('width', -10)} className="w-6 h-6 bg-white border rounded text-xs hover:bg-gray-100">-</button>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeTableSize('width', 10)} className="w-6 h-6 bg-white border rounded text-xs ml-1 hover:bg-gray-100">+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 border rounded p-1">
                      <span className="text-[10px] px-1 font-bold">높이</span>
                      <div className="flex">
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeTableSize('height', -10)} className="w-6 h-6 bg-white border rounded text-xs hover:bg-gray-100">-</button>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeTableSize('height', 10)} className="w-6 h-6 bg-white border rounded text-xs ml-1 hover:bg-gray-100">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedCell && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">선택된 셀 크기</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded p-1">
                        <span className="text-[10px] px-1 font-bold">너비</span>
                        <div className="flex">
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeCellSize('width', -5)} className="w-6 h-6 bg-white border rounded text-xs hover:bg-gray-100">-</button>
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeCellSize('width', 5)} className="w-6 h-6 bg-white border rounded text-xs ml-1 hover:bg-gray-100">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded p-1">
                        <span className="text-[10px] px-1 font-bold">높이</span>
                        <div className="flex">
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeCellSize('height', -5)} className="w-6 h-6 bg-white border rounded text-xs hover:bg-gray-100">-</button>
                          <button onMouseDown={(e) => e.preventDefault()} onClick={() => changeCellSize('height', 5)} className="w-6 h-6 bg-white border rounded text-xs ml-1 hover:bg-gray-100">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onMouseDown={(e) => e.preventDefault()} onClick={addTableRow} className="px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100">+ 행</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={removeTableRow} className="px-3 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100">- 행</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={addTableColumn} className="px-3 py-2 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100">+ 열</button>
                  <button onMouseDown={(e) => e.preventDefault()} onClick={removeTableColumn} className="px-3 py-2 bg-red-50 text-red-600 rounded text-sm font-medium hover:bg-red-100">- 열</button>
                </div>
                 
                {selectedCell && (
                    <div className="mt-4 pt-4 border-t">
                        <label className="block text-sm font-medium text-gray-700 mb-2">셀 배경색</label>
                        <div className="grid grid-cols-6 gap-1.5">
                            {FONT_COLORS.map(color => (
                                <button key={color} onMouseDown={(e) => e.preventDefault()} onClick={() => applyCellBgColor(color)} className="w-full aspect-square rounded border-2" style={{ backgroundColor: color, borderColor: cellBgColor === color ? '#5c7cfa' : '#d1d5db' }} />
                            ))}
                        </div>
                    </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {isMobile && (
        <div className="w-full flex flex-col h-[100dvh] print:hidden">
          <Tabs value={mobileTab} onValueChange={(v: string) => setMobileTab(v as 'input' | 'preview')} className="flex flex-col h-full">
            <div className="bg-white border-b px-4 py-2 flex items-center justify-between shrink-0">
               <h1 className="text-lg font-bold text-[#3e5168]">계약서 시스템</h1>
               <TabsList className="grid w-40 grid-cols-2">
                <TabsTrigger value="input">입력</TabsTrigger>
                <TabsTrigger value="preview">미리보기</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="input" className="flex-1 overflow-y-auto p-4 bg-gray-50 mt-0">
              <section className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 gap-2'}`}>
                  {['direct', 'directPB', 'specific', 'specificDelivery', 'contractETC1', 'contractETC2', 'contractETC3', 'contractETC4', 'contractETC5', 'contractETC6'].map((type, idx) => (
                    <button key={type} onClick={() => handleContractTypeSelect(type)} className={`px-4 ${isMobile ? 'py-3 text-base' : 'py-2 text-sm'} rounded transition-colors ${contractType === type ? 'bg-[#5c7cfa] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {['직매입', '직매입(PB)', '특정매입', '특정매입(배송대행)', '???', '???', '???', '???', '???', '???'][idx]}
                    </button>
                  ))}
                </div>
              </section>
              
              <section className="mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div className="space-y-2">
                  {[{ label: '매입처명', key: 'supplierName' }, { label: '대표이사', key: 'ceo' }, { label: '사업장주소', key: 'address' }].map((item) => (
                    <div key={item.key} className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-[150px_1fr] gap-2 items-center'}`}>
                      <label className={`bg-gray-50 px-3 py-2 text-sm text-gray-700 ${isMobile ? 'font-semibold' : ''}`}>{item.label}</label>
                      <input type="text" value={basicInfo[item.key as keyof typeof basicInfo]} onChange={(e) => handleBasicInfoChange(item.key, e.target.value)} className={`border border-gray-300 px-3 ${isMobile ? 'py-3' : 'py-2'} rounded text-sm focus:outline-none focus:border-[#5c7cfa]`} placeholder={`${item.label} 입력`} />
                    </div>
                  ))}
                  {[{ label: '계약일자', key: 'contractDate' }, { label: '거래시작일자', key: 'tradeStartDate' }, { label: '거래종료일자', key: 'tradeEndDate' }].map((item) => (
                    <div key={item.key} className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-[150px_1fr] gap-2 items-center'}`}>
                      <label className={`bg-gray-50 px-3 py-2 text-sm text-gray-700 ${isMobile ? 'font-semibold' : ''}`}>{item.label}</label>
                      <div className="relative flex items-center">
                        <input type="text" value={basicInfo[item.key as keyof typeof basicInfo]} placeholder="YYYY-MM-DD(-제외하고입력)" maxLength={10} onChange={(e) => handleDateChange(item.key as keyof typeof basicInfo, e.target.value)} onBlur={() => handleDateBlur(item.key as keyof typeof basicInfo)} className={`w-full border border-gray-300 px-3 ${isMobile ? 'py-3' : 'py-2'} rounded text-sm focus:outline-none focus:border-[#5c7cfa] pr-10`} />
                        <button onClick={() => setCalendarTarget(item.key as keyof typeof basicInfo)} className="absolute right-2 p-2 text-gray-400 hover:text-[#5c7cfa] transition-colors"><Calendar className="w-5 h-5"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="mb-6 bg-white p-4 rounded-lg shadow-sm">
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
              </section>
              <div className="h-24"></div>
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-2 z-40">
                  <button onClick={handleReset} className="flex-1 bg-gray-500 text-white px-3 py-2.5 rounded hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><RotateCcw className="w-4 h-4" />초기화</button>
                  <button onClick={handleApply} className="flex-1 bg-[#5c7cfa] text-white px-3 py-2.5 rounded hover:bg-[#4c6cdf] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Check className="w-4 h-4" />적용</button>
                  <button onClick={handleSaveClick} className="flex-1 bg-[#51cf66] text-white px-3 py-2.5 rounded hover:bg-[#40c057] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Save className="w-4 h-4" />저장</button>
                  {!isMobile && <button onClick={handlePrint} className="flex-1 bg-[#EF5350] text-white px-3 py-2.5 rounded hover:bg-[#E53935] transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><Printer className="w-4 h-4" />인쇄</button>}
                  <button onClick={() => setShowResetConfirm(true)} className="flex-1 bg-red-600 text-white px-3 py-2.5 rounded hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1.5"><RefreshCw className="w-4 h-4" /><span className="leading-none text-center">전체<br/>초기화</span></button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="flex-1 overflow-hidden relative mt-0 bg-gray-200">
               <div className="absolute inset-0 overflow-auto p-4 flex justify-center items-start">
                  <div className="w-fit">
                    <div ref={setEditorRef} contentEditable={true} suppressContentEditableWarning onInput={handleInput} className="contract-editor bg-white min-h-[800px] shadow-lg origin-top scale-[0.8]" style={{ transformOrigin: 'top center' }} />
                  </div>
               </div>
               <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
                  <button onClick={handleUndo} disabled={historyIndex <= 0} className="w-12 h-12 rounded-full bg-white shadow-lg border flex items-center justify-center disabled:opacity-30"><Undo className="w-6 h-6"/></button>
                  <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="w-12 h-12 rounded-full bg-white shadow-lg border flex items-center justify-center disabled:opacity-30"><Redo className="w-6 h-6"/></button>
                  <button onClick={() => setShowResetConfirm(true)} className="w-12 h-12 rounded-full bg-red-600 shadow-lg flex items-center justify-center text-white"><RefreshCw className="w-6 h-6"/></button>
                  <button onClick={handleSaveClick} className="w-14 h-14 rounded-full bg-[#51cf66] shadow-lg flex items-center justify-center text-white"><Save className="w-7 h-7"/></button>
               </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
