// components/HamburgerMenu.tsx
import React from "react"

const HamburgerMenu: React.FC = () => {
  // Define the size and spacing directly in the component
  const size = "30px" // Adjust button size here
  const padding = "2px" // Adjust padding based on button size
  const spacing = "2px" // Adjust spacing between lines based on button size

  return (
    <button
      className="flex flex-col items-center justify-center rounded border-2 border-gray-200 hover:border-gray-300"
      aria-label="Open menu"
      style={{
        width: size,
        height: size,
        padding: padding,
        gap: spacing,
      }}>
      <span className="h-0.5 w-3/4 rounded bg-gray-700 hover:bg-gray-600"></span>
      <span
        className="h-0.5 w-3/4 rounded bg-gray-700 hover:bg-gray-600"
        style={{ margin: `${spacing} 0` }}></span>
      <span className="h-0.5 w-3/4 rounded bg-gray-700 hover:bg-gray-600"></span>
    </button>
  )
}

export default HamburgerMenu
