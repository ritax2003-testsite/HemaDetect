from django.shortcuts import render
import cv2
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import CNN_ONNX
import base64
import numpy as np
import os
import io
from PIL import Image,ImageDraw
# Create your views here.


@api_view(['POST'])
def cnn_predict(request):
    if 'image' not in request.FILES:
        return Response({"error": "No image provided"}, status=400)
    print(request.data)
    image = request.FILES['image']
    image_data = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
   # model_path = os.path.join('models', 'best.onnx')  # Use the ONNX model
   # detected_image = CNN_ONNX.predict_image(CNN_ONNX.load_model(model_path), image_data)
    # Convert OpenCV image (NumPy array) to a format PIL can handle
    # Convert NumPy array (OpenCV image) back to a byte stream
    _, buffer = cv2.imencode('.jpg', image_data)
    byte_image = io.BytesIO(buffer)

    # Now, open the image with PIL
    pil_image = Image.open(byte_image)
    detected_image = CNN_ONNX.predict_image(image_data)

    _, original_img_encoded = cv2.imencode('.jpg', image_data)
    original_img_base64 = base64.b64encode(original_img_encoded).decode('utf-8')
    _, detected_img_encoded = cv2.imencode('.jpg', detected_image)
    detected_img_base64 = base64.b64encode(detected_img_encoded).decode('utf-8')
    return Response({
        'original_image': f'data:image/jpeg;base64,{original_img_base64}',
        'detected_image': f'data:image/jpeg;base64,{detected_img_base64}'
    })

