import json
import os

# Gas preprocessing
file_path = os.path.dirname(__file__)
gas_files_path = os.path.join(file_path, 'data', 'raw', 'gas_files')
gas_data = []

for filename in os.listdir(gas_files_path):
    json_obj = json.load(open(os.path.join(gas_files_path, filename)))
    gas_data.extend(json_obj['data']['get_execution']['execution_succeeded']['data'])

gas_data = sorted(gas_data, key=lambda x: x['time'])

output_file = open(os.path.join(file_path, 'data', 'solana_gas.csv'), 'w+')
lines = ['Date(UTC),Value']
for data_line in gas_data:
    lines.append('{},{}'.format(data_line['time'], data_line['computeunitsconsumed']))

output_file.write("\n".join(lines))
output_file.close()

# Transactions preprocessing
transactions = json.load(open(os.path.join(file_path, 'data', 'raw', 'solana_transactions.json')))
transactions = transactions['data']['get_execution']['execution_succeeded']['data']
transactions_data = sorted(transactions, key=lambda x: x['_col0'])

output_file = open(os.path.join(file_path, 'data', 'solana_transactions.csv'), 'w+')
lines = ['Date(UTC),Value']
for data_line in transactions_data:
    lines.append('{},{}'.format(data_line['_col0'], data_line['transactions_per_day']))

output_file.write("\n".join(lines))
output_file.close()
