# Lane-specific vehicle detection script
import os
from pathlib import Path
from vehicle_detector import VehicleDetector, export_json

def main_lane_processing():
    """Process the four directional lanes (North, South, East, West)"""
    # Define paths to lane images
    input_dir = "images"
    lane_images = {
        "North": os.path.join(input_dir, "north.jpg"),
        "South": os.path.join(input_dir, "south.jpg"),
        "East": os.path.join(input_dir, "east.jpg"),
        "West": os.path.join(input_dir, "west.jpg")
    }
    
    # Verify images exist
    for lane, image_path in lane_images.items():
        if not os.path.exists(image_path):
            print(f"Warning: Image for {lane} lane not found at {image_path}")
    
    # Initialize detector (using nano model for speed)
    detector = VehicleDetector(model_size="n", confidence=0.25)
    
    # Process lanes
    print("Processing lane images...")
    results = detector.process_lanes(lane_images, save_output=True)
    
    # Display results
    print("\nVehicle Detection Results:")
    print("-" * 40)
    for lane, count in results["vehicle_counts"].items():
        print(f"{lane}: {count} vehicles")
    
    # Export results
    output_file = "lane_vehicle_counts.json"
    export_json(results, output_file)
    print(f"\nResults exported to {output_file}")
    
    # Output path for Raja's backend
    print("\nOutput JSON format for backend integration:")
    print("""
{
  "vehicle_counts": {
    "North": %d,
    "South": %d,
    "East": %d,
    "West": %d
  }
}
""" % (
        results["vehicle_counts"]["North"],
        results["vehicle_counts"]["South"],
        results["vehicle_counts"]["East"],
        results["vehicle_counts"]["West"]
    ))

if __name__ == "__main__":
    # Create images directory if it doesn't exist
    os.makedirs("images", exist_ok=True)
    
    # Check if lane images exist, if not provide instructions
    required_files = ["north.jpg", "south.jpg", "east.jpg", "west.jpg"]
    missing_files = [f for f in required_files if not os.path.exists(os.path.join("images", f))]
    
    if missing_files:
        print("Missing required lane images:")
        for file in missing_files:
            print(f"  - images/{file}")
        
        print("\nPlease add the following images to the 'images' directory:")
        print("  - north.jpg: Traffic image for North lane")
        print("  - south.jpg: Traffic image for South lane")
        print("  - east.jpg: Traffic image for East lane")
        print("  - west.jpg: Traffic image for West lane")
        print("\nThen run this script again.")
    else:
        main_lane_processing()