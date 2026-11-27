# Machine Learning Model (XGBoost) Reverse Engineering

Study Case IDSECCONF CTF 2023 - PakBoost Challenge

## Preface

I participated with team **F7 Spammer** on IDSECCONF CTF 2023 and we got 2nd place. During the competition i discussed with my team consisted of lunashci and vidner while solving this challenge. I write this article because the process was very interesting while solving this challenge.

## Understanding The Algorithm

From <https://docs.aws.amazon.com/en_en/sagemaker/latest/dg/xgboost.html> we know that XGBoost is implementation of **gradient boosted trees algorithm**. XGBoost created a **tree** like image below

<figure><img src="https://raw.githubusercontent.com/dmlc/web-data/master/xgboost/model/cart.png" alt=""><figcaption><p><a href="https://xgboost.readthedocs.io/en/stable/tutorials/model.html#decision-tree-ensembles">https://xgboost.readthedocs.io/en/stable/tutorials/model.html#decision-tree-ensembles</a></p></figcaption></figure>

Since a **single tree** is not strong enough, XGBoost use **ensemble model** which combine more than single tree to do prediction like image below

<figure><img src="https://raw.githubusercontent.com/dmlc/web-data/master/xgboost/model/twocart.png" alt=""><figcaption><p><a href="https://xgboost.readthedocs.io/en/stable/tutorials/model.html#decision-tree-ensembles">https://xgboost.readthedocs.io/en/stable/tutorials/model.html#decision-tree-ensembles</a></p></figcaption></figure>

In this challenge we are given a json file that contains dump of **XGBoost** model. You can download the model here. To load the model we can use  code below.

```python
import xgboost as xgb

model = xgb.XGBClassifier()
model.load_model('authmodel.ai')
```

To use model for predicting something we need to know the size of input first. Looking at **authmodel.ai** then search about **learner\_model\_param** we will see **num\_feature** which indicates our **size** of input.

```json
----snippet----
"learner_model_param": {
      "base_score": "1.1924493E-1",
      "boost_from_average": "1",
      "num_class": "0",
      "num_feature": "13",
      "num_target": "1"
    },
----snippet----
```

Next we just need to create dummy input with valid size using **numpy**.

```python
import xgboost as xgb
import numpy as np
model = xgb.XGBClassifier()
model.load_model('authmodel.ai')

x0 = np.array([[i for i in range(13)]],dtype=np.int8)
print(model.predict(x0))
```

Code above result `[0]`, Since **estimator\_type** is classifier so basically the result represent the value of each class. `0` is **wrong** and `1` is **correct**. Our objective is to make the model produce `1` which indicate as valid credential in this case. First, we need to know how to dump each tree available on the model. Through googling we found the way to dump the model including the **tree** and **leaf** **values**.  Basicallyl leaf values used to determine the predicition (like previous image) <https://stackoverflow.com/questions/40926340/what-does-the-value-of-leaf-in-the-following-xgboost-model-tree-diagram-means>.&#x20;

```python
import xgboost as xgb
import numpy as np
model = xgb.XGBClassifier()
model.load_model('authmodel.ai')

booster = model.get_booster()
model_json_path = 'model_xgb.json'
booster.dump_model(model_json_path, dump_format='json')
```

To validate the **JSON** result we can also compare the values with tree **visualization** using code below.

```python
import xgboost as xgb
import numpy as np
import matplotlib.pyplot as plt

model = xgb.XGBClassifier()
model.load_model('authmodel.ai')

fig, ax = plt.subplots(figsize=(10, 10))
xgb.plot_tree(model, num_trees=11, ax=ax)
plt.show()
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FBIDLaWDX6OQxSMtsAir4%2Fimage.png?alt=media&amp;token=e39922da-bf85-4308-b85c-052d1ebb680f" alt=""><figcaption></figcaption></figure>

```json
----snippet----
  { "nodeid": 0, "depth": 0, "split": "f0", "split_condition": 67, "yes": 1, "no": 2, "missing": 2 , "children": [
    { "nodeid": 1, "depth": 1, "split": "f5", "split_condition": 51, "yes": 3, "no": 4, "missing": 4 , "children": [
      { "nodeid": 3, "depth": 2, "split": "f6", "split_condition": 51, "yes": 5, "no": 6, "missing": 6 , "children": [
        { "nodeid": 5, "leaf": 0.285208344 }, 
        { "nodeid": 6, "leaf": -0.233863339 }
      ]}, 
      { "nodeid": 4, "leaf": -0.278502375 }
    ]}, 
    { "nodeid": 2, "leaf": -0.298374265 }
  ]},
----snippet----
```

## Parsing XGBoost Tree

Since we've dump all the **trees**. Now we need to automatically parsing the data and find the **highest possible values** of leaf for each tree. To do this i implement **recursive** **function** to find the highest possible leaf and **trace** store the path to go to the highest leaf.  To trace the **correct path** i utilize several values in table below

| Column           | Description                      |
| ---------------- | -------------------------------- |
| split            | Index of compared input/feature  |
| split\_condition | Value compared with input        |
| yes              | nodeid if split\_condition true  |
| no               | nodeid if split\_condition false |
| nodeid           | id of each node                  |

From those values we can reconstruct the path to the highest values. Here is the implemented function for that algorithm

```python
# snippet
def trace_rec(arr, node, result_arr):
	if('children' not in node):
		if(node['leaf'] > 0):
			arr.append([node['leaf'], node['nodeid']])
			result_arr.append(arr)
	else:
		for i in node['children']:
			tmp = arr[:]
			tmp.append([node['split'], node['split_condition'], node['yes'], node['no'], node['nodeid']])
			trace_rec(tmp, i, result_arr)
	
new_arr = []

for i in range(11,100):
	init_length = len(new_arr)
	tmp_arr = new_arr[:]
	trace_rec([], data[i], new_arr)
	tmp_length = len(new_arr) - init_length
	if(tmp_length > 1):
		highest = -1
		index_highest = 0
		for j in range(len(new_arr)-1, len(new_arr)-1-tmp_length, -1):
			if(new_arr[j][-1][0] > highest):
				highest = new_arr[j][-1][0]
				index_highest = j
		tmp_arr.append(new_arr[index_highest])
		new_arr = tmp_arr[:]
# snippet
```

Next we just need to convert the path to readable constraint.

```python
res = ""
for i in new_arr:
	const = ""
	for j in range(len(i)-1, 0, -1):
		nodeid = i[j][-1]
		index = i[j-1].index(nodeid)
		if(index == 2):
			const += f"a1[{i[j-1][0][1:]}] < {i[j-1][1]}"
		else:
			const += f"a1[{i[j-1][0][1:]}] >= {i[j-1][1]}"
		const += "\n"
	res += const

print(res)
```

Here is the full code

```python
import json
import xgboost as xgb

model = xgb.XGBClassifier()
model.load_model('authmodel.ai')

booster = model.get_booster()
model_json_path = 'model_xgb.json'
booster.dump_model(model_json_path, dump_format='json')

data = json.loads(open("model_xgb.json", "rb").read())

def trace_rec(arr, node, result_arr):
	if('children' not in node):
		if(node['leaf'] > 0):
			arr.append([node['leaf'], node['nodeid']])
			result_arr.append(arr)
	else:
		for i in node['children']:
			tmp = arr[:]
			tmp.append([node['split'], node['split_condition'], node['yes'], node['no'], node['nodeid']])
			trace_rec(tmp, i, result_arr)
	
new_arr = []

for i in range(11,100):
	init_length = len(new_arr)
	tmp_arr = new_arr[:]
	trace_rec([], data[i], new_arr)
	tmp_length = len(new_arr) - init_length
	if(tmp_length > 1):
		highest = -1
		index_highest = 0
		for j in range(len(new_arr)-1, len(new_arr)-1-tmp_length, -1):
			if(new_arr[j][-1][0] > highest):
				highest = new_arr[j][-1][0]
				index_highest = j
		tmp_arr.append(new_arr[index_highest])
		new_arr = tmp_arr[:]

res = ""
for i in new_arr:
	const = ""
	for j in range(len(i)-1, 0, -1):
		nodeid = i[j][-1]
		index = i[j-1].index(nodeid)
		if(index == 2):
			const += f"a1[{i[j-1][0][1:]}] < {i[j-1][1]}"
		else:
			const += f"a1[{i[j-1][0][1:]}] >= {i[j-1][1]}"
		const += "\n"
	res += const

print(res)
```

We try to use SMT solver like z3 to find the correct values but it can't since many values are **intersect**. So next step is grouping the constraint with same index then analyze it manually to **find possible input**.

```python
import json
import xgboost as xgb

model = xgb.XGBClassifier()
model.load_model('authmodel.ai')

booster = model.get_booster()
model_json_path = 'model_xgb.json'
booster.dump_model(model_json_path, dump_format='json')

data = json.loads(open("model_xgb.json", "rb").read())

def trace_rec(arr, node, result_arr):
	if('children' not in node):
		if(node['leaf'] > 0):
			arr.append([node['leaf'], node['nodeid']])
			result_arr.append(arr)
	else:
		for i in node['children']:
			tmp = arr[:]
			tmp.append([node['split'], node['split_condition'], node['yes'], node['no'], node['nodeid']])
			trace_rec(tmp, i, result_arr)
	
new_arr = []

for i in range(11,100):
	init_length = len(new_arr)
	tmp_arr = new_arr[:]
	trace_rec([], data[i], new_arr)
	tmp_length = len(new_arr) - init_length
	if(tmp_length > 1):
		highest = -1
		index_highest = 0
		for j in range(len(new_arr)-1, len(new_arr)-1-tmp_length, -1):
			if(new_arr[j][-1][0] > highest):
				highest = new_arr[j][-1][0]
				index_highest = j
		tmp_arr.append(new_arr[index_highest])
		new_arr = tmp_arr[:]

res = ""
dict = {}
for i in range(13):
	dict[i] = []

for i in new_arr:
	const = ""
	for j in range(len(i)-1, 0, -1):
		nodeid = i[j][-1]
		index = i[j-1].index(nodeid)
		if(index == 2):
			dict[int(i[j-1][0][1:])].append(f"< {i[j-1][1]}")
		else:
			dict[int(i[j-1][0][1:])].append(f">= {i[j-1][1]}")
		const += "\n"
	res += const

for i in dict:
	for j in dict[i]:
		print(f"a1[{i}] {j}")
	print()
```

```
a1[0] < 67
a1[0] < 67
a1[0] < 67
a1[0] < 67
a1[0] < 67
a1[0] >= 66
a1[0] < 67
a1[0] < 67
a1[0] < 67
a1[0] < 67
a1[0] < 67
a1[0] < 67
a1[0] < 67
a1[0] < 77
a1[0] >= 66
a1[0] < 67
a1[0] < 67

a1[1] >= 72
a1[1] < 80
a1[1] < 81
a1[1] >= 76
a1[1] >= 76
a1[1] < 83
a1[1] >= 79
a1[1] < 83
a1[1] >= 79
a1[1] >= 79
a1[1] >= 76
a1[1] < 80
a1[1] < 80
a1[1] >= 76
a1[1] < 80
a1[1] >= 79
a1[1] < 80
a1[1] >= 79
a1[1] < 80
a1[1] < 80
a1[1] >= 79
a1[1] < 80
a1[1] >= 79
a1[1] < 80
a1[1] >= 79
a1[1] < 80
a1[1] < 80
a1[1] >= 79
a1[1] < 80
a1[1] < 80
a1[1] >= 79
a1[1] < 77
a1[1] >= 79
a1[1] < 77
a1[1] >= 79
a1[1] < 77
a1[1] >= 79
a1[1] >= 79
a1[1] < 78
a1[1] < 77
a1[1] >= 79
a1[1] >= 79

a1[2] < 74
a1[2] < 80
a1[2] >= 72
a1[2] < 76
a1[2] >= 72
a1[2] >= 74
a1[2] < 74
a1[2] >= 72
a1[2] < 74
a1[2] < 74
a1[2] >= 72
a1[2] < 73
a1[2] < 74
a1[2] < 73
a1[2] < 74
a1[2] < 74
a1[2] < 74

a1[3] < 52
a1[3] < 52
a1[3] < 50
a1[3] < 50
a1[3] < 50
a1[3] < 50
a1[3] < 50
a1[3] < 52
a1[3] < 52
a1[3] < 52
a1[3] < 50
a1[3] < 50
a1[3] < 50
a1[3] < 50
a1[3] < 49
a1[3] < 50

a1[4] < 51
a1[4] < 52
a1[4] >= 54
a1[4] < 52
a1[4] >= 54

a1[5] < 51
a1[5] < 51
a1[5] < 51
a1[5] < 51
a1[5] < 51
a1[5] < 51
a1[5] >= 50
a1[5] >= 50
a1[5] < 50
a1[5] < 50

a1[6] < 51
a1[6] < 51
a1[6] < 51
a1[6] < 51
a1[6] >= 50
a1[6] < 51
a1[6] < 51
a1[6] < 51
a1[6] < 51
a1[6] < 51
a1[6] >= 50
a1[6] < 51

a1[7] < 53
a1[7] < 51
a1[7] < 51
a1[7] < 54
a1[7] >= 54
a1[7] < 51
a1[7] < 51
a1[7] >= 54
a1[7] < 51
a1[7] < 54
a1[7] < 51
a1[7] < 54
a1[7] < 51
a1[7] < 54
a1[7] < 51

a1[8] < 51
a1[8] < 51
a1[8] < 54
a1[8] < 54
a1[8] < 51
a1[8] < 54
a1[8] < 54
a1[8] < 53

a1[9] < 52
a1[9] < 52
a1[9] < 53
a1[9] < 53
a1[9] < 53
a1[9] < 53
a1[9] < 53
a1[9] >= 51
a1[9] < 53
a1[9] >= 51
a1[9] < 53

a1[10] < 53
a1[10] < 53
a1[10] >= 51
a1[10] < 53
a1[10] < 53
a1[10] >= 51
a1[10] < 53
a1[10] < 52
a1[10] >= 51
a1[10] < 53
a1[10] < 53
a1[10] >= 51
a1[10] >= 51
a1[10] < 52

a1[11] < 54
a1[11] >= 56
a1[11] < 54

a1[12] >= 53
a1[12] >= 53
a1[12] >= 56
a1[12] >= 56
a1[12] >= 55
a1[12] >= 53
a1[12] >= 55
a1[12] >= 53
a1[12] >= 53
a1[12] >= 55
a1[12] >= 56
a1[12] < 57
a1[12] >= 55
a1[12] >= 55
a1[12] < 56
```

## Finding Valid Input

Now we know possible values for each index, so we just need to **bruteforce** it since the possibility is not too much. Below is the final script to find valid input

```python
import xgboost as xgb
import numpy as np
from itertools import product

model = xgb.XGBClassifier()
model.load_model('authmodel.ai')

poss = [[66], [79], [72], [i for i in range(48, 52)], [i for i in range(48, 52)], [50], [50], [i for i in range(51, 55)], [i for i in range(48, 51)], [51], [51], [i for i in range(48, 55)], [55]]
for i in product(*poss):
    x0 = np.array([list(i)],dtype=np.int8)
    y = model.predict(x0).tolist()
    if(y[0] == 1):
        print(f"Found: {''.join(map(chr, i))}")
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FnQDbBVVPaWR1u5vc6REs%2Fimage.png?alt=media&amp;token=be4445a4-e446-484c-9262-46dea0a97237" alt=""><figcaption></figcaption></figure>
