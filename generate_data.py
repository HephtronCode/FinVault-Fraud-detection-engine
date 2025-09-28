"""
Data generator for creating Nigerian customer profiles and transaction histories.

This module generates fake customer data with realistic Nigerian names and locations,
creates transaction histories, and populates a Supabase database for fraud detection
system development and testing.
"""

import os
import random
from dotenv import load_dotenv
from supabase import create_client, Client
from faker import Faker

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
NUM_CUSTOMERS = 100
PCT_INTERNATIONAL_CUSTOMERS = 0.3  # 30% of customers will have transacted abroad
INTERNATIONAL_LOCATIONS = ["USA", "UK", "Ghana", "South Africa", "Canada", "UAE"]


# Check if credentials are set
if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError(
        "Supabase credentials not found. Make sure SUPABASE_URL and "
        "SUPABASE_SERVICE_KEY are in your .env file."
    )

# Initialize Supabase client and Faker for Nigerian context
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
fake = Faker("en_NG")  # Use the Nigerian locale for realistic names

# --- Data Generation Logic ---


def generate_and_insert_data():
    """
    Generate 100 Nigeria-based customers with their transaction history.

    Creates customer profiles, generates realistic transaction data,
    and calculates average transaction values for each customer.
    """
    print(f"Starting data generation for {NUM_CUSTOMERS} customers...")

    # 1. Generate 100 unique customer profiles in memory
    print("Generating customer profiles...")
    customers_to_create = []
    for _ in range(NUM_CUSTOMERS):
        locations = ["Nigeria"]
        # Some customers have international locations
        if random.random() < PCT_INTERNATIONAL_CUSTOMERS:
            num_extra_locations = random.randint(1, 2)
            extra_locs = random.sample(INTERNATIONAL_LOCATIONS, num_extra_locations)
            locations.extend(extra_locs)

        customer = {
            "full_name": fake.name(),
            "email": fake.unique.email(),
            "known_locations": list(set(locations)),  # Ensure unique locations
        }
        customers_to_create.append(customer)

    # 2. Bulk insert all customers for efficiency
    print(f"Bulk inserting {len(customers_to_create)} customers...")
    try:
        response = supabase.table("customers").insert(customers_to_create).execute()
        created_customers = response.data
        print(f"Successfully created {len(created_customers)} customers.")
    except Exception as e:
        print(f"Error inserting customers: {e}")
        raise

    # 3. Generate transaction history for each created customer
    print("\nGenerating transaction history for each customer...")
    all_transactions = []
    customers_to_update_avg = []

    for customer in created_customers:
        customer_id = customer["id"]
        locations = customer["known_locations"]

        total_value = 0
        num_transactions = random.randint(
            20, 80
        )  # Each customer has between 20 and 80 transactions

        for _ in range(num_transactions):
            # Determine transaction country with weighted distribution
            if len(locations) > 1:
                weights = [0.9] + [0.1 / (len(locations) - 1)] * (len(locations) - 1)
                country = random.choices(locations, weights=weights, k=1)[0]
            else:
                country = "Nigeria"

            transaction = {
                "customer_id": customer_id,
                "country": country,
                # Transaction amount between 1,500 and 120,000 NGN
                "amount": round(random.uniform(1500.00, 120000.00), 2),
            }
            total_value += transaction["amount"]
            all_transactions.append(transaction)

        # Prepare the average value update
        avg_value = round(total_value / num_transactions, 2)
        customers_to_update_avg.append({"id": customer_id, "avg": avg_value})

    # 4. Bulk insert all transactions for efficiency
    print(f"\nBulk inserting {len(all_transactions)} transactions...")
    try:
        supabase.table("transactions").insert(all_transactions).execute()
        print("All transactions inserted.")
    except Exception as e:
        print(f"Error inserting transactions: {e}")
        raise

    # 5. Update the average_transaction_value for each customer
    print("\nUpdating average transaction values for all customers...")
    try:
        for item in customers_to_update_avg:
            supabase.table("customers").update(
                {"average_transaction_value": item["avg"]}
            ).eq("id", item["id"]).execute()
        print("Average values updated.")
    except Exception as e:
        print(f"Error updating customer averages: {e}")
        raise

    print("\n--- Data generation complete! ---")
    print(
        f"Your Supabase database is now populated with {NUM_CUSTOMERS} "
        f"customers and their transaction histories."
    )


if __name__ == "__main__":
    generate_and_insert_data()
