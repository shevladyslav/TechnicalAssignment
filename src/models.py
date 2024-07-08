from .database import db


class Book(db.Model):
    __tablename__ = "books"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(255), nullable=True)
    isbn = db.Column(db.String(20), unique=True, nullable=True)
    pages = db.Column(db.Integer)

    def __repr__(self):
        return f"<Book {self.title}>"

    def as_dict(self):
        return {
            column.name: getattr(self, column.name) for column in self.__table__.columns
        }
