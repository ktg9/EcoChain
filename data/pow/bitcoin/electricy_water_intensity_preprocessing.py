import json

electricity_water_intensity_raw_file = open('data/raw/electricity_water_intensity.csv')
electricity_water_intensity_file = open('data/electricity_water_intensity.json', 'w+')
electricity_water_intensity_data = {}
country_codes = json.load(open('data/raw/country_codes.json'))
for line in electricity_water_intensity_raw_file.readlines()[1:]:
  parts = line.split(',')
  country_name = parts[0]
  if country_name in country_codes:
    country_code = country_codes[parts[0]]

  electricity_water_intensity_data[country_code] = {
    'name': country_name,
    'electricity_water_intensity': float(parts[1].strip()),
    'unit': 'litre/kWh'
  }

average_electricity_water_intensity = (sum(
  electricity_water_intensity_data[x]['electricity_water_intensity']
  for x in electricity_water_intensity_data.keys()) / (len(electricity_water_intensity_data.keys())))

electricity_water_intensity_data['Unknown'] = {
  'electricity_water_intensity': average_electricity_water_intensity,
  'unit': 'litre/kWh'
}
json.dump(electricity_water_intensity_data, electricity_water_intensity_file, indent=2)
