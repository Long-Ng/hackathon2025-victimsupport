import json
import pandas as pd

def parseHospitalData(filePath):
    """
    Parses a JSON file containing hospital data and extracts only the fields needed
    for Google Maps (name, address, latitude, longitude, website).
    Cleans, validates, and exports the results to a DataFrame.
    """
    try:
        # Read the JSON file
        with open(filePath, 'r', encoding='utf-8') as file:
            data = json.load(file)
    except FileNotFoundError:
        print(f" Error: File not found at '{filePath}'")
        return None
    except json.JSONDecodeError:
        print(" Error: Invalid JSON format.")
        return None

    # Ensure data is in list form
    if isinstance(data, dict):
        data = [data]

    # Extract only the necessary fields
    hospital_data = []
    for hospital in data:
        hospital_info = {
            'name': hospital.get('name', 'Unknown Hospital'),
            'address': hospital.get('address', 'Unknown Address'),
            'latitude': hospital.get('latitude'),
            'longitude': hospital.get('longitude'),
            'website': hospital.get('website', 'No website available')
        }
        hospital_data.append(hospital_info)

    # Create DataFrame
    df = pd.DataFrame(hospital_data)

    # Convert coordinates to numeric and drop invalid rows
    df['latitude'] = pd.to_numeric(df['latitude'], errors='coerce')
    df['longitude'] = pd.to_numeric(df['longitude'], errors='coerce')
    df = df.dropna(subset=['latitude', 'longitude'])

    # Round coordinates for readability
    df['latitude'] = df['latitude'].round(6)
    df['longitude'] = df['longitude'].round(6)

    # Display results
    print("✅ Extracted Hospital Data:")
    print(df.head(10))
    print(f"\nTotal hospitals: {len(df)}")

    print("\nMissing values in each column:")
    print(df.isnull().sum())

    return df


if __name__ == "__main__":
    # Parse and export cleaned hospital data
    df = parseHospitalData('hospitals.json')
    
    if df is not None:
        output_file = 'extracted_hospital_data.csv'
        df.to_csv(output_file, index=False)
        print(f"\n💾 Data saved to '{output_file}'")
