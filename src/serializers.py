from flask_restful import abort, inputs, reqparse

from .models import Book


class BookSerializer:
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            "title", type=str, required=True, help="Title cannot be blank!"
        )
        self.parser.add_argument("author", type=str)
        self.parser.add_argument("isbn", type=str)
        self.parser.add_argument("pages", type=int)

    def parse_args(self):
        args = self.parser.parse_args()

        if args.get("isbn") and Book.query.filter_by(isbn=args["isbn"]).first():
            abort(400, message="ISBN already exists in the database")

        return args
