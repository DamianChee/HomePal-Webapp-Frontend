import React from "react";
import { X } from "lucide-react";
import { useState } from "react";

/**
 * EventDetail Component
 *
 * This component renders the details view for a selected event,
 * including status, time, description, and an image placeholder.
 *
 * Modern React best practices:
 * - Pure presentational component (no state)
 * - Clearly defined props interface
 * - Accessibility considerations (aria attributes)
 * - Logical component organization
 * - Semantic HTML structure
 *
 * @param {object} props - Component props
 * @param {object} props.event - The selected event object
 * @param {function} props.getStatusColor - Function to determine status color
 * @param {function} props.onClose - Function to close the detail view
 */
function EventDetail({ event, getStatusColor, onClose }) {
  if (!event) return null;

  const staticImage = "/images/static-image.jpg";

  const PlaceholderRenderer = () => {
    switch (event.event) {
      case "Attempted-Bed-Exit":
        return (
          <img
            src="/images/attempted-bedside-exit.jpg"
            alt="Static image from public folder"
            style="display: inline; height: -webkit-fill-available;"
          />
        );
      case "Bed-Entry":
        return (
          <img
            src="/images/bed-entry.jpg"
            alt="Static image from public folder"
            className="display: inline; height: -webkit-fill-available;"
          />
        );
      case "Bed-Exit":
        return (
          <img
            src="/images/bed-exit.jpg"
            alt="Static image from public folder"
            className="display: inline; height: -webkit-fill-available;"
          />
        );
      case "Bedside-Fall":
        return (
          <img
            src="/images/bedside-fall.jpg"
            alt="Static image from public folder"
            className="display: inline; height: -webkit-fill-available;"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-3">
      <div className="bg-gray-800 rounded-lg overflow-hidden mb-3">
        <div className="flex justify-between items-center px-3 py-2.5 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${getStatusColor(event.status)}`}
            />
            <div>
              <h3 className="text-white text-sm font-medium">{event.event}</h3>
              <p className="text-xs text-gray-400">{event.time}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 p-1 hover:bg-gray-700 rounded"
            aria-label="Close event details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Event Footage */}
        <div className="relative w-full mx-auto" style={{ aspectRatio: "4/3" }}>
          {/* Replace this next line to actual movement snapshot */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-yellow-400 opacity-20" /> */}
          {PlaceholderRenderer()}
          <div className="absolute top-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
            Movement Snapshot
          </div>
        </div>

        {/* Event Details */}
        <div className="p-3">
          <div className="text-sm text-gray-300">{event.description}</div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
