import React from 'react';

/**
 * StatusSection Component
 * 
 * This component displays the current monitoring status and metrics.
 * 
 * Modern React best practices:
 * - Pure presentational component with conditional rendering
 * - Props with clear documentation
 * - Consistent styling approach
 * - Focused on a single UI section
 * 
 * @param {object} props - Component props
 * @param {boolean} props.monitoringPaused - Whether monitoring is paused
 * @param {string} props.timeRemaining - Time remaining for pause (if applicable)
 */
function StatusSection({ monitoringPaused, timeRemaining }) {
  return (
    <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
      <div className="flex items-center justify-between mb-3">
        {monitoringPaused ? (
          <span className="text-yellow-400 font-medium">Monitoring Paused</span>
        ) : (
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-green-400 font-medium">In Bed</span>
            <span className="text-xs text-gray-400 ml-2">Updated 2m ago</span>
          </div>
        )}
      </div>
      
      {/* Key Metrics - Only shown when actively monitoring */}
      {!monitoringPaused && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">Last Activity</div>
            <div className="text-sm text-white font-medium">7 min ago</div>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-400">Time in Bed</div>
            <div className="text-sm text-white font-medium">6h 15m</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusSection;