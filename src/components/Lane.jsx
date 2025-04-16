import '../styles/Lane.css'

function Lane({ direction, isActive, timer, vehicleCount }) {
  return (
    <div className={`lane-content ${direction}`}>
      <div className="direction-label">{direction.toUpperCase()}</div>
      <div className={`signal ${isActive ? 'green' : 'red'}`}></div>
      <div className="count">Vehicles: {vehicleCount}</div>
      <div className="timer">{timer}s</div>
    </div>
  )
}

export default Lane