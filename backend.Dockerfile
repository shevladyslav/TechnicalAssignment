FROM python:3.9

WORKDIR /app
COPY requirements/base.pip requirements/base.pip
RUN pip install -r requirements/base.pip

COPY . .
