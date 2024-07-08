import pytest
from src import create_app
from src.database import db
import config

from src.models import Book


@pytest.fixture()
def app():
    app = create_app(config_class=config.TestingConfig)

    with app.app_context():
        db.create_all()

    yield app

    with app.app_context():
        db.drop_all()
        db.session.remove()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def create_book(app):
    def _create_book(title, author=None, isbn=None, pages=None, published_date=None):
        with app.app_context():
            book = Book(
                title=title,
                author=author,
                isbn=isbn,
                pages=pages,
                published_date=published_date
            )
            db.session.add(book)
            db.session.commit()
            return book.id

    return _create_book
