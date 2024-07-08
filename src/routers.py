from flask import request
from flask_restful import Resource, reqparse

from .database import db
from .models import Book
from .serializers import BookSerializer


class BookList(Resource):

    def __init__(self):
        self.parser = BookSerializer()

    def get(self):
        books = Book.query.all()
        return [book.as_dict() for book in books]

    def post(self):
        args = self.parser.parse_args()
        book = Book(**args)
        db.session.add(book)
        db.session.commit()
        return book.as_dict(), 201
