import asyncio
import aiohttp
import json

BASE_URL = "http://localhost:8000/api"
HEADERS = {
    "Authorization": "Bearer ceqvky-9566e8685e8f4b16a1ac8f8b73ef963f",
    "Content-Type": "application/json"
}

async def get_simulations(session):
    async with session.get(f"{BASE_URL}/simulations/4", headers=HEADERS) as response:
        if response.status == 200:
            return await response.json()
        else:
            print(f"Failed to get simulations. Status: {response.status}")
            return None

async def delete_valuation(session, external_simulation_id):
    url = f"{BASE_URL}/business-value/{external_simulation_id}/"
    async with session.delete(url, headers=HEADERS) as response:
        return external_simulation_id, response.status

async def main():
    async with aiohttp.ClientSession() as session:
        simulations = await get_simulations(session)
        
        if not simulations:
            print("No simulations found or error occurred.")
            return

        delete_tasks = []
        for simulation in simulations:
            external_simulation_id = simulation.get('external_simulation_id')
            if external_simulation_id:
                delete_tasks.append(delete_valuation(session, external_simulation_id))

        results = await asyncio.gather(*delete_tasks)

        success_count = 0
        fail_count = 0
        for external_simulation_id, status in results:
            if status == 204:  # Assuming 204 is the success status for DELETE
                success_count += 1
                print(f"Successfully deleted valuation: {external_simulation_id}")
            else:
                fail_count += 1
                print(f"Failed to delete valuation: {external_simulation_id}. Status: {status}")

        print(f"\nSummary:")
        print(f"Total valuations processed: {len(results)}")
        print(f"Successfully deleted: {success_count}")
        print(f"Failed to delete: {fail_count}")

if __name__ == "__main__":
    asyncio.run(main())