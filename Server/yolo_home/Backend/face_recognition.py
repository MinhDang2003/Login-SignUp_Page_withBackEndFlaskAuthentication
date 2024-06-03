import os
from deepface import DeepFace
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '1'

from tqdm import tqdm
import pandas as pd
import matplotlib.pyplot as plt

facial_img_paths = []
for root, directory, files in os.walk("deepface/tests/dataset"):
    
    for file in files:
        if '.jpg' in file:
            facial_img_paths.append(root+"/"+file)

instances = []
 
for i in tqdm(range(0, len(facial_img_paths))):
    facial_img_path = facial_img_paths[i]    
    embedding = DeepFace.represent(img_path = facial_img_path, model_name = "Facenet")[0]["embedding"]
     
    instance = []
    instance.append(facial_img_path)
    instance.append(embedding)
    instances.append(instance)