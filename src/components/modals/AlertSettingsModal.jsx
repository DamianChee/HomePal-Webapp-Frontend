import { X } from "lucide-react";

function AlertSettingsModal({
  setShowAlertSettings,
  setAlertSettings,
  alertSettings,
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 w-full max-w-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Alert Settings</h3>
          <button
            onClick={() => setShowAlertSettings(false)}
            className="text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-gray-700">
            <div className="text-white text-sm font-medium mb-3">
              Alert Types
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="text-white text-sm font-medium text-left">
                      Bed Exit Alerts
                    </div>
                    <div className="text-xs text-gray-400">
                      When person leaves the bed
                    </div>
                  </div>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0"
                    checked={alertSettings.bedExit}
                    onChange={() => {
                      setAlertSettings({
                        ...alertSettings,
                        bedExit: !alertSettings.bedExit,
                      });

                      // Log to console
                      console.log("Bed exit alerts:", !alertSettings.bedExit);
                    }}
                  />
                  <span
                    className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${
                      alertSettings.bedExit ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  >
                    <span
                      className={`absolute h-5 w-5 rounded-full bg-white transform transition-transform duration-200 ${
                        alertSettings.bedExit
                          ? "translate-x-1"
                          : "-translate-x-6"
                      } top-0.5`}
                    ></span>
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="text-white text-sm font-medium text-left">
                      Edge Detection
                    </div>
                    <div className="text-xs text-gray-400">
                      When sitting on side of bed
                    </div>
                  </div>
                </div>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0"
                    checked={alertSettings.edgeDetection}
                    onChange={() => {
                      setAlertSettings({
                        ...alertSettings,
                        edgeDetection: !alertSettings.edgeDetection,
                      });

                      // Log to console
                      console.log(
                        "Edge detection:",
                        !alertSettings.edgeDetection
                      );
                    }}
                  />
                  <span
                    className={`absolute cursor-pointer inset-0 rounded-full transition-colors duration-200 ${
                      alertSettings.edgeDetection
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  >
                    <span
                      className={`absolute h-5 w-5 rounded-full bg-white transform transition-transform duration-200 ${
                        alertSettings.edgeDetection
                          ? "translate-x-1"
                          : "-translate-x-6"
                      } top-0.5`}
                    ></span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-gray-700">
            <div className="text-white text-sm font-medium mb-3">
              Alert Notifications
            </div>
            <div className="text-xs text-gray-300">
              Alerts will be sent via SMS and WhatsApp to registered caregivers.
            </div>

            <div className="mt-3 text-xs text-gray-400">
              Primary contact: +65 9123 4567
            </div>
            <div className="mt-1 text-xs text-gray-400">
              Secondary contact: +65 9876 5432
            </div>
          </div>

          <button
            onClick={() => {
              setShowAlertSettings(false);

              // Log to console
              console.log("Alert settings saved:", alertSettings);
            }}
            className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertSettingsModal;
