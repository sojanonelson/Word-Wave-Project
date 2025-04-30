import React, { useState, useEffect } from "react";
import { Trash2, Database, RefreshCw, Settings, AlertTriangle, Check, Info, HardDrive } from "lucide-react";

const Admin = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clearOptions, setClearOptions] = useState({
    userPreferences: true,
    savedDocuments: true,
    recentHistory: true,
    cachedData: true
  });
  const [systemStats, setSystemStats] = useState({
    storageUsed: "Calculating...",
    itemCount: 0,
    documentsStored: 0,
    lastBackup: "Never",
    activeSessions: 1
  });
  
  // Calculate localStorage usage
  useEffect(() => {
    calculateStorageStats();
  }, []);
  
  const calculateStorageStats = () => {
    try {
      // Get all localStorage data
      let totalSize = 0;
      let documentCount = 0;
      const items = { ...localStorage };
      const itemCount = Object.keys(items).length;
      
      // Calculate total size
      Object.keys(items).forEach(key => {
        const value = items[key];
        // Calculate bytes for this item (key + value)
        const bytes = new Blob([key]).size + new Blob([value]).size;
        totalSize += bytes;
        
        // Count items that look like documents
        if (key.includes('document') || key.includes('doc') || 
            (value.includes('content') && value.includes('title'))) {
          documentCount++;
        }
      });
      
      // Format size
      let formattedSize;
      if (totalSize < 1024) {
        formattedSize = `${totalSize} B`;
      } else if (totalSize < 1024 * 1024) {
        formattedSize = `${(totalSize / 1024).toFixed(2)} KB`;
      } else {
        formattedSize = `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
      }
      
      setSystemStats({
        ...systemStats,
        storageUsed: formattedSize,
        itemCount: itemCount,
        documentsStored: documentCount
      });
    } catch (error) {
      console.error("Error calculating storage stats:", error);
      setSystemStats({
        ...systemStats,
        storageUsed: "Error calculating"
      });
    }
  };

  const handleOptionToggle = (option) => {
    setClearOptions({
      ...clearOptions,
      [option]: !clearOptions[option]
    });
  };

  const handleClearData = () => {
    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const confirmClear = () => {
    // Selectively clear data based on options
    if (clearOptions.userPreferences) {
      // Clear preference-related items
      Object.keys(localStorage).forEach(key => {
        if (key.includes('pref') || key.includes('setting') || key.includes('config')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    if (clearOptions.savedDocuments) {
      // Clear document-related items
      Object.keys(localStorage).forEach(key => {
        if (key.includes('document') || key.includes('doc') || key.includes('content')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    if (clearOptions.recentHistory) {
      // Clear history-related items
      Object.keys(localStorage).forEach(key => {
        if (key.includes('history') || key.includes('recent') || key.includes('activity')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    if (clearOptions.cachedData) {
      // Clear cache-related items
      Object.keys(localStorage).forEach(key => {
        if (key.includes('cache') || key.includes('temp')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    // If all options are selected, just clear everything
    if (Object.values(clearOptions).every(Boolean)) {
      localStorage.clear();
    }
    
    // Hide confirmation dialog
    setShowConfirmation(false);
    
    // Show success message
    setShowSuccess(true);
    
    // Update system stats after clearing
    calculateStorageStats();
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  const cancelClear = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <HardDrive className="h-6 w-6" />
            <h1 className="text-2xl font-bold">WordWave Admin</h1>
            <span className="bg-white text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
              localStorage:3000
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <span>System Management</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left panel - System Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" /> 
              System Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Storage Used:</span>
                <span className="font-medium">{systemStats.storageUsed}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Total Items:</span>
                <span className="font-medium">{systemStats.itemCount}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Documents Stored:</span>
                <span className="font-medium">{systemStats.documentsStored}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Last Backup:</span>
                <span className="font-medium">{systemStats.lastBackup}</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-gray-600">Active Sessions:</span>
                <span className="font-medium">{systemStats.activeSessions}</span>
              </div>
              
              {/* Storage quota information */}
              <div className="mt-4 pt-2 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Storage Usage</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(parseInt(systemStats.storageUsed) || 0, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>Used: {systemStats.storageUsed}</span>
                  <span>Limit: 5 MB</span>
                </div>
              </div>
            </div>
            <button 
              onClick={calculateStorageStats}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Statistics
            </button>
          </div>

          {/* Middle panel - Data Management */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Data Management</h2>
            
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Select data to clear:</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="userPreferences" 
                    className="h-4 w-4 text-blue-600 rounded" 
                    checked={clearOptions.userPreferences}
                    onChange={() => handleOptionToggle('userPreferences')}
                  />
                  <label htmlFor="userPreferences" className="ml-2 text-gray-700">User Preferences</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="savedDocuments" 
                    className="h-4 w-4 text-blue-600 rounded" 
                    checked={clearOptions.savedDocuments}
                    onChange={() => handleOptionToggle('savedDocuments')}
                  />
                  <label htmlFor="savedDocuments" className="ml-2 text-gray-700">Saved Documents</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="recentHistory" 
                    className="h-4 w-4 text-blue-600 rounded" 
                    checked={clearOptions.recentHistory}
                    onChange={() => handleOptionToggle('recentHistory')}
                  />
                  <label htmlFor="recentHistory" className="ml-2 text-gray-700">Recent History</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="cachedData" 
                    className="h-4 w-4 text-blue-600 rounded" 
                    checked={clearOptions.cachedData}
                    onChange={() => handleOptionToggle('cachedData')}
                  />
                  <label htmlFor="cachedData" className="ml-2 text-gray-700">Cached Data</label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-3">
              <button
                onClick={handleClearData}
                disabled={!Object.values(clearOptions).some(Boolean)}
                className="px-4 py-2 w-full font-bold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 className="h-5 w-5" />
                Clear Selected Data
              </button>
              
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Info className="h-4 w-4" />
                All cleared data cannot be recovered
              </p>
            </div>
          </div>
        </div>
        
        {/* Confirmation Dialog */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 text-amber-500 mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-bold">Confirm Data Clearing</h3>
              </div>
              <p className="mb-6 text-gray-600">
                You are about to clear selected data from the application. This action cannot be undone.
                Are you sure you want to proceed?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelClear}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClear}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Yes, Clear Data
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Data cleared successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;