# Edision
Nudge testing framework based on React, Django + GraphQL Relay Modern backend.

## Quick start:
You will need python 3.6 and nodejs as well as yarn installed.
```
sudo apt-get install python3.6
```
The installation guide of nodejs can be found [here](https://docs.npmjs.com/getting-started/installing-node) and the guide for yarn can be found [here](https://yarnpkg.com/en/)

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
