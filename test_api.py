import requests
import sys

# URL of the backend API
url = "http://127.0.0.1:8000/api/analyze"

# Path to the image file to upload
# Using a sample image preserved during cleanup
image_path = "backend/sample_image.jpg" 

try:
    with open(image_path, "rb") as f:
        print(f"Uploading {image_path} to {url}...")
        files = {"file": f}
        response = requests.post(url, files=files)
        
        if response.status_code == 200:
            print("\n✅ Success! Response:")
            data = response.json()
            print(f"Disease Readable: {data.get('disease_readable')}")
            print(f"Is Healthy: {data.get('is_healthy')}")
            print(f"Confidence: {data.get('confidence')}")
            print(f"Severity: {data.get('severity')}")
            print("-" * 20)
            print("Reasoning Preview:")
            print(data.get('reasoning')[:200] + "...")
        else:
            print(f"\n❌ Error {response.status_code}: {response.text}")

except FileNotFoundError:
    print(f"Error: Image content not found at {image_path}. Please check path.")
except Exception as e:
    print(f"An error occurred: {e}")
