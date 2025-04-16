# This should be at the top of the file
last_green_direction = None

traffic_data = {"north": 0, "south": 0, "east": 0, "west": 0}

MAX_GREEN_TIME = 60
DEFAULT_GREEN_TIME = 30


def update_traffic_counts(new_data):
    try:
        for direction in traffic_data:
            if direction in new_data:
                traffic_data[direction] = int(new_data[direction])
        return True, "Counts updated successfully"
    except Exception as e:
        return False, f"Error: {str(e)}"


def calculate_signal_times():
    global last_green_direction

    # Skip the last direction that had a green light
    valid_directions = [d for d in traffic_data if d != last_green_direction]

    # If all directions have no traffic, use default times and rotate
    if all(traffic_data[d] == 0 for d in valid_directions) or not valid_directions:
        # If this is the first run or all traffic is 0
        if last_green_direction is None:
            next_direction = "north"  # Default starting direction
        else:
            # Simple rotation: north -> east -> south -> west -> north
            rotation = {
                "north": "east",
                "east": "south",
                "south": "west",
                "west": "north",
            }
            next_direction = rotation.get(last_green_direction, "north")
    else:
        # Choose the direction with the most traffic (excluding the last one)
        next_direction = max(valid_directions, key=lambda d: traffic_data[d])

    # Calculate green times - only the chosen direction gets green
    signal_times = {
        d: (
            min(MAX_GREEN_TIME, max(15, traffic_data[d] * 2))
            if d == next_direction
            else 0
        )
        for d in traffic_data
    }

    # Update the last green direction
    last_green_direction = next_direction

    return signal_times
