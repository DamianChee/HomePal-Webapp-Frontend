import React from "react";
import { X } from "lucide-react";
import Slider from "react-slick";
import { useRef, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../custom-slick.css";

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
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, [event]);

  if (!event) return null;

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const PlaceholderRenderer = () => {
    switch (event.event) {
      case "Attempted-Bed-Exit":
        return (
          <Slider
            {...settings}
            style={{ height: `-webkit-fill-available` }}
            ref={sliderRef}
          >
            <img
              src="/images/attempted-bedside-exit-1.jpg"
              alt="Static image from public folder"
            />
            <img
              src="/images/attempted-bedside-exit-2.jpg"
              alt="Static image from public folder"
            />
            <img
              src="/images/attempted-bedside-exit-3.jpg"
              alt="Static image from public folder"
            />
          </Slider>
        );
      case "Bed-Entry":
        return (
          <Slider
            {...settings}
            style={{ height: `-webkit-fill-available` }}
            ref={sliderRef}
          >
            <img
              src="/images/bed-exit-3.jpg"
              alt="Static image from public folder"
            />
            <img
              src="/images/bed-exit-2.jpg"
              alt="Static image from public folder"
            />
            <img
              src="/images/bed-exit-1.jpg"
              alt="Static image from public folder"
            />
          </Slider>
        );
      case "Bed-Exit":
        return (
          <Slider
            {...settings}
            style={{ height: `-webkit-fill-available` }}
            ref={sliderRef}
          >
            <img
              src="/images/bed-exit-1.jpg"
              alt="Static image from public folder"
            />
            <img
              src="/images/bed-exit-2.jpg"
              alt="Static image from public folder"
            />
            <img
              src="/images/bed-exit-3.jpg"
              alt="Static image from public folder"
            />
          </Slider>
        );
      case "Bedside-Fall":
        return (
          <Slider
            {...settings}
            style={{ height: `-webkit-fill-available` }}
            ref={sliderRef}
          >
            <img
              src="/images/missing-from-bed.jpg"
              alt="Static image from public folder"
            />
            <img
              src="/images/missing-from-bed.jpg"
              alt="Static image from public folder"
            />
            <img
              src="/images/missing-from-bed.jpg"
              alt="Static image from public folder"
            />
          </Slider>
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
              className={`h-3 w-3 rounded-full ${getStatusColor(event.event)}`}
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
