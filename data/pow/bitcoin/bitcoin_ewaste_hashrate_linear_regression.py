import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import os
from datetime import datetime, timedelta

filepath = os.path.dirname(__file__)

bitcoin_ewaste = {}
bitcoin_hashrate = {}

for line in open(os.path.join(filepath, 'data', 'bitcoin_ewaste_per_day.csv')).readlines()[1:]:
    parts = line.split(',')
    date = parts[0]
    bitcoin_ewaste[date] = float(parts[1].strip())

for line in open(os.path.join(filepath, 'data', 'bitcoin_hashrate.csv')).readlines()[1:]:
    parts = line.split(',')
    date = parts[0]
    bitcoin_hashrate[date] = float(parts[1].strip())

start_date = datetime.strptime('2023-01-01', '%Y-%m-%d')
end_date = datetime.strptime('2024-03-19', '%Y-%m-%d')
bitcoin_hashrate_data = []
bitcoin_ewaste_data = []
for i in range((end_date - start_date).days + 1):
    date = (start_date + timedelta(days=i)).strftime('%Y-%m-%d')
    if (date in bitcoin_ewaste) and (date in bitcoin_hashrate):
        bitcoin_hashrate_data.append(bitcoin_hashrate[date])
        bitcoin_ewaste_data.append(bitcoin_ewaste[date])

x = np.array(bitcoin_hashrate_data).reshape((-1, 1))
y = np.array(bitcoin_ewaste_data)

# Linear regression
model = LinearRegression()
model.fit(x, y)
print("b0: {} , b1 : {}, R square : {}".format(model.intercept_, model.coef_, model.score(x, y)))
plt.scatter(x, y, color='blue')

plt.plot(x, y, color='red')
plt.title('Bitcoin Ewaste - Hash rate')
plt.xlabel('HashRate')
plt.ylabel('Ewaste')

plt.show()

# b0: 9302292.008423146 , b1 : [4.42885761e-14], R square : 0.8988278893042796
