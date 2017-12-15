# NETS 212 Final Project

Facebook-clone for NETS 212. View the Dropbox paper [here.](https://paper.dropbox.com/doc/NETS-212-Final-Project-ez4p6TwrYmhhTXeR6T8qu)

### Features
* __Users__
  * Profile picture updates
  * Cover photo updates
  * Birthday, name
  * Has many friends
  * Has many statuses
* __Statuses:__ statuses can be written on the newsfeed or on a user's wall. Statuses are also generated implicitly with profile updates.
* __Friendships:__ users have many friends. Users see posts by their friends or written to their friends.
* __Affiliations:__ users can be grouped based on a common affiliation. A user has one affiliation.
* __Interests:__ users can be grouped based on common interests. A user has many interests.
* __Friend recommendations:__ recommending friends with an adsorption algorithm written in Java on Hadoop MapReduce.
* __Chats:__ group chats between users handled via Socket IO
* __Online now:__ list of users who are currently online (logged in)
* __Visualizer:__ means of visualizing a user's friendships and affiliations with other users.

### Stack used
* Node
* React
* Redux
* Amazon DynamoDB
* Amazon EC2
* Express
* Socket IO

### Setup

To start, `clone` the repository and then run `npm install`. Make sure that you have a `config.json` file created in the route directory just like in HW4 which contains your AWS public and secret keys and your region for AWS DynamoDB. Note that this is not included in the git repository because you should never publish your keys to GitHub, even in a private repository.

There are a variety of scripts that you can run as detailed in the `package.json` file. When editing react components, for example, it makes sense to run `npm run backend` and `npm run frontend` in different terminal windows (that is, concurrently).

There's information about the boilerplate below, but for our general workflow:
* Always run `git pull` before starting or committing anything.
* Always work in a separate branch and create a pull request for everyone else to approve before merging into master.
  * This will become increasingly important as the project gets more complex.
* Update the feature list and document everything your write with comments.

# React + Node Starter

## Overview

This is a simple starter to get you up and running for React projects. This is intended to provide:

* a lightweight webpack config (for development and production)
* some helpful tooling for development workflow
* a similar setup to what you'll see in the wild
* Heroku-ready deployment setup

## Running

Install dependencies: `$ npm install` or `$ yarn`

Fire up a development server: `$ npm run dev`

Once the server is running, you can visit `http://localhost:3000/`

## File layout

- **Frontend React**
    - The top level application Container is in `frontend/containers/AppContainer.js`
    - CSS styles are in `frontend/assets/stylesheets/base.scss`
- **Backend Express**
    - Entry point is `server.js`
    - API routes are under `backend/routes.js`
    - API routes are served under `http://localhost:3000/api`

## Production Build

To build your production assets and run the server:

```
$ npm start
```

## Deploying to Heroku

This app is set up for deployment to Heroku!

_This assumes you have already have a Heroku account and have the
[Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed_

```
$ heroku login
$ heroku create -a name-of-your-app
$ git push heroku master
$ heroku open
```

Heroku will follow the `build` command in your `package.json` and compile assets with `webpack.prod.config.js`. It runs the Express web server in `server.js`.

If you're unfamiliar with Heroku deployment (or just need a refresher), they have a really great walkthrough [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction).

## Running on Glitch

1. Go to https://glitch.com/edit/#!/horizons-hackathon-react and click
  `Remix this 🎤`
1. Click `Show` at the top to preview your app!
