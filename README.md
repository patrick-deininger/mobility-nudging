
# Edision
Edison is a framework for conducting online experiments. It provides a nudge testing framework based on React, Django + GraphQL Relay Modern backend.


## Quick start & Installation:
You will need python 3.6 and nodejs as well as yarn installed.
```
sudo apt-get install python3.6
```
The installation guide of nodejs can be found [here](https://docs.npmjs.com/getting-started/installing-node) and the guide for yarn can be found [here](https://yarnpkg.com/en/).

You will also need to have a virtualenv activated before running npm install/yarn or the post install build step will fail as django needs to be available to dump the graphql_schema

```
source ~/.virtualenvs/mobility-nudging/bin/activate
pip3 install -r ./lib/deps/dev.txt
yarn
```

To launch Edision it is recommended to use three different console tabs:
1. Start the Django server. The first two commands are only necessary for the first start or when there are changes in the model. For further information please read the Django [documentation](https://docs.djangoproject.com/en/2.1/).
```
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py runserver
```

2. React
```
yarn start
```

3. Let relay deal with mutations and queries. This is only necessary for the first start or when there are changes regarding queries and mutations. For further information please read the Relay [documentation](https://facebook.github.io/relay/docs/en/introduction-to-relay.html).
```
yarn relay
```

### Deployment
For the deployment some changes in webpack.config are necessary.
Adapt the url (which is 'http://localhost' per default):
```
...
const url = 'http://ipe-dsm.fzi.de'
...
```
Define host IP-address:
```
...
module.exports = {
  entry: {
    app: appEntry,
    vendor: ['react', 'react-dom', 'react-relay']
  },
  output: {
    path: buildPath,
    filename: "[name]-[hash].js",
    publicPath: publicPath
  },
  devtool,
  devServer: {
    // Add IP address for deployment
    //host: 'xxx.xxx.xxx.xxx',
    hot: true,
    port: devServerPort,
    historyApiFallback: true,
    stats: "errors-only",
    contentBase: buildPath,
    ...
```
To start the Django server on port, e. g. 8000, with the command:
```
python3 manage.py runserver 0.0.0.0:8000
```
or
```
python3 manage.py runserver http://ipe-dsm.fzi.de:8000
```
It will now be publicly accessible.


## Overview
The first page the user will see is the landing page specified in WelcomeView. On the next screen (BeginningScreen) the user is introduced to the general experiment context and instructions.

Note: before entering the BeginningScreen in the default version an automated registration of the user is conducted, which is essential to gain an user ID, which in turn is necessary for later processes and the evaluation. The automated registration process makes use of placeholders for names, emails and passwords, however it can also be modified in the code so the registration is done by the users themselves. During the registration the user is also logged in for 60 minutes by placing a cookie. If she is logged out after this time and enters Edison again, a new registration is processed and a new account is created (without linking it to the previous one).

When leaving the BeginningScreen a new session is created. From all session configurations that are below their respective iteration limit a random session configuration is chosen and assigned to the user. Note: To create a session an unique combination of a session configuration ID and user ID is necessary, so a user can only execute a session configuration once.

During the session the user is guided through a set of blocks, each consisting of a context, activity and feedback part, each represented by a single screen (ContextScreen, ActivityScreen and FeedbackScreen). The sequence of the blocks is determined by the order the block configurations were assigned to a session configuration.

![experiment](https://user-images.githubusercontent.com/26986768/44374873-e4a62480-a4f0-11e8-9f50-868414b5b533.png)

The url contains information about the session ID and the respective block ID, which are both base64 encoded. When there are no blocks left the user is guided to the FinishScreen from which she can access an external survey tool, e.g. limesurvey, specified in session configuration.

Every time the user changes or reloads a screen event as well as user input data is directly stored in the database. If the user returns to previous pages and changes parameters those events will be tracked as well. It is up to the evaluation of the experiment designer if this data is necessary. The database (db.squlite3) can be found in the root folder of the project.

## Set-up
Before starting an experiment all configurations must be specified. This can be done via the admin page:
```
http://localhost:8000/cockpit
```
Cockpit view:
![cockpit](https://user-images.githubusercontent.com/26986768/44374655-aeb47080-a4ef-11e8-9028-ae52a742e411.png)

Note: Before creating sessions or blocks the nudge, context and feedback configuration must be defined since these are part of blocks and thus sessions.

Configuration of a session:
![sessionconfig](https://user-images.githubusercontent.com/26986768/44374700-f20edf00-a4ef-11e8-995a-e0109aa622fd.png)

Configuration of block:
![blockconfig](https://user-images.githubusercontent.com/26986768/44374633-8e84b180-a4ef-11e8-8a1c-2c4c87798e61.png)

Add blocks to session:
![sessionblockconfig](https://user-images.githubusercontent.com/26986768/44374803-82e5ba80-a4f0-11e8-88b0-469b81b7f20a.png)

Nudge configuration:
![nudgeconfig](https://user-images.githubusercontent.com/26986768/44374811-9133d680-a4f0-11e8-9bfb-df45e98b6f1b.png)

Context configuration:
![contextconfig](https://user-images.githubusercontent.com/26986768/44374821-aad51e00-a4f0-11e8-8109-4821b7864534.png)


Feedback configuration
![feedbackconfig](https://user-images.githubusercontent.com/26986768/44374841-be808480-a4f0-11e8-9f2e-c5ee309a4060.png)
