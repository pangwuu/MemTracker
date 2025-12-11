import React, { useRef } from 'react';

const FullscreenToggleComponent = () => {
  // Create a ref for the element you want to fullscreen
  const fullscreenRef = useRef(null);

  const toggleFullscreen = () => {
    const element = fullscreenRef.current;

    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) { /* Safari */
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { /* IE11 */
        element.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  };

  return (
    // The content inside this div can go fullscreen
    <div ref={fullscreenRef} style={{ padding: '20px', background: 'white' }}>
      <h1>My Fullscreen Content</h1>
      <p>Click the button below to toggle true browser fullscreen mode.</p>
      <button onClick={toggleFullscreen}>
        Toggle Fullscreen
      </button>
    </div>
  );
};

export default FullscreenToggleComponent;
