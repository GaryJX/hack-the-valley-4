#!/usr/bin/env python
# coding: utf-8

# In[89]:


from google.cloud import language 
from google.cloud.language import enums
from google.cloud.language import types
import sys
import json


# ### Obtain the contents of the file from a text file

# In[90]:


nlp_data = {}

# read the article from file.
def read_article(file_name):       
    content_array = []
    with open(file_name, 'r') as f:
           data = f.read().replace('\n', '')
            
    lines = data.split('. ')
 
    return data


# In[91]:


text = read_article("test.txt")
#text = sys.argv[1]


# In[92]:


# Instantiates a client
client = language.LanguageServiceClient()
document = types.Document(
content=text,
type=enums.Document.Type.PLAIN_TEXT)


# ### Perform sentiment analysis

# In[93]:


# Detect the sentiment of the text
sentiment = client.analyze_sentiment(document=document).document_sentiment

#print('Text: {}'.format(text))
#print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))

sentiment_data = {}
sentiment_data["score"] = sentiment.score
sentiment_data["magnitude"] = sentiment.magnitude

nlp_data["sentiment_data"] = sentiment_data


# In[94]:


from google.cloud import language_v1
from google.cloud.language_v1 import enums

def sample_analyze_sentiment(text_content):
    """
    Analyzing Sentiment in a String
    
    Args: 
        text_content The text content to analyze
    """
    
    client = language_v1.LanguageServiceClient()

    # text_content = 'I am so happy and joyful.'

    # Available types: PLAIN_TEXT, HTML
    type_ = enums.Document.Type.PLAIN_TEXT

    # Optional. If not specified, the language is automatically detected.
    # For list of supported languages:
    # https://cloud.google.com/natural-language/docs/languages
    language = "en"
    document = {"content": text_content, "type": type_, "language": language}

    # Available values: NONE, UTF8, UTF16, UTF32
    encoding_type = enums.EncodingType.UTF8

    response = client.analyze_sentiment(document, encoding_type=encoding_type)
    # Get overall sentiment of the input document
    #print(u"Document sentiment score: {}".format(response.document_sentiment.score))
    #print(
      # u"Document sentiment magnitude: {}".format(
      #      response.document_sentiment.magnitude
      #  )
    #)
    # Get sentiment for all sentences in the document
    #for sentence in response.sentences:
        #print(u"Sentence text: {}".format(sentence.text.content))
        #print(u"Sentence sentiment score: {}".format(sentence.sentiment.score))
        #print(u"Sentence sentiment magnitude: {}".format(sentence.sentiment.magnitude))

    # Get the language of the text, which will be the same as
    # the language specified in the request or, if not specified,
    # the automatically-detected language.
    #print(u"Language of the text: {}".format(response.language))
    

#print(sample_analyze_sentiment(text))
    
    


# In[ ]:





# ### Generate a brief summary

# In[95]:


# Input article -> split into sentences -> remove stop words -> build a similarity matrix ->
# generate rank based on matrix -> pick top N sentences for summary.

# all the necessary importations
from nltk.corpus import stopwords
from nltk.cluster.util import cosine_distance
import numpy as np
import networkx as nx


# In[96]:


from nltk.corpus import stopwords

from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize, sent_tokenize

def _create_frequency_table(text_string) -> dict:
    stopWords = set(stopwords.words("english"))
    words = word_tokenize(text_string)
    ps = PorterStemmer()
    
    freqTable = dict()
    for word in words:
        word = ps.stem(word)
        if word in stopWords:
            continue
        if word in freqTable:
            freqTable[word] += 1
        else: 
            freqTable[word] = 1
    return freqTable


# In[97]:


#print(text)


# In[98]:


def _score_sentences(sentences, freqTable) -> dict:
    sentenceValue = dict()

    for sentence in sentences:
        word_count_in_sentence = (len(word_tokenize(sentence)))
        for wordValue in freqTable:
            if wordValue in sentence.lower():
                if sentence[:10] in sentenceValue:
                    sentenceValue[sentence[:10]] += freqTable[wordValue]
                else:
                    sentenceValue[sentence[:10]] = freqTable[wordValue]

        sentenceValue[sentence[:10]] = sentenceValue[sentence[:10]] // word_count_in_sentence

    return sentenceValue

def _find_average_score(sentenceValue) -> int:
    sumValues = 0
    for entry in sentenceValue:
        sumValues += sentenceValue[entry]

    # Average value of a sentence from original text
    average = int(sumValues / len(sentenceValue))

    return average


def _generate_summary(sentences, sentenceValue, threshold):
    sentence_count = 0
    summary = ''

    for sentence in sentences:
        if sentence[:10] in sentenceValue and sentenceValue[sentence[:10]] > (threshold):
            summary += " " + sentence
            sentence_count += 1

    return summary

freq_table = _create_frequency_table(text)
#print(freq_table)
sentences = sent_tokenize(text)
#print(sentences)
sentence_scores = _score_sentences(sentences, freq_table)
#print(sentence_scores)
threshold = _find_average_score(sentence_scores)
summary = _generate_summary(sentences, sentence_scores, 1.3 * threshold)

nlp_data["summary"] = summary


# In[99]:


import argparse
import io
import json
import os

from google.cloud import language
import numpy 
import six


def classify(text, verbose=True):
    '''Classify the input text into categories'''
    classificaton_data = {}
    language_client = language.LanguageServiceClient()
    
    document = language.types.Document(
        content=text,
        type=language.enums.Document.Type.PLAIN_TEXT)
    response = language_client.classify_text(document)
    categories = response.categories
    result = {}
    
    for category in categories:
        # Turn the categories into a dictionary form:
        # {category.name: category confidence}
        result[category.name] = category.confidence
        
    
    
    #if verbose:
        #for category in categories:
            #print(u'=' * 20)
            #print(u'{:<16}: {}'.format('category', category.name))
            #print(u'{:<16}: {}'.format('confidence', category.confidence))
        
    return result


# ### Classify text content 

# In[100]:


classification_data = classify(text)
nlp_data["classification_data"] = classification_data


# ### Entity analysis
# 

# #### Parse the text for Entity Analysis

# In[101]:


text = text.replace(".", ". ")


# In[102]:


from google.cloud import language_v1
from google.cloud.language_v1 import enums

# create your dictionary class
class dictionary(dict):
    
    def __init__(self):
        self = dict()
    
    def add(self, key, value):
        self[key] = value


def sample_analyze_entities(text_content):
    """
    Analyzing Entities in a String

    Args:
      text_content The text content to analyze
    """

    client = language_v1.LanguageServiceClient()

    # text_content = 'California is a state.'

    # Available types: PLAIN_TEXT, HTML
    type_ = enums.Document.Type.PLAIN_TEXT

    # Optional. If not specified, the language is automatically detected.
    # For list of supported languages:
    # https://cloud.google.com/natural-language/docs/languages
    language = "en"
    document = {"content": text_content, "type": type_, "language": language}

    # Available values: NONE, UTF8, UTF16, UTF32
    encoding_type = enums.EncodingType.UTF8

    response = client.analyze_entities(document, encoding_type=encoding_type)
    
    content_dict = dictionary()
    # Loop through entitites returned from the API
    for entity in response.entities:
        #print(u"Representative name for the entity: {}".format(entity.name))
        # Get entity type, e.g. PERSON, LOCATION, ADDRESS, NUMBER, et al
        #print(u"Entity type: {}".format(enums.Entity.Type(entity.type).name))
        # Get the salience score associated with the entity in the [0, 1.0] range
        #print(u"Salience score: {}".format(entity.salience))
        content_dict.add(entity.salience, str(entity.name) + "/" + str(enums.Entity.Type(entity.type).name))
        # Loop over the metadata associated with entity. For many known entities,
        # the metadata is a Wikipedia URL (wikipedia_url) and Knowledge Graph MID (mid).
        # Some entity types may have additional metadata, e.g. ADDRESS entities
        # may have metadata for the address street_name, postal_code, et al.
        #for metadata_name, metadata_value in entity.metadata.items():
            #print(u"{}: {}".format(metadata_name, metadata_value))

        # Loop over the mentions of this entity in the input document.
        # The API currently supports proper noun mentions.
        #for mention in entity.mentions:
            #print(u"Mention text: {}".format(mention.text.content))
            # Get the mention type, e.g. PROPER for proper noun
            #print(
                #u"Mention type: {}".format(enums.EntityMention.Type(mention.type).name)
            #)
            
    #print("CONTENT DICTIONARY")
    #print(content_dict)

    # Get the language of the text, which will be the same as
    # the language specified in the request or, if not specified,
    # the automatically-detected language.
    #print(u"Language of the text: {}".format(response.language))
    
    return content_dict
    
cd = sample_analyze_entities(text)


# In[103]:


# Extract all relevant entities using the Salience value
res = dictionary()

def extract_based_on_salience(corpus_dict):
    counter = 0 
    for word in corpus_dict:
        if(counter < 5):
            entity_data = (corpus_dict[word]).split("/")
            res.add(entity_data[0], entity_data[1])
            counter+=1
        else:
            break
            
    return res
    
entity_data = extract_based_on_salience(cd)

nlp_data["entity_data"] = entity_data


# ### Entity Extraction

# In[104]:


import nltk
nltk.download('averaged_perceptron_tagger')
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag

def preprocess(sent):
    sent = nltk.word_tokenize(sent)
    sent = nltk.pos_tag(sent)
    return sent

#print(text)

sent = preprocess(text)


# In[105]:


#print(sent)


# ### Implement Noun Phrase chunking

# In[106]:


pattern = 'NP: {<DT>?<JJ>*<NN>}'
cp = nltk.RegexpParser(pattern)
cs = cp.parse(sent)
#print(cs)


# In[107]:


from nltk.chunk import conlltags2tree, tree2conlltags
nltk.download('maxent_ne_chunker')
nltk.download('words')
from pprint import pprint

iob_tagged = tree2conlltags(cs)
#print(iob_tagged)

ne_tree = nltk.ne_chunk(pos_tag(word_tokenize(text)))
#print(ne_tree)


# In[108]:


#Using spacy to for entity recognition.

import spacy
from spacy import displacy
from collections import Counter
import en_core_web_sm
nlp = en_core_web_sm.load()

doc = nlp(text)
#print([(X.text, X.label_) for X in doc.ents])
#print([(X, X.ent_iob_, X.ent_type_) for X in doc])


# In[109]:


from bs4 import BeautifulSoup
import requests
import re

def url_to_string(url):
    res = requests.get(url)
    html = res.text
    soup = BeautifulSoup(html, 'html5lib')
    for script in soup(["script", "style", 'aside']):
        script.extract()
    return " ".join(re.split(r'[\n\t]+', soup.get_text()))

training_corpus = text
#training_corpus = text.lower()
#training_corpus = training_corpus.replace(".", " .")

ny_bb = training_corpus
article = nlp(ny_bb)

#print(article)

len(article.ents)

labels = [x.label_ for x in article.ents]
Counter(labels)

items = [x.text for x in article.ents]
Counter(items).most_common(15)


# In[110]:


#print(article.ents)

sentences = [x for x in article.sents]
#print(sentences)
#print(len(sentences))


# In[111]:


#displacy.render(nlp(str(sentences[5])), jupyter=True, style='ent')


# In[112]:


#[(x.orth_,x.pos_, x.lemma_) for x in [y 
#                                      for y
#                                      in nlp(str(sentences[8])) 
#                                      if not y.is_stop and y.pos_ != 'PUNCT']]


# In[113]:


#for i in range(0, len(sentences)):
#    displacy.render(nlp(str(sentences[i])), jupyter=True, style='ent')


# ### Convert dict to json and return 

# In[114]:


nlp_json = json.dumps(nlp_data, sort_keys=True)
print(nlp_json)


# In[ ]:




