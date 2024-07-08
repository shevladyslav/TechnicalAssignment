from flask import Flask
from flask_restful import Api

from .database import db, migrate
from .models import *
from .routers import BookDetail, BookList


def create_app(config_class=None):
    app = Flask(__name__)

    if config_class is not None:
        app.config.from_object(config_class)
    else:
        app.config.from_object("config.DevelopmentConfig")

    db.init_app(app)
    migrate.init_app(app, db)

    api = Api(app, prefix="/api/v1")
    api.add_resource(BookList, "/books")
    api.add_resource(BookDetail, "/books/<int:id>")

    return app
