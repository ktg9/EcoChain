import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import os
from datetime import datetime, timedelta

# Get transaction and gas data
transactions_file_path = os.path.join(os.path.dirname(__file__), 'data', 'ethereum_transactions.csv')
gas_file_path = os.path.join(os.path.dirname(__file__), 'data', 'ethereum_gas.csv')

# CCRI data for Ethereum
base_power_demand = 61.9741  # watt
marginal_power_per_tps = 0.1055  # watt/tps
carbon_intensity = 348  # gCO2e/kWh

# Load transactions data and gas data
transaction_data = {}
gas_data = {}
for data_line in open(transactions_file_path).readlines()[1:]:
  parts = data_line.split(',')
  date = parts[0].replace('"', '')
  transactions = float(parts[2].replace('"', '').strip())
  transaction_data[date] = transactions

for data_line in open(gas_file_path).readlines()[1:]:
  parts = data_line.split(',')
  date = parts[0].replace('"', '')
  gas = float(parts[2].replace('"', '').strip())
  gas_data[date] = gas

# Process data for linear regression
carbon_emission_per_day = []
gas_per_day = []
start_date = datetime.strptime('2022-09-15', '%Y-%m-%d')
end_date = datetime.strptime('2024-02-27', '%Y-%m-%d')

for i in range((end_date - start_date).days + 1):
  date = (start_date + timedelta(days=i)).strftime('%-m/%-d/%Y')
  if (date in transaction_data) and (date in gas_data):
    # emission = (base_power_demand + marginal_power * tps) * carbon_intensity
    carbon_emission_per_day.append(24 * (transaction_data[date]
                                         * marginal_power_per_tps / (24 * 3600)
                                         + base_power_demand) * carbon_intensity)
    gas_per_day.append(gas_data[date])

# Linear regression
x = np.array(gas_per_day).reshape((-1, 1))
y = np.array(carbon_emission_per_day)
model = LinearRegression()
model.fit(x, y)
print("b0: {} , b1 : {}, R square : {}".format(model.intercept_, model.coef_, model.score(x, y)))
plt.scatter(x, y, color='blue')

plt.plot(x, y, color='red')
plt.title('Ethereum Emissions Gas Linear Regression')
plt.xlabel('Gas')
plt.ylabel('Emissions(g)')
plt.show()

# b0: 536379.9266696639 , b1 : [-7.33293797e-08], R square : 0.0036297817564994173
