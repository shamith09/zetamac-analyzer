import pandas as pd
import matplotlib.pyplot as plt

from pathlib import Path
# data = pd.read_csv(Path(__file__).resolve().parent / 'scores.csv', header=None, names=['score', 'timestamp'])
# data['timestamp'] = pd.to_datetime(data['timestamp'])
# plt.plot(data['score'])
# plt.show()
data = pd.read_csv(Path(__file__).resolve().parent / 'times.csv', header=None, names=['id', 'problem', 'time'])
plt.plot(data['time'])
plt.scatter(data['time'].idxmax(), data['time'].max(), color='g', label='max: ' + str(data['time'].max()) + ' ms')
plt.scatter(data['time'].idxmin(), data['time'].min(), color='r', label='min: ' + str(data['time'].min()) + ' ms')
plt.axhline(y=data['time'].mean(), color='c', linestyle='--', label='average: ' + str(int(data['time'].mean())) + ' ms')
plt.legend()
plt.ylabel('ms')
plt.show()
