import '../styles/Legend.css'

function Legend() {
  return (
    <div className="legend">
      <h3>Legend</h3>
      <div className="legend-item">
        <div className="legend-color green"></div>
        <span>Green Light - Vehicles may proceed</span>
      </div>
      <div className="legend-item">
        <div className="legend-color red"></div>
        <span>Red Light - Vehicles must stop</span>
      </div>
    </div>
  )
}

export default Legend