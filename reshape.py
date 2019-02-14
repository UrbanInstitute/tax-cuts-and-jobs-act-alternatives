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
	

	byParam[param]["burden"] = float(row[h["rev_chg"]]) * 1000000000
	standard = float(row[h["standard1"]])
	if standard == 6500:
		byParam[param]["standard"] = "l"
	elif standard == 9250:
		byParam[param]["standard"] = "ml"
	elif standard == 12000:
		byParam[param]["standard"] = "mh"
	elif standard == 13200:
		byParam[param]["standard"] = "h"
	else:
		print "uncategorized rate"

# pretty brittle, but 4 rate structures all have different vals for 2nd bracket, so for now this is working
	rates = round(float(row[h["rates2"]]), 3)
	if rates == .15:
		byParam[param]["rates"] = "a"
	elif rates == .12:
		byParam[param]["rates"] = "b"
	elif rates == .132:
		byParam[param]["rates"] = "c"
	elif rates == .13:
		byParam[param]["rates"] = "d"
	else:
		print "uncategoried rate"
		print rates

	amtThreshold = float(row[h["amthrsh1"]])
	if amtThreshold == 123300:
		byParam[param]["amtThreshold"] = "l"
	elif amtThreshold == 500000:
		byParam[param]["amtThreshold"] = "h"
	else:
		print "uncategorized amt threshold"

	amtAmount = float(row[h["amtx1"]])
	if amtAmount == 55400:
		byParam[param]["amtAmount"] = "l"
	elif amtAmount == 70300:
		byParam[param]["amtAmount"] = "h"
	else:
		print "uncategorized amt amount"

	personal = float(row[h["exemption_amount"]])
	if personal == 0:
		byParam[param]["personal"] = "l"
	elif personal == 2050:
		byParam[param]["personal"] = "ml"
	elif personal == 4150:
		byParam[param]["personal"] = "mh"
	elif personal == 5500:
		byParam[param]["personal"] = "h"
	else:
		print "uncategoried personal exemption"

	salt = float(row[h["saltcap"]])
	if salt == 0:
		byParam[param]["salt"] = "l"
	elif salt == 10000:
		byParam[param]["salt"] = "ml"
	elif salt == 15000:
		byParam[param]["salt"] = "mh"
	elif salt == 20000:
		byParam[param]["salt"] = "h"
	else:
		print "uncategoried salt tax"

	ctcThreshold = float(row[h["childrefund_thresh"]])
	if ctcThreshold == 0:
		byParam[param]["ctcThreshold"] = "l"
	elif ctcThreshold == 1250:
		byParam[param]["ctcThreshold"] = "medium"
	elif ctcThreshold == 2500:
		byParam[param]["ctcThreshold"] = "h"
	else:
		print "uncategoried ctc threshold"

	ctcAmount = float(row[h["ctc_refund_amount"]])
	if ctcAmount == 1000:
		byParam[param]["ctcAmount"] = "l"
	elif ctcAmount == 1400:
		byParam[param]["ctcAmount"] = "medium"
	elif ctcAmount == 2000:
		byParam[param]["ctcAmount"] = "h"
	else:
		print "uncategoried ctc amount"


	if ctcThreshold == 2500:
		if ctcAmount == 1000:
			byParam[param]["ct1"] = "l"
			byParam[param]["ct2"] = "l0"
			byParam[param]["ct3"] = "l0"
		elif ctcAmount == 1400:
			byParam[param]["ct1"] = "medium"
			byParam[param]["ct2"] = "m0"
			byParam[param]["ct3"] = "m0"
		elif ctcAmount == 2000:
			byParam[param]["ct1"] = "h"
			byParam[param]["ct2"] = "h0"
			byParam[param]["ct3"] = "h0"

	if ctcThreshold == 1250:
		if ctcAmount == 1000:
			byParam[param]["ct1"] = "l0"
			byParam[param]["ct2"] = "l"
			byParam[param]["ct3"] = "l0"
		elif ctcAmount == 1400:
			byParam[param]["ct1"] = "m0"
			byParam[param]["ct2"] = "medium"
			byParam[param]["ct3"] = "m0"
		elif ctcAmount == 2000:
			byParam[param]["ct1"] = "h0"
			byParam[param]["ct2"] = "h"
			byParam[param]["ct3"] = "h0"

	if ctcThreshold == 0:
		if ctcAmount == 1000:
			byParam[param]["ct1"] = "l0"
			byParam[param]["ct2"] = "l0"
			byParam[param]["ct3"] = "l"
		elif ctcAmount == 1400:
			byParam[param]["ct1"] = "m0"
			byParam[param]["ct2"] = "m0"
			byParam[param]["ct3"] = "medium"
		elif ctcAmount == 2000:
			byParam[param]["ct1"] = "h0"
			byParam[param]["ct2"] = "h0"
			byParam[param]["ct3"] = "h"






	categories = ["all","elderly","hoh","kids","mfj","mfs","mkids","mminorkids","myoungkids","nokids","notelderly","single"]
	categoryDict = {"all": "a","elderly":"b","hoh":"c","kids":"d","mfj":"e","mfs":"f","mkids":"g","mminorkids":"h","myoungkids":"i","nokids":"j","notelderly":"k","single":"l"}
	for category in categories:
		if(row[h["category"]] == category):
			byParam[param][categoryDict[category] + "0"] = float(row[h["pctchginafttaxincpercent_pct_12"]])
			byParam[param][categoryDict[category] + "1"] = float(row[h["pctchginafttaxincpercent_pct_2"]])
			byParam[param][categoryDict[category] + "2"] = float(row[h["pctchginafttaxincpercent_pct_3"]])
			byParam[param][categoryDict[category] + "3"] = float(row[h["pctchginafttaxincpercent_pct_4"]])
			byParam[param][categoryDict[category] + "4"] = float(row[h["pctchginafttaxincpercent_pct_5"]])
			byParam[param][categoryDict[category] + "5"] = float(row[h["pctchginafttaxincpercent_pct_13"]])
			byParam[param][categoryDict[category] + "6"] = float(row[h["pctchginafttaxincpercent_pct_14"]])
			byParam[param][categoryDict[category] + "7"] = float(row[h["pctchginafttaxincpercent_pct_15"]])
			byParam[param][categoryDict[category] + "8"] = float(row[h["pctchginafttaxincpercent_pct_16"]])
			byParam[param][categoryDict[category] + "9"] = float(row[h["pctchginafttaxincpercent_pct_17"]])

	tcja = float(row[h["tcja_dummy"]])
	if tcja == 1:
		byParam[param]["tcja"] = "True"

dataOut = []
tcjaOut = False
for d in byParam:
	dataOut.append(byParam[d])	
	if "tcja" in byParam[d]:
		tcjaOut = byParam[d]


# print dataOut

for o in dataOut:
	if o["a1"] > tcjaOut["a1"] and o["burden"] > tcjaOut["burden"]:
		o["q1"] = "1"
	else:
		o["q1"] = "0"

	if o["a1"] > tcjaOut["a1"] and o["a2"] > tcjaOut["a2"] and o["burden"] > tcjaOut["burden"]:
		o["q2"] = "1"
	else:
		o["q2"] = "0"

	if o["a1"] > tcjaOut["a1"] and o["a2"] > tcjaOut["a2"] and o["a3"] > tcjaOut["a3"] and o["burden"] > tcjaOut["burden"]:
		o["q3"] = "1"
	else:
		o["q3"] = "0"

	if o["a1"] > tcjaOut["a1"] and o["a2"] > tcjaOut["a2"] and o["a3"] > tcjaOut["a3"] and o["a4"] > tcjaOut["a4"] and o["burden"] > tcjaOut["burden"]:
		o["q4"] = "1"
	else:
		o["q4"] = "0"

	if o["a8"] > tcjaOut["a8"] and o["burden"] > tcjaOut["burden"]:
		o["t1"] = "1"
	else:
		o["t1"] = "0"


with open('data/pretty.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, indent=4, separators=(',', ': '))

with open('data/tcja.js', 'wt') as out:
    # res =  json.dump(tcjaOut, out, sort_keys=True, indent=4, separators=(',', ': '))
    out.write("var TCJA = {" + ', '.join("\"%s\":%r" % (key,val) for (key,val) in tcjaOut.iteritems()) + "}") 




with open('data/data.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, separators=(',', ':'))



