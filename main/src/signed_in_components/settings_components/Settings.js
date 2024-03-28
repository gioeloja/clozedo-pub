import React from "react";
import TimeDropdown from "../dashboard_components/dashboard_tab/settings/TimeDropdown";

function Settings(props) {
  const handleSave = () => {
    // Save settings here
    props.onSave();
  };

  return (
    <div
      className={`${
        props.showModal ? "opacity-100" : "opacity-0 pointer-events-none"
      } fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center transition-opacity duration-500`}
    >
      <div
        className="absolute bg-[#464f60] rounded-lg w-full max-w-lg p-6 transform transition-all rounded-xl"
        style={{
          top: props.showModal ? "calc(50% - 150px)" : "-50%",
          opacity: props.showModal ? 1 : 0,
          transitionDuration: props.showModal ? "500ms" : "1000ms",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl text-white font-semibold">Settings</h3>
          <button
            onClick={props.onClose}
            className="text-gray-500 hover:text-gray-600 transition-all duration-500 focus:outline-none"
          >
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 8.586L16.95 1.636a1 1 0 011.414 1.414L11.414 10l7.95 7.95a1 1 0 11-1.414 1.414L10 11.414l-7.95 7.95a1 1 0 11-1.414-1.414L8.586 10 1.636 2.05A1 1 0 012.05.636L10 8.586z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="mb-8">
          <h1 className="text-white font-semibold">Time</h1>
          <div className="flex justify-end">
            <TimeDropdown onChange={props.onTimeChange} />
          </div>
        </div>
        <div className="mb-8">
          <h1 className="text-white font-semibold">Brand</h1>
          <div className="flex justify-end">
            {/* Brand filter component */}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={props.onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg mr-2 transition-all duration-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;