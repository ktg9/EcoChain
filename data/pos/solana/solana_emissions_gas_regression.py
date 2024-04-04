import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import os
from datetime import datetime, timedelta

# Get transaction and gas data
transactions_file_path = os.path.join(os.path.dirname(__file__), 'data', 'solana_transactions.csv')
gas_file_path = os.path.join(os.path.dirname(__file__), 'data', 'solana_gas.csv')
# CCRI data for Solana
base_power_demand = 313.9651  # watt
marginal_power_per_tps = 0.0130  # watt/tps
carbon_intensity = 327  # gCO2e/kWh

# Load transactions data and gas data
transaction_data = {}
gas_data = {}
for data_line in open(transactions_file_path).readlines()[1:]:
  parts = data_line.split(',')
  transaction_data[parts[0]] = float(parts[1].strip())

for data_line in open(gas_file_path).readlines()[1:]:
  parts = data_line.split(',')
  gas_data[parts[0]] = float(parts[1].strip())

# Process data for linear regression
emissions_per_day = []
gas_per_day = []
start_date = datetime.strptime('2023-09-01', '%Y-%m-%d')
end_date = datetime.strptime('2024-02-27', '%Y-%m-%d')

for i in range((end_date - start_date).days + 1):
  date = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
  if (date in transaction_data) and (date in gas_data):
    # emission = (base_power_demand + marginal_power * tps) * carbon_intensity
    emissions_per_day.append(24 * (transaction_data[date]
                                   * marginal_power_per_tps / (24 * 3600)
                                   + base_power_demand) * carbon_intensity / 1000)
    gas_per_day.append(gas_data[date])

x = np.array(gas_per_day).reshape((-1, 1))
y = np.array(emissions_per_day)

# Linear regression
model = LinearRegression()
model.fit(x, y)
print("b0: {} , b1 : {}, R square : {}".format(model.intercept_, model.coef_, model.score(x, y)))
plt.scatter(x, y, color='blue')

plt.plot(x, y, color='red')
plt.title('Solana Emissions Gas Linear Regression')
plt.xlabel('Gas')
plt.ylabel('Emissions(g) Per node')

plt.show()

# b0: 2471.9084650492014 , b1 : [1.01622378e-11], R square : 0.9299947426555761
