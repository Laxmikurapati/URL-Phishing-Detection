from flask import Flask, request, jsonify
import joblib
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load your pickled machine learning model
model_path = 'phishing.pkl'
phish_model = joblib.load(open(model_path, 'rb'))

# Define an API endpoint for prediction
@app.route('/checkUrl', methods=['POST'])
def predict():
    try:
        # Get data from the request as JSON
        data = request.get_json(force=True)
        
        # Extract the URL from the request data
        url = data.get('url', '')  # Assuming the URL is provided in the 'url' field
        if ( ("new-tab-page" in url) or (url=='about:blank')) :
            return jsonify({'prediction': "good"})
      
        if(len(url)<=4 or url=="chrome://new-tab-page/"):
            return jsonify({'prediction': "good"})
        # if(url=='chrome://new-tab-page/' or url<=3 or url.toLowerCase().startsWith('https://www.google.')):
        #     return jsonify({'prediction': 'good'})
        
        if not url:
            raise ValueError("URL is missing in the request.")
        
        # Perform prediction using the loaded model
        url = url.replace('https://', '')
        print(url)
        prediction = phish_model.predict([url])[0]

        # Return the prediction as JSON
        
        print(prediction)
        
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    # Run the Flask app on port 5000
    app.run(port=5000, debug=True)
