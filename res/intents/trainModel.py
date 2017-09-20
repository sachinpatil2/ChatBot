import os
import sys
import json
import re
import _pickle as pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from nltk.corpus import stopwords
from nltk import word_tokenize
from nltk.stem import PorterStemmer
from nltk.stem import SnowballStemmer
from module import Stemmer 

vectorDimension = 200
domain=sys.argv[1]
scriptDir=os.path.dirname(__file__)
fileData=os.path.join(scriptDir,'data',domain+'.json')
utterance=[]
intent=[]
with open(fileData,'r')as dataFile: 
 data=json.load(dataFile)
for nameUtterances in data['tasks']:
 for utt in nameUtterances['utterances']:
  utterance.append(utt)
  intent.append(nameUtterances['name'])
myIntent=set(intent)
print('Identified domain:',domain)
print('Number of utterances for training:',len(intent))
print('Number of intents for training:',len(myIntent))

stopListFile=os.path.join(scriptDir,'..','dictionary','stopwords.txt')
arrayWords=[]
stopWords=[]
f=open(stopListFile,"r")
lines=f.read().split("\n")
for line in lines:
 if line!="":
  words=line.split("=")[1]
  arrayWords.append(words.split(','))
for a_word in arrayWords:
 for s_word in a_word:
  if(re.sub(' ','',s_word))!="":
   stopWords.append(s_word)
extraStopWords=set(stopWords)
stops=set(stopwords.words('english'))|extraStopWords
tfidfvec=TfidfVectorizer(utterance,decode_error='ignore',stop_words=stops,ngram_range=(1,5),tokenizer=Stemmer.stemTokenize)
trainset_idf_vectorizer=tfidfvec.fit_transform(utterance).toarray()
vLength=len(trainset_idf_vectorizer[1])
nDimension=vectorDimension 
if vLength<=vectorDimension:
 nDimension=vLength-1
svd=TruncatedSVD(n_components=nDimension,algorithm='randomized',n_iter=15,random_state=42)
trainLSA=svd.fit_transform(trainset_idf_vectorizer)
pickle_path=os.path.join(scriptDir,'model',domain+'_')
file_Name=pickle_path+'utterance.m'
fileObject=open(file_Name,'wb')
pickle.dump(utterance,fileObject) 
fileObject.close()
file_Name=pickle_path+'intent.m'
fileObject=open(file_Name,'wb')
pickle.dump(intent,fileObject) 
fileObject.close()
file_Name=pickle_path+'tfidfvec.m'
fileObject=open(file_Name,'wb')
pickle.dump(tfidfvec,fileObject) 
fileObject.close()
file_Name=pickle_path+'svd.m'
fileObject=open(file_Name,'wb')
pickle.dump(svd,fileObject) 
fileObject.close()
file_Name=pickle_path+'trainLSA.m'
fileObject=open(file_Name,'wb')
pickle.dump(trainLSA,fileObject) 
fileObject.close()