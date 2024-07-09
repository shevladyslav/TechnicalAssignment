from flask_restful import Resource, reqparse
from flask import make_response


from .database import db
from .models import Book
from .serializers import BookSerializer


class BookParser:

    def __init__(self):
        self.parser = BookSerializer()


class BookList(Resource, BookParser):

    def get(self):
        books = Book.query.all()
        return [book.as_dict() for book in books]

    def post(self):
        args = self.parser.parse_args()
        book = Book(**args)
        db.session.add(book)
        db.session.commit()
        return book.as_dict(), 201


class BookDetail(Resource, BookParser):

    def get(self, id):
        book = Book.query.get_or_404(id)
        return book.as_dict(), 200

    def put(self, id):
        book = Book.query.get_or_404(id)
        args = self.parser.parse_args(existing_isbn=book.isbn)
        for key, value in args.items():
            setattr(book, key, value)
        db.session.commit()
        return book.as_dict(), 200

    def delete(self, id):
        book = Book.query.get_or_404(id)
        db.session.delete(book)
        db.session.commit()
        return make_response('', 204)
