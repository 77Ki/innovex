import '../styles/TrafficSignal.css'
import Lane from './Lane'

function TrafficSignal({ lanes, currentIndex, timer, vehicleCounts }) {
  return (
    <div className="signal-layout">
      <div className="lane-container north">
        <Lane 
          direction="north"
          isActive={lanes[currentIndex] === 'north'}
          timer={lanes[currentIndex] === 'north' ? timer : 0}
          vehicleCount={vehicleCounts.north}
        />
      </div>

      <div className="lane-container south">
        <Lane 
          direction="south"
          isActive={lanes[currentIndex] === 'south'}
          timer={lanes[currentIndex] === 'south' ? timer : 0}
          vehicleCount={vehicleCounts.south}
        />
      </div>

      <div className="lane-container east">
        <Lane 
          direction="east"
          isActive={lanes[currentIndex] === 'east'}
          timer={lanes[currentIndex] === 'east' ? timer : 0}
          vehicleCount={vehicleCounts.east}
        />
      </div>

      <div className="lane-container west">
        <Lane 
          direction="west"
          isActive={lanes[currentIndex] === 'west'}
          timer={lanes[currentIndex] === 'west' ? timer : 0}
          vehicleCount={vehicleCounts.west}
        />
      </div>

      <div className="intersection-box"></div>
    </div>
  )
}

export default TrafficSignal
