#!/usr/bin/env python

import requests
from random import *

#random board size from 1*1 to 10*10
row = randint(1, 10)
col = randint(1, 10)
#random start point, when s_i == row or s_j == col should be handled
s_i = randint(0, row)
s_j = randint(0, col)
#random start point, when e_i == row or e_j == col should be handled
e_i = randint(0, row)
e_j = randint(0, col)
#random 6 obstacles, if it's the same as start point or end point it 
#will be ignored
obstacles = []
for x in range(6):
    a = {
        'i': randint(0,row-1),
        'j': randint(0,col-1),
        'value': 10.0
    }
    obstacles.append(a)

print obstacles

r = requests.post("http://localhost:3000/reset",json={})
print(r.status_code,r.reason)

r = requests.post("http://localhost:3000/api/maps", json={'row': row,'col': col})
if (r.status_code == 400):
    print (r.status_code, r.reason, 'Invalid Input')
else:
     print(r.status_code, r.reason, r.json())

r = requests.post("http://localhost:3000/api/paths/start", json={'i': s_i, 'j': s_j})
if (r.status_code == 400):
    print (r.status_code, r.reason, 'Invalid Input')
else:
    print(r.status_code, r.reason, r.json())

r = requests.post("http://localhost:3000/api/paths/goal", json={'i': e_i, 'j': e_j})
if (r.status_code == 400):
    print (r.status_code, r.reason, 'Invalid Input')
else:
    print(r.status_code, r.reason, r.json())

r = requests.post("http://localhost:3000/api/costs", json={
    'costs': obstacles
})
if (r.status_code == 400):
    print (r.status_code, r.reason, 'Invalid Input')
else:
    print(r.status_code, r.reason, r.json())

r = requests.get("http://localhost:3000/api/paths")
if (r.status_code == 400):
    print (r.status_code, r.reason, 'Invalid Input')
else:
    print(r.status_code, r.reason, r.json())

