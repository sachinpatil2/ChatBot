import os
import re
import sys
import _pickle as cPickle 

from sklearn.metrics.pairwise import linear_kernel
from collections import OrderedDict
from module import ProcessQuery as pq
domain=sys.argv[1]
userUtterance=sys.argv[2]

scriptDir=os.path.dirname(__file__)
picklePath=os.path.join(scriptDir,'model',domain+'_')

utter=re.sub(r'[^a-zA-Z ]','',userUtterance)
combinations=pq.genUtterances(utter)
jResult=pq.processUtterance(combinations)
print(str(jResult).replace("'",'"'),end="")