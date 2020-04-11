FROM python:3.6

RUN apt-get update && apt-get install -y \
	nano \
	vim \
	curl

# create comnfig files
WORKDIR /etc/systemd
RUN mkdir lessons
COPY config/etc/systemd/ system/
COPY config/etc/lessons/ lessons/

ENV PYTHONUNBUFFERED 1
RUN mkdir /api
WORKDIR /api

# copy everything in current dir to /api
COPY . /api/

RUN pip install \
	pipenv

# install python dependency from Pipfile
RUN pipenv sync
