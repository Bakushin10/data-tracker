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
	pipenv \
	virtualenv

# create and activate venv
RUN python3 -m venv data-tracker && \
	. data-tracker/bin/activate

# create venv and install python dependency from Pipfile
#
# /root/.local/share/virtualenvs/api-ORERwo9D/lib/python3.6/site-packages
#
RUN pipenv update

# activate venv and do something 
# RUN . /root/.local/share/virtualenvs/api-ORERwo9D/bin/activate
# RUN exit

# install dependencies via requirements.txt
# RUN pip freeze > requirements.txt
