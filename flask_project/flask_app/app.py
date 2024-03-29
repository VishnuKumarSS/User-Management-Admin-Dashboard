from . import config
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS


# Create Flask application instance
app = Flask(__name__)

# Apply the configurations from config.py
app.config.from_object(config)

# CORS ( Cross-Origin Resource Sharing )
cors = CORS(app, supports_credentials=True)
# cors = CORS()
# cors.init_app(app)

# for password hashing
bcrypt = Bcrypt(app)

# passing our app to the server Session. So, that it will be safe.
# if we don't have the server sided session. Then this session will be the client side session. It could easily be hacked.
server_session = Session(app)