import { X } from "lucide-react";

function FilterModal({ setShowFilters, setActiveFilters, activeFilters }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-end z-50">
      <div className="bg-gray-800 w-full rounded-t-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Filter Timeline</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <button
            className={`w-full p-3 text-left rounded-lg ${
              activeFilters.includes("all")
                ? "bg-blue-600 text-white font-medium"
                : "bg-gray-700 hover:bg-gray-600 text-white"
            }`}
            onClick={() => {
              setActiveFilters(["all"]);

              // Log to console
              console.log("Filter set to: all");
            }}
          >
            All Events
          </button>

          <button
            className={`w-full p-3 text-left rounded-lg ${
              activeFilters.includes("Bedside-Fall")
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            } flex items-center space-x-3`}
            onClick={() => {
              if (activeFilters.includes("all")) {
                setActiveFilters(["Bedside-Fall"]);
              } else if (activeFilters.includes("Bedside-Fall")) {
                setActiveFilters(
                  activeFilters.filter((f) => f !== "Bedside-Fall")
                );
              } else {
                setActiveFilters([...activeFilters, "Bedside-Fall"]);
              }

              // Log to console
              console.log("Filter updated: Bedside-Fall events");
            }}
          >
            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
            <div>
              <div className="text-white text-sm font-medium">
                Bed Exits Only
              </div>
              <div className="text-xs text-gray-400">Person left the bed</div>
            </div>
          </button>

          <button
            className={`w-full p-3 text-left rounded-lg ${
              activeFilters.includes("Attempted-Bed-Exit")
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            } flex items-center space-x-3`}
            onClick={() => {
              if (activeFilters.includes("all")) {
                setActiveFilters(["Attempted-Bed-Exit"]);
              } else if (activeFilters.includes("Attempted-Bed-Exit")) {
                setActiveFilters(
                  activeFilters.filter((f) => f !== "Attempted-Bed-Exit")
                );
              } else {
                setActiveFilters([...activeFilters, "Attempted-Bed-Exit"]);
              }

              // Log to console
              console.log("Filter updated: Attempted-Bed-Exit events");
            }}
          >
            <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
            <div>
              <div className="text-white text-sm font-medium">
                Edge Activity Only
              </div>
              <div className="text-xs text-gray-400">
                Sitting on edge of bed
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setShowFilters(false);

              // Log to console
              console.log("Filters applied:", activeFilters);
            }}
            className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium mt-2"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
