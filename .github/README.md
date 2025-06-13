## Dev Test and Prod Deployments

# Dev
For development each push to the repo's main branch will be built and deployed to the 'dev' tier accessible at "dev.echo.fish." The changes here are meant to be a continous snapshot of whatever is being developed.

# Test
More purposely driven and meant for stakeholder review, this is built on each tagged release. A semantic version is associated with each one of these deployments.

# Prod
Meant for the community. A successfully deployed test tier deployment can then be promoted to prod.

# TODO:
 - Get credentials for echofish account and add as secrets to the repo.
 - Write up the process for creating a bucket, cloudfront, hosting, certificates, etc. And what all the steps are needed to do so.
 - Set dev to "build" on each push to main and "deploy" to the dev.echo.fish bucket.
 - Capture process for tagging and semantic versioning somewhere.