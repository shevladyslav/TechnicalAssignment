from .database import db

from datetime import date


class Book(db.Model):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=True)
    isbn = db.Column(db.String(20), unique=True, nullable=True)
    pages = db.Column(db.Integer)
    published_date = db.Column(db.Date, nullable=True)

    def __repr__(self):
        return f"<Book {self.title}>"

    def as_dict(self):
        result = {}
        for column in self.__table__.columns:
            value = getattr(self, column.name)
            if isinstance(value, date):
                value = value.strftime('%Y-%m-%d')
            result[column.name] = value
        return result
