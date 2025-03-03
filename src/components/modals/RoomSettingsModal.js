import React from 'react';
import { X } from 'lucide-react';

/**
 * RoomSettingsModal Component
 * 
 * Modal for editing room name settings.
 * 
 * Modern React best practices:
 * - Modular component design
 * - Keeps form state in parent component
 * - Uses controlled inputs
 * - Handles accessibility concerns (aria attributes, roles)
 * - Clear event handling
 * 
 * @param {object} props - Component props
 * @param {boolean} props.show - Whether to show the modal
 * @param {function} props.onClose - Function to close the modal
 * @param {string} props.roomName - Current room name
 * @param {function} props.onRoomNameChange - Function to handle room name changes
 */
function RoomSettingsModal({ show, onClose, roomName, onRoomNameChange }) {
  if (!show) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-labelledby="room-settings-title"
    >
      <div className="bg-gray-800 w-full max-w-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 id="room-settings-title" className="text-white font-semibold">Room Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-400"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="room-name"
              className="text-sm text-gray-300 block mb-2"
            >
              Room Name
            </label>
            <input 
              id="room-name"
              type="text"
              value={roomName}
              onChange={(e) => onRoomNameChange(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
              placeholder="Enter room name"
            />
          </div>
          
          <button 
            onClick={onClose}
            className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomSettingsModal;