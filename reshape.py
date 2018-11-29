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
			byParam[param]["inc_q1_" + category] = float(row[h["pctchginafttaxincpercent_pct_2"]])
			byParam[param]["inc_q2_" + category] = float(row[h["pctchginafttaxincpercent_pct_3"]])
			byParam[param]["inc_q3_" + category] = float(row[h["pctchginafttaxincpercent_pct_4"]])
			byParam[param]["inc_q4_" + category] = float(row[h["pctchginafttaxincpercent_pct_5"]])
			byParam[param]["inc_q5_" + category] = float(row[h["pctchginafttaxincpercent_pct_13"]])
			byParam[param]["inc_top10_" + category] = float(row[h["pctchginafttaxincpercent_pct_14"]])
			byParam[param]["inc_top5_" + category] = float(row[h["pctchginafttaxincpercent_pct_15"]])
			byParam[param]["inc_top1_" + category] = float(row[h["pctchginafttaxincpercent_pct_16"]])
			byParam[param]["inc_top05_" + category] = float(row[h["pctchginafttaxincpercent_pct_17"]])

dataOut = []
for d in byParam:
	dataOut.append(byParam[d])

with open('data/pretty.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, indent=4, separators=(',', ': '))


with open('data/data.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, separators=(',', ':'))



