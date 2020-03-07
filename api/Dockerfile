FROM python:3.6

ENV PYTHONUNBUFFERED 1
RUN mkdir /api
WORKDIR /api

COPY . /api/
RUN pip install pipenv
RUN pipenv sync
