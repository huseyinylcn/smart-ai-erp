import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Minimize, Maximize2 } from 'lucide-react';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import Header from './Header';
import MiniSidebar from './MiniSidebar';
import AIAssistantSidebar from './ai/AIAssistantSidebar';
import FilterSidebar from './hr/FilterSidebar';
import ModuleNav from './ModuleNav';

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isContentFullscreen, setIsContentFullscreen] = useState(false);
  
  // Filter Sidebar State
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [filterSidebarContent, setFilterSidebarContent] = useState<React.ReactNode>(null);

  // Keyboard Navigation State
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [navPath, setNavPath] = useState<string[]>([]);
  
  // Refs to avoid stale closures in event listeners
  const isAltPressedRef = useRef(false);
  const navPathRef = useRef<string[]>([]);

  // Sync refs with state
  useEffect(() => { isAltPressedRef.current = isAltPressed; }, [isAltPressed]);
  useEffect(() => { navPathRef.current = navPath; }, [navPath]);

  // Initial Load (Dark Mode & Sidebar State)
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) setIsSidebarCollapsed(saved === 'true');
  }, []);

  // Sync dark mode with DOM and LocalStorage
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persistence for Sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  // PANEL CONTROLLERS (Wrapped in useCallback to be stable for Effect deps)
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const newState = !prev;
      // If opening left sidebar, close everything else
      if (!newState) {
        setIsRightSidebarCollapsed(true);
        window.dispatchEvent(new CustomEvent('close-add-new-dropdown'));
      }
      return newState;
    });
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setIsRightSidebarCollapsed(prev => {
      const newState = !prev;
      // If opening report bar, close everything else
      if (!newState) {
        setIsSidebarCollapsed(true);
        window.dispatchEvent(new CustomEvent('close-add-new-dropdown'));
      }
      return newState;
    });
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const closeAllPanels = useCallback(() => {
    setIsSidebarCollapsed(true);
    setIsRightSidebarCollapsed(true);
    setIsFilterSidebarOpen(false);
    setIsContentFullscreen(false);
    setNavPath([]);
    window.dispatchEvent(new CustomEvent('close-add-new-dropdown'));
  }, []);

  // Keyboard Shortcuts & Alt Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Track Alt key for Hints
      if (e.key === 'Alt') {
        e.preventDefault();
        setIsAltPressed(true);
      }

      // Escape key behavior
      if (e.key === 'Escape') {
        closeAllPanels();
      }
      
      // Sequential navigation (e.g. Alt + 3)
      const reservedKeys = ['s', 'd', 'r', 'e', 'u', 'f', 'n', 'p', 'b', 'k', 'l', 'c', 'a'];
      if (isAltPressedRef.current && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !reservedKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        const newKey = e.key.toUpperCase();
        setNavPath(prev => [...prev, newKey]);
      }

      // --- GLOBAL SHORTCUTS (Alt + Key) ---
      if (e.altKey) {
        // Simple Toggles
        if (e.code === 'KeyS') { e.preventDefault(); toggleSidebar(); }
        if (e.code === 'KeyD') { e.preventDefault(); toggleDarkMode(); }
        if (e.code === 'KeyR') { e.preventDefault(); toggleRightSidebar(); }
        if (e.code === 'KeyE') { e.preventDefault(); setIsContentFullscreen(prev => !prev); }
        if (e.code === 'KeyU') {
          e.preventDefault();
          if (!document.fullscreenElement) document.documentElement.requestFullscreen();
          else document.exitFullscreen();
        }
        
        // Navigation / Modals
        if (e.code === 'KeyK') { e.preventDefault(); navigate('/settings'); }
        if (e.code === 'KeyL') { e.preventDefault(); window.dispatchEvent(new CustomEvent('toggle-header-lang')); }
        if (e.code === 'KeyA' && !e.defaultPrevented) { 
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('global-search-focus')); 
        }

        // Add New (Exclusive logic)
        if (e.code === 'KeyN' && !e.defaultPrevented) {
          setIsSidebarCollapsed(true);
          setIsRightSidebarCollapsed(true);
          window.dispatchEvent(new CustomEvent('global-new-document', { cancelable: true }));
        }

        // Filter (Specific for pages like Hire Registry)
        if (e.code === 'KeyF' && !e.defaultPrevented) {
          setIsSidebarCollapsed(true);
          setIsRightSidebarCollapsed(true);
          // F-shortcut is usually handled local within pages via Outlet context
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        setIsAltPressed(false);
        // Clear path slightly later for visuals
        setTimeout(() => {
          if (isAltPressedRef.current === false) setNavPath([]);
        }, 800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [navigate, toggleSidebar, toggleRightSidebar, toggleDarkMode, closeAllPanels]);

  // Global Event Listener for Header communication
  useEffect(() => {
    const handleToggleAddNew = () => {
        setIsSidebarCollapsed(true);
        setIsRightSidebarCollapsed(true);
    };
    window.addEventListener('toggle-add-new-dropdown', handleToggleAddNew);
    return () => window.removeEventListener('toggle-add-new-dropdown', handleToggleAddNew);
  }, []);

  return (
    <div className={`flex h-screen bg-[#F8F9FA] dark:bg-slate-950 overflow-hidden font-sans text-slate-800 dark:text-slate-200 selection:bg-primary-100 ${isDarkMode ? 'dark' : ''}`}>
      {!isContentFullscreen && !isFilterSidebarOpen && <MiniSidebar />}
      {!isContentFullscreen && !isFilterSidebarOpen && (
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar} 
          isAltPressed={isAltPressed}
          navPath={navPath}
          setNavPath={setNavPath}
        />
      )}
      
      {isFilterSidebarOpen && (
        <FilterSidebar 
          content={filterSidebarContent} 
          onClose={() => setIsFilterSidebarOpen(false)} 
        />
      )}

      <div className="flex flex-col flex-1 bg-[#f8f9fa] dark:bg-slate-900 transition-all duration-500 overflow-hidden relative">
        {!isContentFullscreen && (
          <Header 
            toggleSidebar={toggleSidebar} 
            toggleRightSidebar={toggleRightSidebar} 
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            isContentFullscreen={isContentFullscreen}
            setIsContentFullscreen={setIsContentFullscreen}
            isAltPressed={isAltPressed}
            navPath={navPath}
            setNavPath={setNavPath}
          />
        )}
        
        {!isContentFullscreen && <ModuleNav />}
        
        <main className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar relative z-0 text-[1.05em] transition-all duration-500 ${isContentFullscreen ? 'p-0 h-screen' : 'p-6 lg:p-8'} ${(!isSidebarCollapsed && !isContentFullscreen) ? 'ml-0' : ''} ${(!isRightSidebarCollapsed && !isContentFullscreen) ? 'pr-[320px]' : ''}`}>
          <Outlet context={{ 
            isContentFullscreen, 
            setIsContentFullscreen,
            isSidebarCollapsed,
            setIsSidebarCollapsed,
            toggleSidebar,
            toggleRightSidebar,
            isDarkMode,
            toggleDarkMode,
            isFilterSidebarOpen,
            setIsFilterSidebarOpen,
            setFilterSidebarContent,
            isAltPressed,
            navPath,
            setNavPath
          }} />
        </main>
      </div>
      
      {!isContentFullscreen && (
        <RightSidebar 
          isCollapsed={isRightSidebarCollapsed} 
          setCollapsed={setIsRightSidebarCollapsed} 
          isAltPressed={isAltPressed}
          navPath={navPath}
          setNavPath={setNavPath}
        />
      )}
      <AIAssistantSidebar />
    </div>
  );
};

export default Layout;
