import json
import os

# Gas preprocessing
json_obj = json.load(open(os.path.join(os.path.dirname(__file__), 'data', 'avalanche_gas.json')))
gas_data = json_obj['data']['get_execution']['execution_succeeded']['data']
gas_data = sorted(gas_data, key=lambda x: x['block_date'])

output_file = open(os.path.join(os.path.dirname(__file__), 'data', 'avalanche_gas.csv'), 'w+')
lines = ['Date,Value']
for data_line in gas_data:
  lines.append('{},{}'.format(data_line['block_date'], data_line['_col0']))

output_file.write("\n".join(lines))
output_file.close()

# Transactions preprocessing

transactions = json.load((open(os.path.join(os.path.dirname(__file__), 'data', 'avalanche_transactions.json'))))
transactions = transactions['data']['get_execution']['execution_succeeded']['data']
transactions_data = sorted(transactions, key=lambda x: x['block_date'])

output_file = open(os.path.join(os.path.dirname(__file__), 'data', 'avalanche_transactions.csv'), 'w+')
lines = ['Date,Value']
for data_line in transactions_data:
  lines.append('{},{}'.format(data_line['block_date'], data_line['_col0']))

output_file.write("\n".join(lines))
output_file.close()
