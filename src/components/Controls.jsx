import '../styles/Controls.css'

function Controls({ simulationRunning, onStart, onStop, onReset }) {
  return (
    <div className="controls">
      <button 
        className="control-button start"
        onClick={onStart}
        disabled={simulationRunning}
      >
        Start Simulation
      </button>
      
      <button 
        className="control-button stop"
        onClick={onStop}
        disabled={!simulationRunning}
      >
        Stop Simulation
      </button>
      
      <button 
        className="control-button reset"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  )
}

export default Controls