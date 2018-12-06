import csv
import json
cr = csv.reader(open("data/raw.csv","rU"))

head = cr.next()
h = {}

for i in range(0, len(head)):
	h[head[i]] = i

byParam = {}
count = 0
for row in cr:
	

	param = row[h["paramfilename"]]

	if param not in byParam:
		byParam[param] = {}


	# TO BE REMOVED, DEBUGGER		
	byParam[param]["count"] = count
	count += 1
	#####
	

	byParam[param]["burden"] = float(row[h["burden_chg"]])
	standard = float(row[h["standard1"]])
	if standard == 6500:
		byParam[param]["standard"] = "low"
	elif standard == 9250:
		byParam[param]["standard"] = "mediumLow"
	elif standard == 12000:
		byParam[param]["standard"] = "mediumHigh"
	elif standard == 13200:
		byParam[param]["standard"] = "high"
	else:
		print "uncategorized rate"

# pretty brittle, but 4 rate structures all have different vals for 2nd bracket, so for now this is working
	rates = float(row[h["rates2"]])
	if rates == .15:
		byParam[param]["rates"] = "a"
	elif rates == .12:
		byParam[param]["rates"] = "b"
	elif rates == .13:
		byParam[param]["rates"] = "c"
	elif rates == .14:
		byParam[param]["rates"] = "d"
	else:
		print "uncategoried rate"

	amtThreshold = float(row[h["amthrsh1"]])
	if amtThreshold == 123300:
		byParam[param]["amtThreshold"] = "low"
	elif amtThreshold == 500000:
		byParam[param]["amtThreshold"] = "high"
	else:
		print "uncategorized amt threshold"

	amtAmount = float(row[h["amtx1"]])
	if amtAmount == 55400:
		byParam[param]["amtAmount"] = "low"
	elif amtAmount == 70300:
		byParam[param]["amtAmount"] = "high"
	else:
		print "uncategorized amt amount"

	personal = float(row[h["exemption_amount"]])
	if personal == 0:
		byParam[param]["personal"] = "low"
	elif personal == 2050:
		byParam[param]["personal"] = "mediumLow"
	elif personal == 4150:
		byParam[param]["personal"] = "mediumHigh"
	elif personal == 5500:
		byParam[param]["personal"] = "high"
	else:
		print "uncategoried personal exemption"

	salt = float(row[h["saltcap"]])
	if salt == 0:
		byParam[param]["salt"] = "low"
	elif salt == 10000:
		byParam[param]["salt"] = "mediumLow"
	elif salt == 15000:
		byParam[param]["salt"] = "mediumHigh"
	elif salt == 20000:
		byParam[param]["salt"] = "high"
	else:
		print "uncategoried salt tax"

	ctcThreshold = float(row[h["childrefund_thresh"]])
	if ctcThreshold == 0:
		byParam[param]["ctcThreshold"] = "low"
	elif ctcThreshold == 1250:
		byParam[param]["ctcThreshold"] = "medium"
	elif ctcThreshold == 2500:
		byParam[param]["ctcThreshold"] = "high"
	else:
		print "uncategoried ctc threshold"

	ctcAmount = float(row[h["ctc_refund_amount"]])
	if ctcAmount == 1000:
		byParam[param]["ctcAmount"] = "low"
	elif ctcAmount == 1400:
		byParam[param]["ctcAmount"] = "medium"
	elif ctcAmount == 2000:
		byParam[param]["ctcAmount"] = "high"
	else:
		print "uncategoried ctc amount"


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
# TO BE REMOVED, DEBUGGER
	# print byParam[d]["count"]
	# if(byParam[d]["count"] < 500):
		# print count
#######
	dataOut.append(byParam[d])	

with open('data/pretty.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, indent=4, separators=(',', ': '))


with open('data/data.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, separators=(',', ':'))



