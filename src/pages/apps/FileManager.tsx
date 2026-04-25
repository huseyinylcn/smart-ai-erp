import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Folder, FileText, Image as ImageIcon,
  MoreVertical, Download, Share2, Trash2, 
  Search, Plus, LayoutGrid, List,
  HardDrive, Monitor, CheckCircle, Clock,
  File, FileSpreadsheet, Presentation, LayoutDashboard,
  Cloud, MonitorUp, Settings, FileBox, Filter
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const FileManager = () => {
  const { isFilterSidebarOpen, setIsFilterSidebarOpen, setFilterSidebarContent } = useOutletContext<any>();

  // State Management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentTab, setCurrentTab] = useState<'mydrive' | 'documents' | 'recycle'>('documents');
  
  // File System State
  const [files, setFiles] = useState([
    { id: 1, name: "Invoice_April_24.pdf", type: "PDF", size: "154 KB", date: "2026-04-10", creator: "Fuad M.", shared: "Bəli", icon: FileText, color: "text-rose-500", group: "doc" },
    { id: 2, name: "ERP_Architecture.png", type: "IMAGE", size: "2.4 MB", date: "2026-04-12", creator: "Aysel Q.", shared: "Xeyr", icon: ImageIcon, color: "text-amber-500", group: "img" },
    { id: 3, name: "Budget_Plan_Q3.xlsx", type: "XLS", size: "1.2 MB", date: "2026-04-15", creator: "Kamran Q.", shared: "Bəli", icon: FileSpreadsheet, color: "text-emerald-500", group: "doc" },
    { id: 4, name: "Onboarding_Video.mp4", type: "VIDEO", size: "145 MB", date: "2026-04-20", creator: "Murad E.", shared: "Xeyr", icon: Monitor, color: "text-indigo-500", group: "vid" }
  ]);

  const [folders, setFolders] = useState([
    { id: 'f1', name: 'Uploaded files', count: 4, size: '148.7 MB' },
    { id: 'f2', name: 'Maliyyə Sənədləri', count: 12, size: '15.2 MB' }
  ]);

  // Filter States
  const [quickSearch, setQuickSearch] = useState('');
  const [searchCreator, setSearchCreator] = useState('ALL');
  const [searchGroup, setSearchGroup] = useState('ALL');

  // File Input Ref for native upload simulation
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.altKey && e.code === 'KeyF') {
            e.preventDefault();
            setIsFilterSidebarOpen((prev: boolean) => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsFilterSidebarOpen]);

  // Global Filter Panel Setup
  useEffect(() => {
    if (isFilterSidebarOpen) {
      setFilterSidebarContent(
        <div className="space-y-6 animate-in slide-in-from-right duration-300 pb-20">
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Yaradan Şəxs</label>
              <select 
                 value={searchCreator}
                 onChange={(e) => setSearchCreator(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">BÜTÜN ƏMƏKDAŞLAR</option>
                  <option value="Fuad M.">Fuad M.</option>
                  <option value="Aysel Q.">Aysel Q.</option>
                  <option value="Kamran Q.">Kamran Q.</option>
                  <option value="Murad E.">Murad E.</option>
                  <option value="Siz">Siz</option>
              </select>
           </div>
           
           <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100 pb-2 block">Fayl Növü</label>
              <select 
                 value={searchGroup}
                 onChange={(e) => setSearchGroup(e.target.value)}
                 className="w-full bg-slate-50 border-none rounded-xl py-4 px-5 text-xs font-black italic outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all uppercase text-slate-700 appearance-none cursor-pointer"
              >
                  <option value="ALL">BÜTÜN FAYLLAR</option>
                  <option value="doc">SƏNƏDLƏR VƏ CƏDVƏLLƏR</option>
                  <option value="img">ŞƏKİLLƏR</option>
                  <option value="vid">VİDEOLAR</option>
              </select>
           </div>
           
           <div className="pt-6">
             <button 
               onClick={() => {
                 setSearchCreator('ALL');
                 setSearchGroup('ALL');
               }}
               className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200 italic"
             >
               Filtrləri Sıfırla
             </button>
           </div>
        </div>
      );
    }
  }, [isFilterSidebarOpen, searchCreator, searchGroup, setFilterSidebarContent]);

  const filteredFiles = useMemo(() => {
     return files.filter(f => {
         if (quickSearch && !f.name.toLowerCase().includes(quickSearch.toLowerCase())) return false;
         if (searchCreator !== 'ALL' && f.creator !== searchCreator) return false;
         if (searchGroup !== 'ALL' && f.group !== searchGroup) return false;
         return true;
     });
  }, [files, quickSearch, searchCreator, searchGroup]);

  // Action Handlers
  const handleCreateDocument = (type: string) => {
     const nextId = Math.max(...files.map(f => f.id), 0) + 1;
     let newFile: any = { id: nextId, creator: "Siz", shared: "Xeyr", date: new Date().toISOString().split('T')[0] };

     if (type === 'DOC') {
        newFile = { ...newFile, name: `Yeni_Sənəd_${nextId}.docx`, type: "DOC", size: "12 KB", icon: File, color: "text-blue-500", group: "doc" };
     } else if (type === 'XLS') {
        newFile = { ...newFile, name: `Yeni_Cədvəl_${nextId}.xlsx`, type: "XLS", size: "18 KB", icon: FileSpreadsheet, color: "text-emerald-500", group: "doc" };
     } else if (type === 'PPT') {
        newFile = { ...newFile, name: `Təqdimat_${nextId}.pptx`, type: "PPT", size: "35 KB", icon: Presentation, color: "text-amber-500", group: "doc" };
     } else if (type === 'BOARD') {
        newFile = { ...newFile, name: `Whiteboard_${nextId}.board`, type: "BOARD", size: "5 KB", icon: LayoutDashboard, color: "text-indigo-500", group: "doc" };
     }

     setFiles([newFile, ...files]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const nextId = Math.max(...files.map(f => f.id), 0) + 1;
        const sizeKB = Math.round(file.size / 1024);
        const displaySize = sizeKB > 1024 ? `${(sizeKB/1024).toFixed(1)} MB` : `${sizeKB} KB`;
        
        let fileGroup = "doc";
        let color = "text-slate-500";
        let icon = FileBox;

        if (file.type.startsWith('image/')) { fileGroup = 'img'; color = 'text-amber-500'; icon = ImageIcon; }
        else if (file.type.startsWith('video/')) { fileGroup = 'vid'; color = 'text-indigo-500'; icon = Monitor; }
        else if (file.name.endsWith('pdf')) { color = 'text-rose-500'; icon = FileText; }

        setFiles([
           { id: nextId, name: file.name, type: file.name.split('.').pop()?.toUpperCase() || 'FILE', size: displaySize, date: new Date().toISOString().split('T')[0], creator: "Siz", shared: "Xeyr", icon: icon, color: color, group: fileGroup },
           ...files
        ]);

        // reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
     }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-700 font-sans text-slate-800 dark:text-slate-100 italic-none">
       {/* Native hidden file input */}
       <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

       {/* HEADER & MAIN NAVIGATION */}
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-6">
             <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight italic tabular-nums">
                {currentTab === 'mydrive' ? 'Mənim Yaddaşım (Drive)' : currentTab === 'documents' ? 'Sənədlər (Documents)' : 'Zibil Qutusu'}
             </h1>
             
             {/* Dynamic Add Button */}
             <div className="relative group/dropdown hover:z-50 shadow-sm">
                <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 dark:bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 italic">
                   <Plus className="w-4 h-4" />
                   <span>{currentTab === 'documents' ? 'Yeni Sənəd' : '+ Əlavə Et'}</span>
                </button>
                {/* Dropdown simulate */}
                <div className="absolute top-12 left-0 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 p-2 transform origin-top [transform:rotateX(12deg)] group-hover/dropdown:rotate-0">
                   {currentTab === 'documents' && (
                     <>
                        <button onClick={() => handleCreateDocument('DOC')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold font-sans italic text-slate-600 dark:text-slate-300 transition-colors">📄 Word Sənədi</button>
                        <button onClick={() => handleCreateDocument('XLS')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold font-sans italic text-slate-600 dark:text-slate-300 transition-colors">📊 Excel Cədvəli</button>
                        <button onClick={() => handleCreateDocument('PPT')} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold font-sans italic text-slate-600 dark:text-slate-300 transition-colors">📈 Təqdimat</button>
                     </>
                   )}
                   <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                   <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold font-sans italic text-indigo-600 transition-colors flex items-center"><MonitorUp className="w-3.5 h-3.5 mr-2" /> Kompüterdən Yüklə</button>
                </div>
             </div>
          </div>

          <div className="flex items-center space-x-4">
             {/* Sub Navigation */}
             <div className="hidden md:flex items-center space-x-1 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-in zoom-in-95">
                <button onClick={() => setCurrentTab('mydrive')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${currentTab === 'mydrive' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50'}`}>My Drive</button>
                <button onClick={() => setCurrentTab('documents')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${currentTab === 'documents' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-400 hover:text-indigo-500 hover:bg-slate-50'}`}>Sənədlər</button>
                <button onClick={() => setCurrentTab('recycle')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${currentTab === 'recycle' ? 'bg-rose-50 text-rose-500 shadow-inner' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'}`}>Recycle Bin</button>
             </div>

             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                   type="text" 
                   value={quickSearch}
                   onChange={e => setQuickSearch(e.target.value)}
                   placeholder="Fayl və sənəd axtar..." 
                   className="w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-[11px] font-black italic shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none uppercase"
                />
             </div>
             
             <button 
                 onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)} 
                 className={`p-3 rounded-2xl shadow-sm transition-all border ${isFilterSidebarOpen || searchCreator !== 'ALL' || searchGroup !== 'ALL' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 translate-y-[-2px] border-indigo-600' : 'bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200'}`}
                 title="Zəngin Süzgəc (Alt + F)"
             >
                 <Filter className="w-5 h-5 transition-transform" />
             </button>

             <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><Settings className="w-5 h-5"/></button>
          </div>
       </div>

       {/* MAIN WORKSPACE */}
       <div className="flex-1 overflow-y-auto custom-scrollbar pt-8 pb-20">
          
          {/* FOLDERS VIEW (If My Drive is selected) */}
          {currentTab === 'mydrive' && (
             <section className="animate-in slide-in-from-left duration-500 mb-10">
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                     {folders.map(folder => (
                        <div key={folder.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all cursor-pointer flex flex-col items-center justify-center aspect-square text-center">
                            <div className="text-cyan-400 dark:text-cyan-500 mb-4 group-hover:scale-110 group-hover:text-cyan-500 transition-transform">
                                <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg">
                                   <path d="M10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z" />
                                </svg>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase truncate w-full italic group-hover:text-indigo-600">{folder.name}</h4>
                        </div>
                     ))}
                 </div>
             </section>
          )}

          {/* DOCUMENTS CREATION CAROUSEL (If Documents is selected) */}
          {currentTab === 'documents' && (
             <section className="mb-10 animate-in slide-in-from-right duration-500">
                <div className="flex items-center space-x-6 overflow-x-auto custom-scrollbar pb-6 pt-2 px-1">
                    
                    {/* CREATE GROUP */}
                    <div className="flex space-x-1 border-r-2 border-slate-100 dark:border-slate-800 pr-6 shrink-0 relative">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] uppercase font-black tracking-widest text-slate-300 italic">Create</div>
                        
                        <div onClick={() => handleCreateDocument('DOC')} className="group w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-200 transition-all cursor-pointer aspect-square ml-4">
                           <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:-translate-y-2 transition-transform">
                              <span className="text-[14px] font-black z-10 font-sans tracking-widest">DOC</span>
                              <div className="absolute bottom-[-10px] w-full h-1/2 bg-blue-100 dark:bg-blue-800/50"></div>
                           </div>
                           <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-md -mt-8 mb-3 z-20 group-hover:bg-blue-600"><Plus className="w-4 h-4"/></span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Document</span>
                        </div>

                        <div onClick={() => handleCreateDocument('XLS')} className="group w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-2xl hover:shadow-emerald-500/15 hover:border-emerald-200 transition-all cursor-pointer aspect-square ml-2">
                           <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:-translate-y-2 transition-transform">
                              <span className="text-[14px] font-black z-10 font-sans tracking-widest">XLS</span>
                              <div className="absolute bottom-[-10px] w-full h-1/2 bg-emerald-100 dark:bg-emerald-800/50"></div>
                           </div>
                           <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md -mt-8 mb-3 z-20 group-hover:bg-emerald-600"><Plus className="w-4 h-4"/></span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Spreadsheet</span>
                        </div>

                        <div onClick={() => handleCreateDocument('PPT')} className="group w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-2xl hover:shadow-amber-500/15 hover:border-amber-200 transition-all cursor-pointer aspect-square ml-2">
                           <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:-translate-y-2 transition-transform">
                              <span className="text-[14px] font-black z-10 font-sans tracking-widest">PPT</span>
                              <div className="absolute bottom-[-10px] w-full h-1/2 bg-amber-100 dark:bg-amber-800/50"></div>
                           </div>
                           <span className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md -mt-8 mb-3 z-20 group-hover:bg-amber-600"><Plus className="w-4 h-4"/></span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Presentation</span>
                        </div>

                        <div onClick={() => handleCreateDocument('BOARD')} className="group w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-2xl hover:shadow-indigo-500/15 hover:border-indigo-200 transition-all cursor-pointer aspect-square ml-2 border-r-2 border-r-slate-100">
                           <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden group-hover:-translate-y-2 transition-transform border border-indigo-100">
                              <span className="text-[16px] font-black z-10 font-sans tracking-widest flex items-center"><LayoutDashboard className="w-6 h-6"/></span>
                           </div>
                           <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-md -mt-8 mb-3 z-20 group-hover:bg-indigo-600"><Plus className="w-4 h-4"/></span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Board</span>
                        </div>
                    </div>

                    {/* OPEN GROUP */}
                    <div className="flex space-x-1 pl-6 shrink-0 relative">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] uppercase font-black tracking-widest text-slate-300 italic">Open</div>
                        
                        <div onClick={() => fileInputRef.current?.click()} className="group w-44 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-inner hover:shadow-sm transition-all cursor-pointer aspect-square ml-4">
                           <HardDrive className="w-10 h-10 text-slate-400 mb-4 group-hover:-translate-y-1 transition-transform group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Open from my computer</span>
                        </div>

                        <div className="group w-44 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-inner hover:shadow-sm transition-all cursor-pointer aspect-square ml-2 opacity-70 hover:opacity-100">
                           <Cloud className="w-10 h-10 text-slate-400 mb-4 group-hover:-translate-y-1 transition-transform" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Open from Google Drive</span>
                        </div>
                        
                        <div className="group w-44 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center shadow-inner hover:shadow-sm transition-all cursor-pointer aspect-square ml-2 opacity-70 hover:opacity-100">
                           <div className="w-10 h-10 flex items-center justify-center text-3xl font-black font-sans text-slate-400 mb-4 group-hover:-translate-y-1 transition-transform">G</div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Select from Google Docs</span>
                        </div>
                    </div>
                </div>
             </section>
          )}

          {/* FILES LIST/GRID VIEW */}
          <section className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm min-h-[400px]">
              {/* VIEW Toggles */}
              <div className="flex items-center justify-between mb-6 px-4">
                  <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-inner p-1">
                     <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600' : 'text-slate-400'}`}>List</button>
                     <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-600' : 'text-slate-400'}`}>Grid</button>
                     <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all text-slate-300 pointer-events-none">Tile</button>
                  </div>
              </div>

              {filteredFiles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <div className="w-24 h-24 border-4 border-dashed border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center mb-6">
                         <span className="text-4xl font-black italic">i</span>
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest italic tracking-tighter text-center max-w-sm">Tapşırığa uyğun fayl tapılmadı və ya qovluq boşdur!</p>
                  </div>
              ) : (
                  <>
                      {viewMode === 'list' ? (
                          <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-50 dark:border-slate-800/50">
                                       <th className="p-4 cursor-pointer hover:text-indigo-500">Fayl Adı</th>
                                       <th className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-500 cursor-pointer">Active v</th>
                                       <th className="p-4 cursor-pointer hover:text-indigo-500">Yaradılıb</th>
                                       <th className="p-4">Paylaşılıb</th>
                                       <th className="p-4 text-right">Settings</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {filteredFiles.map((file) => (
                                       <tr key={file.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer">
                                          <td className="p-4 flex items-center">
                                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm ${file.color}`}>
                                                 <file.icon className="w-5 h-5 stroke-[2px]" />
                                              </div>
                                              <div>
                                                 <p className="text-[12px] font-bold text-slate-800 dark:text-white uppercase italic tracking-tighter hover:text-indigo-600 hover:underline">{file.name}</p>
                                                 <p className="text-[9px] font-bold text-slate-400 uppercase italic opacity-0 group-hover:opacity-100 transition-opacity">Size: {file.size}</p>
                                              </div>
                                          </td>
                                          <td className="p-4 text-[11px] font-bold text-slate-500 font-sans italic">{file.date}</td>
                                          <td className="p-4 text-[11px] font-bold text-slate-500 font-sans italic">{file.creator}</td>
                                          <td className="p-4">
                                              <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase italic ${file.shared === 'Bəli' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>{file.shared}</span>
                                          </td>
                                          <td className="p-4 text-right">
                                              <button className="p-2 text-slate-300 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"><MoreVertical className="w-4 h-4"/></button>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                          </div>
                      ) : (
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 pt-4">
                              {filteredFiles.map((file) => (
                                 <div key={file.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center justify-center text-center">
                                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm ${file.color} group-hover:scale-110 transition-transform`}>
                                         <file.icon className="w-7 h-7 stroke-[2px]" />
                                      </div>
                                      <h4 className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase truncate w-full italic group-hover:text-indigo-600 tracking-widest">{file.name}</h4>
                                      <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          {file.size}
                                      </div>
                                 </div>
                              ))}
                          </div>
                      )}
                  </>
              )}
          </section>

       </div>
    </div>
  );
};

export default FileManager;
