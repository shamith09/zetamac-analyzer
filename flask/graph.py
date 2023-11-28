import pandas as pd
import matplotlib.pyplot as plt

from pathlib import Path
data = pd.read_csv(Path(__file__).resolve().parent / 'scores.csv', header=None, names=['score', 'timestamp'])
data['timestamp'] = pd.to_datetime(data['timestamp'])
plt.plot(data['score'])
plt.show()
