// Keeps track of how many times each lane missed getting green
let missedTurns = {
    north: 0,
    south: 0,
    east: 0,
    west: 0,
  };
  
  // The max number of turns a lane can be skipped before it MUST get green
  const DEADLINE_THRESHOLD = 3;
  
  // Simulate the API response that would come from backend
  export function simulateOptimizationResponse(vehicleCounts, lanes) {
    const totalVehicles = Object.values(vehicleCounts).reduce((sum, count) => sum + count, 0);
    const minTime = 5; // Minimum green light time in seconds
    const maxTime = 30; // Maximum green light time in seconds
  
    const result = {};
  
    // Calculate green time proportionally
    lanes.forEach(lane => {
      result[lane] = Math.round(
        Math.max(
          minTime,
          Math.min(
            maxTime,
            (vehicleCounts[lane] / Math.max(totalVehicles, 1)) * 60
          )
        )
      );
    });
  
    return result;
  }
  
  // Fair scheduling logic: prioritize heavy lanes but ensure fairness
  export function getNextLane(vehicleCounts, currentLane, lanes) {
    // Check if any lane reached deadline
    const deadlineLane = lanes.find((lane) => missedTurns[lane] >= DEADLINE_THRESHOLD);
    if (deadlineLane) {
      missedTurns[deadlineLane] = 0;
      return deadlineLane;
    }
  
    // Otherwise pick lane with highest vehicle count
    const sortedLanes = [...lanes].sort((a, b) => vehicleCounts[b] - vehicleCounts[a]);
    const selectedLane = sortedLanes[0];
  
    // Update missedTurns: reset selected lane, increment others
    lanes.forEach(lane => {
      if (lane === selectedLane) {
        missedTurns[lane] = 0;
      } else {
        missedTurns[lane]++;
      }
    });
  
    return selectedLane;
  }
  
  // Simulate vehicle flow: active lane decreases, others increase
  export function simulateTrafficFlow(currentCounts, activeIndex, lanes) {
    const newCounts = { ...currentCounts };
    const activeLane = lanes[activeIndex];
  
    // Vehicles passed through the green lane
    if (newCounts[activeLane] > 0) {
      newCounts[activeLane] = Math.max(0, newCounts[activeLane] - Math.floor(Math.random() * 3));
    }
  
    // Other lanes may receive vehicles
    lanes.forEach(lane => {
      if (lane !== activeLane) {
        newCounts[lane] += Math.floor(Math.random() * 3); // 0–2 more vehicles
      }
    });
  
    return newCounts;
  }
  