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
	

	byParam[param]["burden"] = float(row[h["rev_chg"]])
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



