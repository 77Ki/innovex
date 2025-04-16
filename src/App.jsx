import { useEffect, useState } from 'react'
import TrafficSignal from './components/TrafficSignal'
import Controls from './components/Controls'
import Legend from './components/Legend'
import HomePage from './components/HomePage'
import { simulateOptimizationResponse, simulateTrafficFlow } from './utils/trafficSimulation'
import './styles/App.css'

const lanes = ['north', 'south', 'east', 'west']
const MAX_WAIT_TIME = 60 // seconds

function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home')
  
  // Simulation states (all your existing states)
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

  // Navigation handler
  const navigateTo = (page) => {
    setCurrentPage(page)
    // Stop simulation when navigating away
    if (page !== 'simulation' && simulationRunning) {
      setSimulationRunning(false)
    }
  }

  // Setup initial times
  useEffect(() => {
    const times = simulateOptimizationResponse(vehicleCounts, lanes)
    setOptimizedTimes(times)
    setTimer(times[lanes[currentIndex]])
  }, [])

  // Deadline + Priority-based lane selection
  function selectNextLane(vehicleCounts, laneTimers) {
    const overdue = lanes.filter(lane => laneTimers[lane] >= MAX_WAIT_TIME)
    if (overdue.length > 0) {
      // Pick the overdue lane with highest vehicle count
      return overdue.reduce((maxLane, lane) =>
        vehicleCounts[lane] > vehicleCounts[maxLane] ? lane : maxLane,
        overdue[0]
      )
    }

    // If no overdue, pick the lane with the highest vehicle count
    return lanes.reduce((maxLane, lane) =>
      vehicleCounts[lane] > vehicleCounts[maxLane] ? lane : maxLane,
      lanes[0]
    )
  }

  // Core traffic signal countdown logic
  useEffect(() => {
    if (!simulationRunning) return

    let countdown = timer
    const interval = setInterval(() => {
      if (countdown <= 0) {
        // Simulate flow and update counts
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

  // Control handlers
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

  // Render the appropriate page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'simulation':
        return (
          <>
            <nav className="navigation">
              <div className="nav-container">
                <h2 className="nav-title">Traffic Simulator</h2>
                <div className="nav-links">
                  <button 
                    onClick={() => navigateTo('home')} 
                    className="nav-link"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => navigateTo('simulation')} 
                    className="nav-link active"
                  >
                    Simulation
                  </button>
                  <button 
                    onClick={() => navigateTo('how-it-works')} 
                    className="nav-link"
                  >
                    How It Works
                  </button>
                  <button 
                    onClick={() => navigateTo('dashboard')} 
                    className="nav-link"
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            </nav>
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
          </>
        );
      case 'how-it-works':
        return (
          <>
            <nav className="navigation">
              <div className="nav-container">
                <h2 className="nav-title">Traffic Simulator</h2>
                <div className="nav-links">
                  <button 
                    onClick={() => navigateTo('home')} 
                    className="nav-link"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => navigateTo('simulation')} 
                    className="nav-link"
                  >
                    Simulation
                  </button>
                  <button 
                    onClick={() => navigateTo('how-it-works')} 
                    className="nav-link active"
                  >
                    How It Works
                  </button>
                  <button 
                    onClick={() => navigateTo('dashboard')} 
                    className="nav-link"
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            </nav>
            <div className="container">
              <h1>How It Works</h1>
              <div className="content-section">
                <h2>Smart Traffic Signal Algorithm</h2>
                <p>Our traffic signal optimization system uses a combination of vehicle counting and adaptive timing to maximize traffic flow efficiency.</p>
                
                <h3>Key Components:</h3>
                <ul>
                  <li><strong>Vehicle Detection:</strong> Sensors count vehicles in each lane</li>
                  <li><strong>Wait Time Tracking:</strong> The system monitors how long each lane has been waiting</li>
                  <li><strong>Priority-Based Scheduling:</strong> Lanes with higher traffic volume get longer green light durations</li>
                  <li><strong>Maximum Wait Time:</strong> No lane will wait longer than 60 seconds, preventing excessive delays</li>
                </ul>
                
                <p>Try the simulation to see these principles in action!</p>
                
                <button 
                  onClick={() => navigateTo('simulation')}
                  className="control-button reset"
                >
                  Go to Simulation
                </button>
              </div>
            </div>
          </>
        );
      case 'dashboard':
        return (
          <>
            <nav className="navigation">
              <div className="nav-container">
                <h2 className="nav-title">Traffic Simulator</h2>
                <div className="nav-links">
                  <button 
                    onClick={() => navigateTo('home')} 
                    className="nav-link"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => navigateTo('simulation')} 
                    className="nav-link"
                  >
                    Simulation
                  </button>
                  <button 
                    onClick={() => navigateTo('how-it-works')} 
                    className="nav-link"
                  >
                    How It Works
                  </button>
                  <button 
                    onClick={() => navigateTo('dashboard')} 
                    className="nav-link active"
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            </nav>
            <div className="container">
              <h1>Dashboard</h1>
              <div className="content-section">
                <h2>Traffic Analytics</h2>
                <p>This dashboard would display metrics and performance data from your traffic simulations.</p>
                
                <div className="dashboard-placeholder">
                  <h3>Sample Metrics:</h3>
                  <ul>
                    <li>Average Wait Time: 18.3 seconds</li>
                    <li>Peak Traffic Flow: 42 vehicles/minute</li>
                    <li>Optimization Efficiency: 78%</li>
                  </ul>
                  
                  <p>Run a simulation to generate real data.</p>
                </div>
                
                <button 
                  onClick={() => navigateTo('simulation')}
                  className="control-button reset"
                >
                  Go to Simulation
                </button>
              </div>
            </div>
          </>
        );
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <>
      {renderPage()}
    </>
  );
}

export default App;