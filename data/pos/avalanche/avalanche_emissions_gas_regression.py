import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import os
from datetime import datetime, timedelta

transactions_file_path = os.path.join(os.path.dirname(__file__), 'data', 'avalanche_transactions.csv')
gas_file_path = os.path.join(os.path.dirname(__file__), 'data', 'avalanche_gas.csv')

base_power_demand = 42.5741  # watt
marginal_power_per_tps = 0.1092  # watt/tps
carbon_intensity = 379  # gCO2e/kWh

# Create new file
transaction_data = {}
gas_data = {}
for data_line in open(transactions_file_path).readlines()[1:]:
    parts = data_line.split(',')
    transaction_data[parts[0]] = float(parts[1].strip())

for data_line in open(gas_file_path).readlines()[1:]:
    parts = data_line.split(',')
    gas_data[parts[0]] = float(parts[1].strip())

energy_per_day = []
gas_per_day = []
start_date = datetime.strptime('2023-09-01', '%Y-%m-%d')
end_date = datetime.strptime('2024-02-27', '%Y-%m-%d')

for i in range((end_date - start_date).days + 1):
    date = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
    if (date in transaction_data) and (date in gas_data):
        energy_per_day.append(24 * (transaction_data[date]
                                    * marginal_power_per_tps / (24 * 3600)
                                    + base_power_demand) * carbon_intensity/1000)
        gas_per_day.append(gas_data[date])


x = np.array(gas_per_day).reshape((-1, 1))
y = np.array(energy_per_day)

# Linear regression
model = LinearRegression()
model.fit(x, y)
print("b0: {} , b1 : {}, R square : {}".format(model.intercept_, model.coef_, model.score(x, y)))
plt.scatter(x, y, color='blue')

plt.plot(x, y, color='red')
plt.title('Avalanche C Emissions Gas Linear Regression')
plt.xlabel('Gas')
plt.ylabel('Emissions(g) Per Node')

plt.show()

# b0: 371.1761123742084 , b1 : [4.89823124e-10], R square : 0.925969223623372