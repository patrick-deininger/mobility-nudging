# Mobility nudging
Nudge testing framework based on React, Django + GraphQL Relay Modern backend.

## Quick start:
You will need python 3.6 and node installed.
You will also need to have a virtualenv activated before running npm install/yarn or the post install build step will fail as django needs to be available to dump the graphql_schema
```
source ~/.virtualenvs/mobility-nudging/bin/activate
pip3 install -r ./lib/deps/dev.txt
yarn
```

Execute in three different console tabs
1.
```
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```

2.
```
yarn start
```

3.
```
yarn relay
```
