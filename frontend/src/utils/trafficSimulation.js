// Utility functions for traffic simulation

/**
 * Simulates optimization algorithm response based on vehicle counts
 * @param {Object} vehicleCounts - Object containing vehicle counts for each lane
 * @param {Array} lanes - Array of lane names
 * @returns {Object} - Optimized green light durations for each lane
 */
export function simulateOptimizationResponse(vehicleCounts, lanes) {
  // Base timing calculation for each lane based on vehicle count
  // with a minimum time of 3 seconds and max of 15 seconds
  const times = {}
  
  const totalVehicles = lanes.reduce((sum, lane) => sum + vehicleCounts[lane], 0)
  
  if (totalVehicles === 0) {
    // Equal distribution if no vehicles
    lanes.forEach(lane => {
      times[lane] = 5
    })
    return times
  }
  
  lanes.forEach(lane => {
    // Calculate green time proportional to vehicle count
    // with minimum and maximum bounds
    const ratio = vehicleCounts[lane] / totalVehicles
    let greenTime = Math.round(ratio * 30)
    
    // Enforce minimum and maximum green times
    greenTime = Math.max(3, greenTime) // minimum 3 seconds
    greenTime = Math.min(15, greenTime) // maximum 15 seconds
    
    times[lane] = greenTime
  })
  
  return times
}

/**
 * Simulates traffic flow by updating vehicle counts after a green phase
 * @param {Object} currentCounts - Current vehicle counts for each lane
 * @param {Number} activeIndex - Index of the currently active (green) lane
 * @param {Array} lanes - Array of lane names
 * @returns {Object} - Updated vehicle counts after traffic flow
 */
export function simulateTrafficFlow(currentCounts, activeIndex, lanes) {
  const updatedCounts = { ...currentCounts }
  const activeLane = lanes[activeIndex]
  
  // Decrease vehicle count for the lane that had green light
  // Based on how many could pass during the green phase
  if (updatedCounts[activeLane] > 0) {
    // Reduce by a random amount up to 3 vehicles or current count
    const reduction = Math.min(
      Math.floor(Math.random() * 3) + 1,
      updatedCounts[activeLane]
    )
    updatedCounts[activeLane] -= reduction
  }
  
  // Randomly increase vehicle counts for all lanes to simulate new arrivals
  lanes.forEach(lane => {
    // 40% chance of new vehicle arriving at each lane
    if (Math.random() < 0.4) {
      // Add 1-2 vehicles
      const increase = Math.floor(Math.random() * 2) + 1
      updatedCounts[lane] += increase
    }
  })
  
  return updatedCounts
}