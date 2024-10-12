import asyncio
import aiohttp
import json
import cProfile
import pstats
import io
from datetime import datetime

URL = "http://localhost:8000/api/business-value/"
HEADERS = {
    "Authorization": "Bearer ceqvky-9566e8685e8f4b16a1ac8f8b73ef963f",
    "Content-Type": "application/json"
}

with open('./paste.json', 'r') as file:
    PAYLOAD = json.load(file)

async def make_request(session, url, payload):
    try:
        async with session.post(url, json=payload, headers=HEADERS) as response:
            return await response.text(), response.status
    except Exception as e:
        return str(e), None

async def run_stress_test(num_requests):
    async with aiohttp.ClientSession() as session:
        tasks = [make_request(session, URL, PAYLOAD) for _ in range(num_requests)]
        return await asyncio.gather(*tasks)

def profile_stress_test(num_requests):
    pr = cProfile.Profile()
    pr.enable()
    
    results = asyncio.run(run_stress_test(num_requests))
    
    pr.disable()
    s = io.StringIO()
    ps = pstats.Stats(pr, stream=s).sort_stats('cumulative')
    #ps.print_stats()
    
    return results, s.getvalue()

def log_results(num_requests, results, profile_output):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"stress_test_results_{num_requests}_{timestamp}.txt"
    
    with open(filename, 'w') as f:
        f.write(f"Stress Test Results for {num_requests} simultaneous requests\n")
        f.write("=" * 50 + "\n\n")
        
        for i, (response, status) in enumerate(results, 1):
            f.write(f"Request {i}:\n")
            f.write(f"Status: {status}\n")
            f.write(f"Response: {response[:200]}...\n")  # Truncate long responses
            f.write("-" * 30 + "\n")
        
        f.write("\nProfile Results:\n")
        f.write("=" * 50 + "\n")
        f.write(profile_output)

def main():
    for num_requests in [1,2,3]:
        print(f"Running stress test with {num_requests} simultaneous requests...")
        results, profile_output = profile_stress_test(num_requests)
        log_results(num_requests, results, profile_output)
        print(f"Test completed. Results saved.")

if __name__ == "__main__":
    main()