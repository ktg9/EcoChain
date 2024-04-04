from datetime import datetime, timedelta
import os

filepath = os.path.dirname(__file__)

# Load equipment data
equipment_data_file = open(os.path.join(filepath, 'data', 'bitcoin_mining_equipments.csv'))
equipment_json_data = []
for equipment_data in equipment_data_file.readlines()[1:]:
  data_parts = equipment_data.split(',')
  equipment_json_data.append({
    'name': data_parts[0],
    'power_efficiency': float(data_parts[6]),
    'hashing_power': float(data_parts[3]),
    'lifespan': int(data_parts[7].strip()),
    'weight': float(data_parts[5]),
    'deployment_date': datetime.strptime(data_parts[1], '%Y-%m-%d')
  })

# Load break even threshold data
breakeven_data_file = open(os.path.join(filepath, 'data', 'bitcoin_breakeven_threshold.csv'))
breakeven_json_data = {}
for breakeven_data in breakeven_data_file.readlines()[1:]:
  data_parts = breakeven_data.split(',')
  breakeven_json_data[data_parts[0]] = float(data_parts[1])

start_date = datetime.strptime('2014-08-30', '%Y-%m-%d')
end_date = datetime.strptime('2024-03-20', '%Y-%m-%d')

# Load hash rate data
hashrate_data_file = open(os.path.join(filepath, 'data', 'bitcoin_hashrate.csv'))
hashrate_json_data = {}
for hashrate_data in hashrate_data_file.readlines()[1:]:
  data_parts = hashrate_data.split(',')
  hashrate_json_data[data_parts[0]] = float(data_parts[1])


# Calculate weight factor for equipment
def weight_factor(date, equipment):
    month_since_deployment = (date - equipment['deployment_date']).days // 30

    w = 0
    if month_since_deployment < 0 or month_since_deployment >= 60:
        w = 0
    elif 0 <= month_since_deployment < 12:
        w = 1
    elif 12 <= month_since_deployment < 24:
        w = 0.8
    elif 24 <= month_since_deployment < 36:
        w = 0.6
    elif 36 <= month_since_deployment < 48:
        w = 0.4
    elif 48 <= month_since_deployment < 60:
        w = 0.2

    return {
      'weight': equipment['weight'],
      'hashing_power': equipment['hashing_power'] * 10 ** 12,  # convert from TH to H
      'weight_factor': w,
      'lifespan': equipment['lifespan'],
      'name': equipment['name']
    }


bitcoin_ewaste_data = ["Date,E-waste(g)"]

for d in range((end_date - start_date).days):
    date = start_date + timedelta(days=d)
    # Active equipments : must have power efficiency < break even threshold, 1.1 is the power usage effectiveness
    breakeven_threshold = breakeven_json_data[date.strftime('%Y-%m-%d')]
    active_equipments = list(filter(lambda equipment: equipment['power_efficiency'] * 1.1 < breakeven_threshold,
                                    equipment_json_data))

    # Calculate weight factors
    equipment_weight_factors = list(map(lambda x: weight_factor(date, x), active_equipments))
    # Filter all equipment with factors > 0
    equipment_with_weight_factor_not_zero = list(
      filter(lambda equipment: equipment['weight_factor'] > 0, equipment_weight_factors))
    hashrate = hashrate_json_data[date.strftime('%Y-%m-%d')]

    # Total weight factors
    total_weight_factors = sum(equipment['weight_factor'] for equipment in equipment_with_weight_factor_not_zero)
    # Sum of (weight_factor * weight * hash_rate / hashing_power) of all satisfied equipments
    total_equipment_amount = sum(
      equipment['weight_factor'] * hashrate * equipment['weight'] / equipment['hashing_power'] for equipment in
      equipment_with_weight_factor_not_zero)

    # All equipments have lifespan = 5 years, so ewaste per day
    # = (total_equipment_amount / (total_weight_factors * 5 * 365.25))
    e_waste = total_equipment_amount * 1000 / (total_weight_factors * 5 * 365.25)
    bitcoin_ewaste_data.append("{},{}".format(date.strftime('%Y-%m-%d'), e_waste))

    # Save result
    bitcoin_ewaste_file = hashrate_data_file = open(os.path.join(filepath, 'data', 'bitcoin_ewaste_per_day.csv'), 'w+')
    bitcoin_ewaste_file.write("\n".join(bitcoin_ewaste_data))
