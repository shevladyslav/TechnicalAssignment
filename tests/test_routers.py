import pytest


@pytest.fixture
def get_book_id(create_book):
    return create_book(title="Test Book", author="Test Author", isbn="1234567890", pages=100)


def test_create_book(client):
    book_data = {
        'title': 'Test Book',
        'author': 'Test Author',
    }
    response = client.post('/api/v1/books', json=book_data)
    assert response.status_code == 201


def test_get_books(client):
    response = client.get('/api/v1/books')
    assert response.status_code == 200


def test_get_book_details(client, get_book_id):

    response = client.get(f'/api/v1/books/{get_book_id}')
    assert response.status_code == 200


def test_update_book(client, get_book_id):
    updated_data = {
        'title': 'Updated Test Book',
        'author': 'Updated Test Author',
    }
    response = client.put(f'/api/v1/books/{get_book_id}', json=updated_data)
    assert response.status_code == 200


def test_delete_book(client, get_book_id):
    response = client.delete(f'/api/v1/books/{get_book_id}')
    assert response.status_code == 204



