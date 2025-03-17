import { X } from "lucide-react";

function PauseOptionsModal({
  setShowPauseOptions,
  setCustomDuration,
  handleResumeMonitoring,
  handlePauseMonitoring,
  handleCustomDuration,
  customDuration,
  monitoringPaused,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-end z-50"
      role="dialog"
      aria-labelledby="pause-options-title"
    >
      <div className="bg-gray-800 w-full rounded-t-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 id="pause-options-title" className="text-white font-semibold">
            {monitoringPaused ? "Resume Monitoring" : "Pause Monitoring"}
          </h3>
          <button
            onClick={() => setShowPauseOptions(false)}
            className="text-gray-400"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {monitoringPaused && (
            <button
              className="w-full p-3 text-left rounded-lg bg-green-600 hover:bg-green-700 text-white"
              onClick={handleResumeMonitoring}
            >
              <div className="font-medium">Resume Monitoring Now</div>
              <div className="text-sm opacity-90 mt-1">
                Return to active monitoring
              </div>
            </button>
          )}

          <button
            className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
            onClick={() => handlePauseMonitoring(3)}
          >
            <div className="text-white text-sm font-medium">Short Pause</div>
            <div className="text-gray-400 text-xs mt-1">
              3 hours (changing sheets, bathroom break)
            </div>
          </button>

          <button
            className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
            onClick={() => handlePauseMonitoring(12)}
          >
            <div className="text-white text-sm font-medium">Day Trip</div>
            <div className="text-gray-400 text-xs mt-1">
              12 hours (day outing, doctor visit)
            </div>
          </button>

          <button
            className="w-full p-3 text-left rounded-lg bg-gray-700 hover:bg-gray-600"
            onClick={() => handlePauseMonitoring(72)}
          >
            <div className="text-white text-sm font-medium">Weekend Trip</div>
            <div className="text-gray-400 text-xs mt-1">
              3 days (weekend away)
            </div>
          </button>

          <div className="p-3 rounded-lg bg-gray-700">
            <div className="text-white text-sm font-medium mb-2">
              Custom Duration
            </div>
            <div className="flex mb-2">
              <select
                className="flex-1 bg-gray-600 rounded px-3 py-1 text-white text-sm"
                value={customDuration}
                onChange={(e) => {
                  setCustomDuration(parseInt(e.target.value));

                  // Log to console
                  console.log(
                    "Custom duration set to:",
                    e.target.value,
                    "days"
                  );
                }}
              >
                <option value="1">1 day</option>
                <option value="2">2 days</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
                <option value="5">5 days</option>
                <option value="6">6 days</option>
                <option value="7">1 week</option>
                <option value="14">2 weeks</option>
              </select>
            </div>
            <button
              className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm"
              onClick={handleCustomDuration}
            >
              Set Custom Duration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PauseOptionsModal;
