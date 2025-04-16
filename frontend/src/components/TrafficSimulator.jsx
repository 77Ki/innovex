import React, { useEffect, useState } from 'react'
import TrafficSignal from './TrafficSignal'
import Controls from './Controls'
import Legend from './Legend'
import { simulateOptimizationResponse, simulateTrafficFlow } from '../utils/TrafficSimulation'

const lanes = ['north', 'south', 'east', 'west']
const MAX_WAIT_TIME = 60 // seconds

function TrafficSimulator() {
  const [simulationRunning, setSimulationRunning] = useState(false)

  const [vehicleCounts, setVehicleCounts] = useState({
    north: 5,
    south: 3,
    east: 2,
    west: 1
  })

  const [laneTimers, setLaneTimers] = useState({
    north: 0,
    south: 0,
    east: 0,
    west: 0
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [timer, setTimer] = useState(0)
  const [optimizedTimes, setOptimizedTimes] = useState({})

  // Initial timing setup
  useEffect(() => {
    const times = simulateOptimizationResponse(vehicleCounts, lanes)
    setOptimizedTimes(times)
    setTimer(times[lanes[currentIndex]])
  }, [])

  // Deadline + Priority-based lane selection logic
  function selectNextLane(vehicleCounts, laneTimers) {
    const overdue = lanes.filter(lane => laneTimers[lane] >= MAX_WAIT_TIME)

    if (overdue.length > 0) {
      return overdue.reduce((maxLane, lane) =>
        vehicleCounts[lane] > vehicleCounts[maxLane] ? lane : maxLane,
        overdue[0]
      )
    }

    return lanes.reduce((maxLane, lane) =>
      vehicleCounts[lane] > vehicleCounts[maxLane] ? lane : maxLane,
      lanes[0]
    )
  }

  // Core simulation logic
  useEffect(() => {
    if (!simulationRunning) return

    let countdown = timer

    const interval = setInterval(() => {
      if (countdown <= 0) {
        const updatedCounts = simulateTrafficFlow(vehicleCounts, currentIndex, lanes)
        const updatedLaneTimers = { ...laneTimers }

        // Update lane timers
        lanes.forEach((lane, i) => {
          if (i === currentIndex) {
            updatedLaneTimers[lane] = 0
          } else {
            updatedLaneTimers[lane] += timer
          }
        })

        const nextLane = selectNextLane(updatedCounts, updatedLaneTimers)
        const newIndex = lanes.indexOf(nextLane)
        const newOptimizedTimes = simulateOptimizationResponse(updatedCounts, lanes)

        setVehicleCounts(updatedCounts)
        setLaneTimers(updatedLaneTimers)
        setOptimizedTimes(newOptimizedTimes)
        setCurrentIndex(newIndex)
        setTimer(newOptimizedTimes[nextLane])
        countdown = newOptimizedTimes[nextLane]
      } else {
        countdown--
        setTimer(countdown)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [simulationRunning, timer])

  // Controls
  function handleStart() {
    setSimulationRunning(true)
  }

  function handleStop() {
    setSimulationRunning(false)
  }

  function handleReset() {
    setSimulationRunning(false)
    const initialCounts = {
      north: 5,
      south: 3,
      east: 2,
      west: 1
    }
    setVehicleCounts(initialCounts)
    setLaneTimers({
      north: 0,
      south: 0,
      east: 0,
      west: 0
    })
    const newOptimizedTimes = simulateOptimizationResponse(initialCounts, lanes)
    setOptimizedTimes(newOptimizedTimes)
    setCurrentIndex(0)
    setTimer(newOptimizedTimes['north'])
  }

  return (
    <div className="container">
      <h1>Smart Traffic Signal Simulation</h1>
      <TrafficSignal
        lanes={lanes}
        currentIndex={currentIndex}
        timer={timer}
        vehicleCounts={vehicleCounts}
      />
      <Controls
        simulationRunning={simulationRunning}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
      />
      <Legend />
    </div>
  )
}

export default TrafficSimulator
