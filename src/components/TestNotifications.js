import React, { useState } from 'react';
import { createMockEvent } from '../firebase';
import { X } from 'lucide-react';

/**
 * TestNotifications Component
 * 
 * A simple test component for creating mock events in Firestore
 * to test the real-time notification system
 */
function TestNotifications({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [eventType, setEventType] = useState('Bed-Exit');
  const [result, setResult] = useState(null);

  const handleCreateEvent = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const eventId = await createMockEvent(eventType);
      
      if (eventId) {
        setResult({
          success: true,
          message: `Mock event "${eventType}" created successfully with ID: ${eventId}`
        });
      } else {
        setResult({
          success: false,
          message: 'Failed to create mock event'
        });
      }
    } catch (error) {
      console.error('Error in test component:', error);
      setResult({
        success: false,
        message: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 w-full max-w-sm rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Test Notifications</h3>
          <button onClick={onClose} className="text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2"
            >
              <option value="Bed-Exit">Bed Exit</option>
              <option value="Bedside-Fall">Bedside Fall</option>
              <option value="Attempted-Bed-Exit">Attempted Bed Exit</option>
              <option value="Bed-Entry">Bed Entry</option>
            </select>
          </div>

          <button
            onClick={handleCreateEvent}
            disabled={loading}
            className={`w-full rounded-lg py-2 text-sm font-medium ${
              loading
                ? 'bg-gray-600 text-gray-300'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {loading ? 'Creating...' : 'Create Mock Event'}
          </button>

          {result && (
            <div
              className={`p-3 rounded-lg ${
                result.success ? 'bg-green-800/50' : 'bg-red-800/50'
              }`}
            >
              <p className="text-sm text-white">{result.message}</p>
            </div>
          )}

          <div className="text-xs text-gray-400 mt-2">
            <p>This will create a real document in your Firestore database.</p>
            <p>The notification system should detect it and show an alert.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestNotifications;