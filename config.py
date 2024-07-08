class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///dev_books.db"


class TestingConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///test_books.db"
    TESTING = True
