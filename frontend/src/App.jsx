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
  const [currentPage, setCurrentPage] = useState('home')
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

  const navigateTo = (page) => {
    setCurrentPage(page)
    if (page !== 'simulation' && simulationRunning) {
      setSimulationRunning(false)
    }
  }

  useEffect(() => {
    const times = simulateOptimizationResponse(vehicleCounts, lanes)
    setOptimizedTimes(times)
    setTimer(times[lanes[currentIndex]])
  }, [])

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

  useEffect(() => {
    if (!simulationRunning) return

    let countdown = timer
    const interval = setInterval(() => {
      if (countdown <= 0) {
        const updatedCounts = simulateTrafficFlow(vehicleCounts, currentIndex, lanes)
        const updatedLaneTimers = { ...laneTimers }

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

  const ModernNavbar = () => (
    <nav className="modern-navbar">
      <div className="nav-brand">
        <h1 className="nav-title">Traffix AI</h1>
      </div>
      <div className="nav-links">
        {[
          { id: 'home', label: 'Home' },
          { id: 'simulation', label: 'Simulation' },
          { id: 'how-it-works', label: 'How It Works' },
          { id: 'dashboard', label: 'Dashboard' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`modern-nav-button ${currentPage === item.id ? 'active' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )

  const renderPage = () => {
    switch (currentPage) {
      case 'simulation':
        return (
          <>
            <ModernNavbar />
            <div className="container simulation-layout">
              <h1>Smart Traffic Signal Simulation</h1>
              <div className="signal-controls-wrapper">
                <TrafficSignal
                  lanes={lanes}
                  currentIndex={currentIndex}
                  timer={timer}
                  vehicleCounts={vehicleCounts}
                />
                <div className="controls-legend-wrapper">
                  <Controls
                    simulationRunning={simulationRunning}
                    onStart={handleStart}
                    onStop={handleStop}
                    onReset={handleReset}
                  />
                  <Legend />
                </div>
              </div>
            </div>
          </>
        )
      case 'how-it-works':
        return (
          <>
            <ModernNavbar />
            <div className="container">
              <h1>How It Works</h1>
              <div className="content-section">
                <h2>Smart Traffic Signal Algorithm</h2>
                <p>Our traffic signal optimization system uses a combination of vehicle counting and adaptive timing to maximize traffic flow efficiency.</p>
                <h3>Step-by-Step Process:</h3>
                <ol>
                  <li>Each lane starts with a set number of vehicles.</li>
                  <li>The optimization algorithm assigns initial green times based on vehicle counts.</li>
                  <li>The timer counts down for the current lane with green signal.</li>
                  <li>During each green phase, vehicle counts are reduced for the active lane.</li>
                  <li>Lane timers are updated — active lane resets, others increment by that lane's green duration.</li>
                  <li>If any lane exceeds the 60-second max wait time, it gets priority next.</li>
                  <li>Otherwise, the next lane is selected based on highest vehicle count.</li>
                  <li>The cycle continues dynamically, balancing fairness and efficiency.</li>
                </ol>
                <button onClick={() => navigateTo('simulation')} className="control-button reset">Go to Simulation</button>
              </div>
            </div>
          </>
        )
      case 'dashboard':
        return (
          <>
            <ModernNavbar />
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
                <button onClick={() => navigateTo('simulation')} className="control-button reset">Go to Simulation</button>
              </div>
            </div>
          </>
        )
      default:
        return <HomePage navigateTo={navigateTo} ModernNavbar={ModernNavbar} />
    }
  }

  return <>{renderPage()}</>
}

export default App