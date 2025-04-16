from ultralytics import YOLO
import cv2
import numpy as np
import json
import os
from pathlib import Path
import time

class VehicleDetector:
    def __init__(self, model_size="n", confidence=0.25):
        """
        Initialize the Vehicle Detector with YOLO model
        
        Args:
            model_size (str): Size of YOLOv8 model ('n', 's', 'm', 'l', 'x')
            confidence (float): Detection confidence threshold
        """
        self.model = YOLO(f"yolov8{model_size}.pt")
        self.confidence = confidence
        
        # COCO dataset vehicle classes (subset)
        self.vehicle_classes = [2, 3, 5, 7]  # car, motorcycle, bus, truck
        self.class_names = {
            2: 'car',
            3: 'motorcycle', 
            5: 'bus',
            7: 'truck'
        }
        
    def detect_vehicles(self, image_path, save_output=False):
        """
        Detect and count vehicles in an image
        
        Args:
            image_path (str): Path to the image file
            save_output (bool): Whether to save annotated image
            
        Returns:
            dict: Detection results with counts and vehicle types
        """
        # Read image
        img = cv2.imread(image_path)
        if img is None:
            raise FileNotFoundError(f"Could not read image at {image_path}")
            
        # Store original for drawing
        original_img = img.copy()
        
        # Run inference
        results = self.model(img, conf=self.confidence)
        
        # Process results
        boxes = results[0].boxes
        
        # Count vehicles by type
        vehicle_counts = {
            "car": 0,
            "motorcycle": 0,
            "bus": 0,
            "truck": 0
        }
        
        # Detected vehicle coordinates for drawing
        detected_vehicles = []
        
        # Process each detection
        for i in range(len(boxes)):
            cls_id = int(boxes.cls[i].item())
            
            # Check if detection is a vehicle
            if cls_id in self.vehicle_classes:
                # Get class name
                class_name = self.class_names[cls_id]
                
                # Increment counter
                vehicle_counts[class_name] += 1
                
                # Get bounding box and confidence
                x1, y1, x2, y2 = boxes.xyxy[i].cpu().numpy()
                conf = boxes.conf[i].item()
                
                # Store for drawing
                detected_vehicles.append({
                    "class": class_name,
                    "box": (int(x1), int(y1), int(x2), int(y2)),
                    "conf": conf
                })
        
        # Calculate total count
        total_count = sum(vehicle_counts.values())
        
        # Save annotated image if requested
        if save_output:
            self._draw_detections(original_img, detected_vehicles, image_path)
        
        # Return detection summary
        return {
            "total_count": total_count,
            "vehicle_types": vehicle_counts,
            "detections": detected_vehicles
        }
        
    def process_lanes(self, lane_images, save_output=False):
        """
        Process multiple lane images and return counts for each lane
        
        Args:
            lane_images (dict): Dictionary with lane names as keys and image paths as values
            save_output (bool): Whether to save annotated images
            
        Returns:
            dict: Results formatted for backend integration
        """
        results = {}
        
        # Process each lane
        for lane_name, image_path in lane_images.items():
            start_time = time.time()
            lane_results = self.detect_vehicles(image_path, save_output)
            processing_time = time.time() - start_time
            
            # Store results for this lane
            results[lane_name] = {
                "count": lane_results["total_count"],
                "vehicle_types": lane_results["vehicle_types"],
                "processing_time": round(processing_time, 3)
            }
            
        # Format for backend
        output = {
            "vehicle_counts": {lane: data["count"] for lane, data in results.items()},
            "detailed_results": results
        }
        
        return output
            
    def _draw_detections(self, image, detections, image_path):
        """Draw bounding boxes and labels on the image"""
        # Color mapping for different vehicle types
        colors = {
            "car": (0, 255, 0),      # Green
            "motorcycle": (0, 165, 255),  # Orange
            "bus": (255, 0, 0),      # Blue
            "truck": (0, 0, 255)     # Red
        }
        
        # Draw each detection
        for det in detections:
            # Get detection info
            class_name = det["class"]
            box = det["box"]
            conf = det["conf"]
            color = colors.get(class_name, (255, 255, 255))
            
            # Draw bounding box
            cv2.rectangle(image, (box[0], box[1]), (box[2], box[3]), color, 2)
            
            # Prepare label text
            label = f"{class_name} {conf:.2f}"
            
            # Draw label background
            text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
            cv2.rectangle(image, (box[0], box[1] - text_size[1] - 10), 
                         (box[0] + text_size[0], box[1]), color, -1)
            
            # Draw text
            cv2.putText(image, label, (box[0], box[1] - 5),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        
        # Add total count
        total = len(detections)
        cv2.putText(image, f"Total vehicles: {total}", (10, 30),
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        # Create output filename
        output_dir = Path("output")
        output_dir.mkdir(exist_ok=True)
        
        base_name = Path(image_path).stem
        output_path = output_dir / f"{base_name}_detected.jpg"
        
        # Save annotated image
        cv2.imwrite(str(output_path), image)
        print(f"Annotated image saved to {output_path}")
    
    def process_video(self, video_path, output_path=None, frame_interval=15):
        """
        Process video and count vehicles
        
        Args:
            video_path (str): Path to video file
            output_path (str): Path to save output video (None for no output)
            frame_interval (int): Process every nth frame
            
        Returns:
            dict: Average vehicle counts across processed frames
        """
        # Open video file
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Could not open video file {video_path}")
        
        # Get video properties
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Setup video writer if output requested
        writer = None
        if output_path:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        # Variables to track counts
        frame_count = 0
        processed_frames = 0
        all_detections = []
        
        # Process frames
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            
            # Only process every nth frame
            if frame_count % frame_interval != 0:
                # Write original frame if we're saving video
                if writer:
                    writer.write(frame)
                continue
            
            # Process frame
            results = self.model(frame, conf=self.confidence)
            processed_frames += 1
            
            # Extract vehicle detections
            boxes = results[0].boxes
            frame_vehicles = {
                "car": 0,
                "motorcycle": 0,
                "bus": 0, 
                "truck": 0
            }
            
            detections = []
            
            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i].item())
                
                # Check if detection is a vehicle
                if cls_id in self.vehicle_classes:
                    # Get class name and box
                    class_name = self.class_names[cls_id]
                    frame_vehicles[class_name] += 1
                    
                    # For visualization
                    if writer:
                        x1, y1, x2, y2 = boxes.xyxy[i].cpu().numpy()
                        conf = boxes.conf[i].item()
                        detections.append({
                            "class": class_name,
                            "box": (int(x1), int(y1), int(x2), int(y2)),
                            "conf": conf
                        })
            
            # Store frame results
            all_detections.append(frame_vehicles)
            
            # Draw detections if saving video
            if writer:
                annotated_frame = frame.copy()
                # Color mapping
                colors = {
                    "car": (0, 255, 0),
                    "motorcycle": (0, 165, 255),
                    "bus": (255, 0, 0),
                    "truck": (0, 0, 255)
                }
                
                # Draw each detection
                for det in detections:
                    box = det["box"]
                    class_name = det["class"]
                    conf = det["conf"]
                    color = colors.get(class_name, (255, 255, 255))
                    
                    cv2.rectangle(annotated_frame, (box[0], box[1]), (box[2], box[3]), color, 2)
                    label = f"{class_name} {conf:.2f}"
                    cv2.putText(annotated_frame, label, (box[0], box[1] - 5),
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
                
                # Add frame count
                total = sum(frame_vehicles.values())
                cv2.putText(annotated_frame, f"Vehicles: {total}", (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                           
                # Show processing progress
                progress = f"Processing: {frame_count}/{total_frames}"
                cv2.putText(annotated_frame, progress, (10, height - 20),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
                
                writer.write(annotated_frame)
        
        # Release resources
        cap.release()
        if writer:
            writer.release()
        
        # Calculate average counts across all processed frames
        if processed_frames > 0:
            avg_counts = {}
            for veh_type in ["car", "motorcycle", "bus", "truck"]:
                avg_counts[veh_type] = round(sum(frame[veh_type] for frame in all_detections) / processed_frames, 1)
            
            total_avg = sum(avg_counts.values())
            
            return {
                "average_count": round(total_avg, 1),
                "average_by_type": avg_counts,
                "processed_frames": processed_frames,
                "total_frames": total_frames
            }
        else:
            return {"error": "No frames were processed"}


def export_json(data, output_file):
    """Export results to JSON file"""
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Results exported to {output_file}")


# Main function to run the tool directly
def main():
    import argparse
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="YOLO Vehicle Detection System")
    parser.add_argument("--mode", choices=["image", "images", "video"], default="images", 
                       help="Detection mode: single image, multiple images, or video")
    parser.add_argument("--input", required=True, help="Input image, directory, or video path")
    parser.add_argument("--output", default="vehicle_counts.json", help="Output JSON file")
    parser.add_argument("--save-visuals", action="store_true", help="Save annotated images/video")
    parser.add_argument("--model", default="n", choices=["n", "s", "m", "l", "x"], 
                       help="YOLOv8 model size (n=nano, s=small, m=medium, l=large, x=xlarge)")
    parser.add_argument("--conf", type=float, default=0.25, help="Confidence threshold")
    
    args = parser.parse_args()
    
    # Initialize detector
    detector = VehicleDetector(model_size=args.model, confidence=args.conf)
    
    try:
        if args.mode == "image":
            # Process a single image
            results = detector.detect_vehicles(args.input, save_output=args.save_visuals)
            output = {
                "vehicle_counts": {"Image": results["total_count"]},
                "detailed_results": {"Image": {
                    "count": results["total_count"],
                    "vehicle_types": results["vehicle_types"]
                }}
            }
            export_json(output, args.output)
            
        elif args.mode == "images":
            # Process multiple images (lane-based)
            if os.path.isdir(args.input):
                # Get all jpg/jpeg/png files in directory
                image_files = [f for f in os.listdir(args.input) 
                             if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                
                if not image_files:
                    print("No image files found in the directory")
                    return
                
                # Create lane dict based on filenames
                lane_images = {}
                for img in image_files:
                    # Use filename without extension as lane name
                    lane_name = os.path.splitext(img)[0].capitalize()
                    lane_images[lane_name] = os.path.join(args.input, img)
                
                # Process lanes
                results = detector.process_lanes(lane_images, save_output=args.save_visuals)
                export_json(results, args.output)
                
            else:
                print("Expected a directory for 'images' mode")
                
        elif args.mode == "video":
            # Process video
            output_video = None
            if args.save_visuals:
                output_dir = Path("output")
                output_dir.mkdir(exist_ok=True)
                output_video = str(output_dir / f"{Path(args.input).stem}_detected.mp4")
                
            results = detector.process_video(args.input, output_path=output_video)
            
            # Format output for backend
            output = {
                "vehicle_counts": {"Video": results["average_count"]},
                "detailed_results": {
                    "Video": {
                        "average_count": results["average_count"],
                        "average_by_type": results["average_by_type"],
                        "frames_analyzed": f"{results['processed_frames']}/{results['total_frames']}"
                    }
                }
            }
            export_json(output, args.output)
            
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()