from flask import Flask
from flask_restful import Api

from .database import db, migrate
from .models import *
from .routers import BookList


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///books.db"

    db.init_app(app)
    migrate.init_app(app, db)

    api = Api(app, prefix="/api/v1")
    api.add_resource(BookList, "/books")

    return app
