import json
from datetime import datetime, timedelta
import os

filepath = os.path.dirname(__file__)
equipment_file = open(os.path.join(filepath, 'data', 'raw', 'bitcoin_mining_equipments_raw.csv'))
equipment_data = [
    "Name,Release Date,Deployment Date,Hashing Power (TH),Power (W),Weight (kg),Power efficiency (W/kg),Life span (years)"]
for line in equipment_file.readlines()[1:]:
    parts = line.split(";")
    equipment = {}
    if len(parts) == 8:
        hashing_power = float(parts[4])
        power = float(parts[5].replace(',', ''))
        power_efficiency = float(power) / hashing_power
        release_date = datetime.strptime(parts[2], "%d/%m/%Y")
        deployment_date = release_date + timedelta(days=60)
        equipment_data.append("{},{},{},{},{},{},{},{}".format(
            parts[0].replace('\u00a0', ""),
            release_date.strftime("%Y-%m-%d"),
            deployment_date.strftime("%Y-%m-%d"),
            hashing_power,
            power,
            parts[7].strip(),
            power_efficiency,
            5
        ))

equipment_data.sort(key=lambda x: x.split(',')[1], reverse=True)
equipment_data_file = open(os.path.join(filepath, 'data', 'bitcoin_mining_equipments.csv'), 'w+')
equipment_data_file.write("\n".join(equipment_data))

# Process breakeven data
cbeci_breakeven_data = json.load(
    open(os.path.join(filepath, 'data', 'raw', 'bitcoin_cbeci_breakeven_threshold_raw.json')))
breakeven_data = ["Date,Power Threshold(W/TH)"]
for item in cbeci_breakeven_data['data']:
    for i in range(0, 7):
        date = datetime.fromtimestamp(item['x'] / 1000) + timedelta(days=i)
        breakeven_data.append("{},{}".format(date.strftime("%Y-%m-%d"), item['y'] * 1000))

breakeven_threshold_file = open(os.path.join(filepath, 'data', 'bitcoin_breakeven_threshold.csv'), 'w+')
breakeven_threshold_file.write("\n".join(breakeven_data))
