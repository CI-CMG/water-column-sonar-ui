## Echofish

https://echo.fish

[![Deploy DEV to dev.echo.fish](https://github.com/CI-CMG/water-column-sonar-ui/actions/workflows/deploy_dev_action.yaml/badge.svg)](https://github.com/CI-CMG/water-column-sonar-ui/actions/workflows/deploy_dev_action.yaml)

# TODO:
 - ~~need maitenance mode for when I am updating zarr stores~~
 - mask sub-bottom data w checkbox, not linestring
 - Update Robots.txt and reindex 
 - allow clicking on linestring in mini-map viewer & redirect to new cruise
 - add total Level_2 dataset size e.g. 120 GB to info panel
 - capture echopype provenance --> need to do in water-column-sonar-processing Zarr store metadata
 - constrain the input Sv Range Minimum dB to be less than Maximum dB
 - ~~open and add "speed" to zarr --> needs to be manually written to zarr stores~~
 - get zoom working
 - add toggle from UTC/local-time --> need to get moment library working again
 - add celestial information for sunrise/sunset
 - add celestial information for moon phase
 - sync views (leaflet vs maplibre): https://maplibre.org/maplibre-gl-js/docs/examples/sync-move/
 - constrain Sv form input to int, prevent float --> too hard
 - prototype knowledge graph query

# Tag a Release
Step 1 --> increment the semantic version in the "package.json" under the "version" field.
```commandline
git tag -a v26.2.5 -m "Releasing v26.2.5"
git push origin --tags
```

# Releasing to Test/Prod
Test will be automatically released anytime a tagged release is created and the project can be built automatically.

Prod will only release manually. If you navigate to https://github.com/CI-CMG/water-column-sonar-ui/actions/workflows/deploy_prod_action.yaml and select 'Run workflow'. You can specify the specific tagged version of the project to release, e.g. "v25.6.10".

# Check for outdated packages
> npm outdated