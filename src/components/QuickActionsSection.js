import React from 'react';
import { Home, Moon, AlertTriangle } from 'lucide-react';

/**
 * QuickActionsSection Component
 * 
 * This component provides quick action buttons for monitoring control,
 * schedule settings, and alert settings.
 * 
 * Modern React best practices:
 * - Presentational component pattern
 * - Props drilling avoided by focused component responsibility
 * - Event handlers passed as props
 * - Consistent styling and naming conventions
 * - Conditional rendering based on state
 * 
 * @param {object} props - Component props
 * @param {boolean} props.monitoringPaused - Whether monitoring is paused
 * @param {function} props.onShowPauseOptions - Function to show pause options
 * @param {function} props.onShowScheduleSettings - Function to show schedule settings
 * @param {function} props.onShowAlertSettings - Function to show alert settings
 * @param {object} props.defaultSchedule - Default schedule object with start/end times
 * @param {function} props.getTimeRemaining - Function to get remaining pause time
 */
function QuickActionsSection({ 
  monitoringPaused, 
  onShowPauseOptions,
  onShowScheduleSettings,
  onShowAlertSettings,
  defaultSchedule,
  getTimeRemaining
}) {
  return (
    <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
      <div className="flex space-x-2">
        {monitoringPaused ? (
          <button 
            className="flex-1 py-2.5 px-3 rounded-lg bg-yellow-500 text-gray-900 flex items-center justify-between hover:bg-yellow-400 transition-colors shadow-md"
            onClick={onShowPauseOptions}
          >
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="text-sm font-medium">Monitoring Paused</div>
                <div className="text-xs opacity-80">
                  {getTimeRemaining() ? `Resume in ${getTimeRemaining()}` : 'Tap to resume'}
                </div>
              </div>
            </div>
            <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-full">Tap</span>
          </button>
        ) : (
          <button 
            className="flex-1 py-2.5 px-3 rounded-lg bg-gray-700 text-gray-300 flex items-center justify-between hover:bg-gray-600 transition-colors shadow-md"
            onClick={onShowPauseOptions}
          >
            <div className="flex items-center">
              <Home className="h-5 w-5 mr-2" />
              <div className="text-left">
                <div className="text-sm font-medium">Pause Monitoring</div>
                <div className="text-xs opacity-80">For maintenance or absence</div>
              </div>
            </div>
            <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">Tap</span>
          </button>
        )}
        <button 
          className="py-2.5 px-3 rounded-lg bg-gray-700 text-gray-300 flex items-center justify-between hover:bg-gray-600 transition-colors shadow-md"
          onClick={onShowScheduleSettings}
        >
          <div className="flex items-center">
            <Moon className="h-5 w-5 mr-2" />
            <div className="text-left whitespace-nowrap">
              <div className="text-sm font-medium">Night Hours</div>
              <div className="text-xs opacity-80">{defaultSchedule.start}-{defaultSchedule.end}</div>
            </div>
          </div>
          <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full ml-2">Tap</span>
        </button>
      </div>
      
      {/* Add Alert Settings Button */}
      <button 
        className="w-full mt-2 py-2.5 px-3 rounded-lg bg-gray-700 text-gray-300 flex items-center justify-between hover:bg-gray-600 transition-colors shadow-md"
        onClick={onShowAlertSettings}
      >
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <div className="text-left">
            <div className="text-sm font-medium">Alert Settings</div>
            <div className="text-xs opacity-80">Customize alert types</div>
          </div>
        </div>
        <span className="text-xs bg-gray-600 text-white px-2 py-1 rounded-full">Tap</span>
      </button>
    </div>
  );
}

export default QuickActionsSection;