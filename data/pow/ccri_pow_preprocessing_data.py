import json
import os

blockchain = 'bitcoin'

# Preprocessing emissions data
filepath = os.path.dirname(__file__)
emission_raw_file_path = os.path.join(filepath, blockchain, 'data', 'raw', '{}_ccri_emissions.json'.format(blockchain))
if os.path.exists(emission_raw_file_path):

    json_data = json.load(
        open(os.path.join(filepath, blockchain, 'data', 'raw', '{}_ccri_emissions.json'.format(blockchain))))

    emissions_file = open(os.path.join(filepath, blockchain, 'data', '{}_emissions.csv'.format(blockchain)), 'w+')

    emissions_data = ["Date,Emissions(g)"]
    for entry in json_data["entries"]:
        emissions_data.append("{},{}".format(entry["date"], entry["emissions_24h"] * 1000000))

    emissions_file.write("\n".join(emissions_data))

# Preprocessing power demand data
power_raw_file_path = os.path.join(filepath, blockchain, 'data', 'raw', '{}_ccri_power_demand.json'.format(blockchain))
if os.path.exists(power_raw_file_path):
    json_data = json.load(
        open(power_raw_file_path))

    power_demand_file = open(os.path.join(filepath, blockchain, 'data', '{}_power_demand.csv'.format(blockchain)), 'w+')

    power_demand_data = ["Date,Power Demand(kWh)"]
    for entry in json_data["entries"]:
        power_demand_data.append("{},{}".format(entry["date"], entry["consumption_24h"] * 10**9))

    power_demand_file.write("\n".join(power_demand_data))
