# Heroku Deployment via GitLab CI/CD

This project is configured to automatically deploy to Heroku from GitLab.

## Prerequisites

1. A Heroku account and app created
2. GitLab repository with CI/CD enabled

## Setup Instructions

### 1. Create Heroku App

```bash
heroku create "stg-smash-3e6b16e7c4bb"
```

Or create via the Heroku dashboard.

### 2. Configure GitLab CI/CD Variables

In your GitLab project, go to **Settings > CI/CD > Variables** and add:

- **HEROKU_API_KEY**: Your Heroku API key
  - Find it at: https://dashboard.heroku.com/account
  - Or run: `heroku auth:token`
  - Mark as **Protected** and **Masked**

- **HEROKU_APP_NAME**: Your Heroku app name
  - Example: `not-so-super-smash-bros`
  - Mark as **Protected**

### 3. Deploy

The deployment will automatically trigger when you push to the `main` branch.

To manually trigger a deployment:
1. Go to **CI/CD > Pipelines** in GitLab
2. Click **Run Pipeline**
3. Select the `main` branch

## Deployment Process

The GitLab CI pipeline has three stages:

1. **test**: Runs `npm run test`
2. **stg_deploy**: Runs the gulp build process
3. **deploy**: Deploys to Heroku (only on `main` branch)

## Files Created

- **Procfile**: Tells Heroku how to run the app (`web: node ./src/server/app.js`)
- **.gitlab-ci.yml**: Updated with deployment stage

## Verify Deployment

After deployment:

```bash
heroku logs --tail --app "stg-smash-3e6b16e7c4bb"
heroku open --app "stg-smash-3e6b16e7c4bb"
```

Or visit: `https://stg-smash-3e6b16e7c4bb.herokuapp.com`

## Troubleshooting

### Build fails on Heroku

Check the build logs in GitLab CI/CD or run:
```bash
heroku logs --tail --app "stg-smash-3e6b16e7c4bb"
```

### Environment variables

Add any required environment variables to Heroku:
```bash
heroku config:set VARIABLE_NAME=value --app "stg-smash-3e6b16e7c4bb"
```

### Port binding

The app already uses `process.env.PORT || 3000` which is required for Heroku.

## Manual Deployment (Alternative)

If you prefer to deploy manually without GitLab CI/CD:

```bash
# Login to Heroku
heroku login

# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku stg-smash
```
