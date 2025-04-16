from flask import Blueprint, request, jsonify
from .logic import update_traffic_counts, calculate_signal_times

traffic_bp = Blueprint("traffic", __name__)


@traffic_bp.route("/update_counts", methods=["POST"])
def update_counts():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400

    success, message = update_traffic_counts(data)
    status = "success" if success else "error"
    return jsonify({"status": status, "message": message})


@traffic_bp.route("/get_signal_times", methods=["GET"])
def get_signal_times():
    signal_times = calculate_signal_times()
    return jsonify(signal_times)
