# -*- coding: utf-8 -*-
"""
Created on Thu May 17 10:12:04 2018

@author: dberger
"""

# -*- coding: utf-8 -*-
"""
Created on Thu Jan  4 16:50:46 2018

@author: dberger
"""
import sys
from ParamUpdater import ParamUpdater # load module
from credentials import credentials

################################
################################
#CTRL - PERIOD RESTARTS KERNEL - NEED TO DO THIS IF PARAMAETER UPDATER IS EVER CHANGED!!!!##
###############################
###############################

##REMEMBER TO RESET USING eitc.reset()


##Run this line of code before each use
#eitc = ParamUpdater('param/cli-poc-2.csv') # create parameter object from an existing file
#params.update('TOTSIM', 100) # update scalar parameter
#params.update('FAKE_PARAM', 'FakeData') # returns error
#eitc.update('STANDARD1', 50000, year=2020, year_type='proposed') # update array parameter
#eitc.write_modified('modified/small-param-for-poc-class') # write changes to file


#Changes single parameter 1 year and writes out
tcja = ParamUpdater('original/param_tcja_mic_pre-tcja.csv', credentials=credentials)

RATES1 = [0.1,     0.1,     0.12,    0.11]
RATES2 = [0.15,    0.12,    0.144,    0.132]
RATES3 = [0.25,    0.12,    0.144,    0.132]
RATES4 = [0.28,    0.22,    0.264,    0.242]
RATES5 = [0.33,    0.24,    0.288,    0.264]
RATES6 = [0.35,    0.32,    0.384,    0.352]
RATES7 = [0.396,   0.35,    0.42,   0.385]
RATES8 = [0.0,     0.35,    0.42,   0.385]
RATES9 = [0.0,     0.37,    0.444,  0.407]
AMTX1 = [55400, 70300]
AMTX2 = [86300, 109400]
AMTX3 = [55400, 70300]
AMTX4 = [43150, 54700]
AMTHRSH1 = [123300, 500000]
AMTHRSH2 = [164500, 1000000]
AMTHRSH3 = [123300, 500000]
AMTHRSH4 = [82250, 500000]
Standard1 = [12000, 6500, 13200] #also standard4
Standard3 = [18000, 9550, 21600]
EXAMT = [2000, 0, 991, 2629]
SALT = [0, 10000, 15000, 20000]
REFUND = [1000, 1400, 2000]
REFUND_START = [2500, 0, 1250]


paths = ['dberger_pre-tcja_v3_2', 'dberger_pre-tcja_v3_3', 'dberger_pre-tcja_v3_4', 'dberger_pre-tcja_v3_5']

for x in range(1,2):
    tcja.update('RATES1', value = RATES1[x], year = 2018)
    tcja.update('RATES2', value = RATES2[x], year = 2018)
    tcja.update('RATES3', value = RATES3[x], year = 2018)
    tcja.update('RATES4', value = RATES4[x], year = 2018)
    tcja.update('RATES5', value = RATES5[x], year = 2018)
    tcja.update('RATES6', value = RATES6[x], year = 2018)
    tcja.update('RATES7', value = RATES7[x], year = 2018)
    tcja.update('RATES8', value = RATES8[x], year = 2018)
    tcja.update('RATES9', value = RATES9[x], year = 2018)
    if RATES9[x] == 0:
        tcja.update('INFO10', value = 'BLANK', year = 2018)
        tcja.update('INFO15', value = 'BLANK', year = 2018)
        tcja.update('CPIBRK_BY', value = 138.925, year = 2018)
        tcja.update('SEPIND_10PCT', value = True, year = 2018)
        tcja.update('MPENRELIEF_10PCT', value = True, year = 2018)
        tcja.update('MPENRELIEF_15PCT', value = True, year = 2018)
        tcja.update('CG_HIGHER_BRACK', value = 7, year = 2018)
        tcja.update('NBRACK', value = 7, year = 2018)
        tcja.update('SBRACK1', value = 0, year = 2018)
        tcja.update('SBRACK2', value = 7000, year = 2018)
        tcja.update('SBRACK3', value = 22100, year = 2018)
        tcja.update('SBRACK4', value = 53500, year = 2018)
        tcja.update('SBRACK5', value = 111586.6, year = 2018)
        tcja.update('SBRACK6', value = 242579.55, year = 2018)
        tcja.update('SBRACK7', value = 243568.47, year = 2018)
        tcja.update('SBRACK8', value = 0, year = 2018)
        tcja.update('SBRACK9', value = 0, year = 2018)
        tcja.update('MBRACK1', value = 0, year = 2018)
        tcja.update('MBRACK2', value = 14000, year = 2018)
        tcja.update('MBRACK3', value = 44200, year = 2018)
        tcja.update('MBRACK4', value = 89150, year = 2018)
        tcja.update('MBRACK5', value = 135844.6, year = 2018)
        tcja.update('MBRACK6', value = 242579.55, year = 2018)
        tcja.update('MBRACK7', value = 274014.53, year = 2018)
        tcja.update('MBRACK8', value = 0, year = 2018)
        tcja.update('MBRACK9', value = 0, year = 2018)
        tcja.update('HBRACK1', value = 0, year = 2018)
        tcja.update('HBRACK2', value = 10000, year = 2018)
        tcja.update('HBRACK3', value = 29600, year = 2018)
        tcja.update('HBRACK4', value = 76400, year = 2018)
        tcja.update('HBRACK5', value = 123715.6, year = 2018)
        tcja.update('HBRACK6', value = 242579.55, year = 2018)
        tcja.update('HBRACK7', value = 258791.5, year = 2018)
        tcja.update('HBRACK8', value = 0, year = 2018)
        tcja.update('HBRACK9', value = 0, year = 2018)
        tcja.update('BLANKPAR8', value = -11.52, year = 2018)
        tcja.update('BLANKPAR10', value = 0.7385, year = 2018)
        tcja.update('BLANKPAR13', value = 0.0, year = 2018)
        tcja.update('BLANKPAR15', value = 1.8513, year = 2018)
    elif RATES9[x] == 0.444:
        tcja.update('BLANKPAR8', value = -12.59, year = 2018)
        tcja.update('BLANKPAR10', value = 0.7789, year = 2018)
        tcja.update('BLANKPAR13', value = 0.0, year = 2018)
        tcja.update('BLANKPAR15', value = 1.9815, year = 2018)
    elif RATES9[x] == 0.407:
        tcja.update('BLANKPAR8', value = -11.51, year = 2018)
        tcja.update('BLANKPAR10', value = 0.7143, year = 2018)
        tcja.update('BLANKPAR13', value = 0.0, year = 2018)
        tcja.update('BLANKPAR15', value = 1.8398, year = 2018)
    else:
        tcja.update('INFO10', value = 'NORND', year = 2018)
        tcja.update('INFO15', value = 'S_RND', year = 2018)
        tcja.update('CPIBRK_BY', value = 243.3378, year = 2018)
        tcja.update('SEPIND_10PCT', value = False, year = 2018)
        tcja.update('MPENRELIEF_10PCT', value = False, year = 2018)
        tcja.update('MPENRELIEF_15PCT', value = False, year = 2018)
        tcja.update('CG_HIGHER_BRACK', value = 8, year = 2018)
        tcja.update('NBRACK', value = 9, year = 2018)
        tcja.update('SBRACK1', value = 0, year = 2018)
        tcja.update('SBRACK2', value = 9525, year = 2018)
        tcja.update('SBRACK3', value = 38600, year = 2018)
        tcja.update('SBRACK4', value = 38700, year = 2018)
        tcja.update('SBRACK5', value = 82500, year = 2018)
        tcja.update('SBRACK6', value = 157500, year = 2018)
        tcja.update('SBRACK7', value = 200000, year = 2018)
        tcja.update('SBRACK8', value = 425800, year = 2018)
        tcja.update('SBRACK9', value = 500000, year = 2018)
        tcja.update('MBRACK1', value = 0, year = 2018)
        tcja.update('MBRACK2', value = 19050, year = 2018)
        tcja.update('MBRACK3', value = 77200, year = 2018)
        tcja.update('MBRACK4', value = 77400, year = 2018)
        tcja.update('MBRACK5', value = 165000, year = 2018)
        tcja.update('MBRACK6', value = 315000, year = 2018)
        tcja.update('MBRACK7', value = 400000, year = 2018)
        tcja.update('MBRACK8', value = 479000, year = 2018)
        tcja.update('MBRACK9', value = 600000, year = 2018)
        tcja.update('HBRACK1', value = 0, year = 2018)
        tcja.update('HBRACK2', value = 13600, year = 2018)
        tcja.update('HBRACK3', value = 51700, year = 2018)
        tcja.update('HBRACK4', value = 51800, year = 2018)
        tcja.update('HBRACK5', value = 82500, year = 2018)
        tcja.update('HBRACK6', value = 157500, year = 2018)
        tcja.update('HBRACK7', value = 200000, year = 2018)
        tcja.update('HBRACK8', value = 452400, year = 2018)
        tcja.update('HBRACK9', value = 500000, year = 2018)
        tcja.update('BLANKPAR8', value = -10.5, year = 2018)
        tcja.update('BLANKPAR10', value = 0.7, year = 2018)
        tcja.update('BLANKPAR13', value = 0.0, year = 2018)
        tcja.update('BLANKPAR15', value = 1.7, year = 2018)
    for y in range(0,2):
        tcja.update('AMTX1', value = AMTX1[y], year = 2018)
        tcja.update('AMTX2', value = AMTX2[y], year = 2018)
        tcja.update('AMTX3', value = AMTX3[y], year = 2018)
        tcja.update('AMTX4', value = AMTX4[y], year = 2018)
        for z in range(0,2):
            tcja.update('AMTHRSH1', value = AMTHRSH1[z] , year = 2018)
            tcja.update('AMTHRSH2', value = AMTHRSH2[z] , year = 2018)
            tcja.update('AMTHRSH3', value = AMTHRSH3[z] , year = 2018)
            tcja.update('AMTHRSH4', value = AMTHRSH4[z] , year = 2018)
            for k in EXAMT:
                tcja.update('EXAMT', value= k, year = 2018)
                if k > 0:
                    tcja.update('EXEMPT_SWITCH', value = True, year = 2018)
                else:
                    tcja.update('EXEMPT_SWITCH', value = False, year = 2018)
                for n in range(0,3):
                    tcja.update('STANDARD1', value= Standard1[n], year = 2018)
                    tcja.update('STANDARD2', value= Standard1[n]*2, year = 2018)
                    tcja.update('STANDARD3', value= Standard3[n], year = 2018)
                    for a in SALT:
                        tcja.update('ED_BLANKPAR4', value= a, year = 2018)
                        for f in REFUND:
                            tcja.update('RET_BLANKPAR13', value= f, year = 2018)
                            for u in REFUND_START:
                                tcja.update('CHILDREFUND_THRESH', value= u, year = 2018)
                                tcja.save_modified(paths[x])


tcja.upload_modified()


#ctc.update_increment('CHILDREFUND_THRESH', start=0, end=6000, increment=500, filestub= 'modified/ctc/ctc-update', year=2018, year_type='proposed')


#ctc = ParamUpdater('original/cli-poc.csv')
#ctc.update_increment('CHILDCREDIT_AMOUNT', start=0, end=5000, increment=250, filestub= 'modified/ctc/ctc-update', year=2018, year_type='proposed') # increment pease1 # increment pease1
