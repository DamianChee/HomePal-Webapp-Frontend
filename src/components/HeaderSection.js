import React, { useState } from "react";
import { Moon, User, Edit2 } from "lucide-react";
import { useMockEventGenerator } from "../utils/mockEventGenerator";

/**
 * HeaderSection Component
 *
 * This component renders the brand header and room information section.
 *
 * Modern React best practices:
 * - Pure presentational component
 * - Focused on a single responsibility
 * - Props clearly defined with comments
 * - Event handlers passed as props (not defined in component)
 * - Semantic HTML for accessibility and SEO
 *
 * @param {object} props - Component props
 * @param {string} props.roomName - The name of the room
 * @param {function} props.onEditRoom - Function to handle room edit
 */
function HeaderSection({ roomName, onEditRoom }) {
  // State to prevent multiple rapid clicks
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Get the mock event generator function
  const generateMockEvent = useMockEventGenerator();
  
  /**
   * Hidden feature: Generate a mock event when the logo is clicked
   * 
   * *** HOW TO REMOVE THIS FEATURE ***
   * 1. Remove this entire handleLogoClick function
   * 2. Remove the onClick attribute from the logo div
   * 3. Remove the isGenerating state and setIsGenerating
   * 4. Remove the import for useMockEventGenerator
   */
  const handleLogoClick = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      const result = await generateMockEvent();
      
      if (result.success) {
        console.log("Mock event created successfully");
      } else {
        console.error("Failed to create mock event");
      }
    } catch (error) {
      console.error("Error generating mock event:", error);
    } finally {
      // Prevent multiple rapid clicks
      setTimeout(() => {
        setIsGenerating(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Brand Header */}
      <div className="bg-indigo-900 px-4 py-3">
        <div className="flex items-center space-x-2">
          {/* 
            * Hidden feature: This div is clickable and generates a mock event
            * 
            * To remove: Delete the onClick handler and style attributes below
            * that make this look like a button (cursor-pointer)
            */}
          <div 
            className="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center cursor-pointer"
            onClick={handleLogoClick}
            style={{ transition: "all 0.2s ease" }}
            title="CarePal Logo"
          >
            <Moon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-left">CarePal</h1>
            <p className="text-indigo-200 text-xs">Night Bed Care Monitor</p>
          </div>
        </div>
      </div>

      {/* Room Info & Status */}
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <button
            className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 transition-colors px-2 py-1 rounded-lg"
            onClick={onEditRoom}
            aria-label="Edit room name"
          >
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-white">{roomName}</span>
            <Edit2 className="h-3 w-3 text-gray-400 ml-1" />
          </button>
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-400">System Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderSection;