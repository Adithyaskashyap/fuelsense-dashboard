"""
Example Python WebSocket server for Raspberry Pi
This shows how to send vehicle data to the dashboard.

Install dependencies:
    pip install websockets

Run:
    python websocket_server.py
"""

import asyncio
import json
import websockets

# Store connected clients
connected_clients = set()

async def send_vehicle_data(websocket):
    """Send vehicle data to a connected client"""
    connected_clients.add(websocket)
    try:
        # Keep connection alive
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)

async def broadcast_data(data: dict):
    """Broadcast data to all connected clients"""
    if connected_clients:
        message = json.dumps(data)
        await asyncio.gather(
            *[client.send(message) for client in connected_clients]
        )

async def main():
    """Start WebSocket server"""
    async with websockets.serve(send_vehicle_data, "0.0.0.0", 8765):
        print("WebSocket server started on ws://0.0.0.0:8765")
        
        # Example: Simulate sending data every 500ms
        # Replace this with your actual sensor/model data
        while True:
            # Your vehicle data from sensors/ML model
            vehicle_data = {
                "fuelIn": 45.5,      # Liters in tank
                "fuelOut": 2.3,      # Liters consumed
                "gear": 3,           # Current gear (0 = neutral, 1-6)
                "rpm": 2500,         # Engine RPM
                "speed": 65,         # Speed in km/h
                "mileage": 14.2,     # Predicted mileage from your AI model (km/L)
            }
            
            await broadcast_data(vehicle_data)
            await asyncio.sleep(0.5)  # Send every 500ms

if __name__ == "__main__":
    asyncio.run(main())
