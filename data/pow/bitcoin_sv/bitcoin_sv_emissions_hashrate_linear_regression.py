import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import os
from datetime import datetime, timedelta

filepath = os.path.dirname(__file__)
emissions = {}
hashrate = {}

# Load emission and hash rate data
for line in open(os.path.join(filepath, 'data', 'bitcoin_sv_emissions.csv')).readlines()[1:]:
    parts = line.split(',')
    date = parts[0]
    emissions[date] = float(parts[1].strip())

for line in open(os.path.join(filepath, 'data', 'bitcoin_sv_hashrate.csv')).readlines()[1:]:
    parts = line.split(',')
    date = parts[0]
    hashrate[date] = float(parts[1].strip())

# Prepare data for linear regression
emissions_per_day = []
hashrate_per_day = []
start_date = datetime.strptime('2020-01-01', '%Y-%m-%d')
end_date = datetime.strptime('2024-03-19', '%Y-%m-%d')

for i in range((end_date - start_date).days + 1):
    date = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
    if (date in emissions) and (date in hashrate):
        emissions_per_day.append(emissions[date])
        hashrate_per_day.append(hashrate[date])

x = np.array(hashrate_per_day).reshape((-1, 1))
y = np.array(emissions_per_day)

# Linear regression
model = LinearRegression()
model.fit(x, y)
print("b0: {} , b1 : {}, R square : {}".format(model.intercept_, model.coef_, model.score(x, y)))
plt.scatter(x, y, color='blue')

plt.plot(x, y, color='red')
plt.title('Bitcoin SV Emissions Hashrate Linear Regression')
plt.xlabel('HashRate(H/s)')
plt.ylabel('Emissions(g)')

plt.show()

# b0: -41.31051423954841 , b1 : [5.94943458e-16], R square : 0.9022558228680946
