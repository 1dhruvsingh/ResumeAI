from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/test', methods=['GET'])
def test():
    return {"message": "API is working correctly!"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)

