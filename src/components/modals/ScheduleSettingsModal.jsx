import { X } from "lucide-react";

function ScheduleSettingsModal({
  setShowScheduleSettings,
  setDefaultSchedule,
  defaultSchedule,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="schedule-settings-title"
    >
      <div className="bg-gray-800 w-full max-w-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 id="schedule-settings-title" className="text-white font-semibold">
            Night Monitoring Hours
          </h3>
          <button
            onClick={() => setShowScheduleSettings(false)}
            className="text-gray-400"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Active Monitoring Period
            </label>
            <div className="flex space-x-2 items-center">
              <input
                type="time"
                value={defaultSchedule.start}
                onChange={(e) => {
                  setDefaultSchedule({
                    ...defaultSchedule,
                    start: e.target.value,
                  });

                  // Log to console
                  console.log("Start time updated:", e.target.value);
                }}
                className="flex-1 bg-gray-700 text-white rounded px-3 py-2"
                aria-label="Start time"
              />
              <span className="text-gray-400">to</span>
              <input
                type="time"
                value={defaultSchedule.end}
                onChange={(e) => {
                  setDefaultSchedule({
                    ...defaultSchedule,
                    end: e.target.value,
                  });

                  // Log to console
                  console.log("End time updated:", e.target.value);
                }}
                className="flex-1 bg-gray-700 text-white rounded px-3 py-2"
                aria-label="End time"
              />
            </div>
          </div>

          <button
            onClick={() => {
              setShowScheduleSettings(false);

              // Log to console
              console.log("Schedule settings saved:", defaultSchedule);
            }}
            className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleSettingsModal;
