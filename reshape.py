import csv
import json
cr = csv.reader(open("data/raw.csv","rU"))

head = cr.next()
h = {}

for i in range(0, len(head)):
	h[head[i]] = i

byParam = {}
for row in cr:
	param = row[h["paramfilename"]]
	if param not in byParam:
		byParam[param] = {}

	byParam[param]["burden"] = float(row[h["burden_chg"]])

	categories = ["all","elderly","hoh","kids","mfj","mfs","mkids","mminorkids","myoungkids","nokids","notelderly","single"]
	for category in categories:
		if(row[h["category"]] == category):
			byParam[param]["inc_all_" + category] = float(row[h["pctchginafttaxincpercent_pct_12"]])

dataOut = []
for d in byParam:
	dataOut.append(byParam[d])

with open('data/pretty.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, indent=4, separators=(',', ': '))


with open('data/data.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, separators=(',', ':'))



