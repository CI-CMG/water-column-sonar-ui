<h1 href="https://git.io/typing-svg">
<img src="https://readme-typing-svg.herokuapp.com/?lines=EchoFish&size=24" />

# TODO:
 - ~~install bootstrap~~
 - ~~remove material design mui~~
 - ~~get nav bar up and running~~
 - ~~update zarrita to newest version~~
 - ~~get color palette working <https://2019.wattenberger.com/blog/react-and-d3>~~
 - ~~color palette needs min/max/colorMap/labels~~
 - ~~move 'calibration status' higher in the legend~~
 - ~~add ship icon to minimap~~
 - ~~sync up map center with mini-map~~
 - ~~get plot Sv values properly populated -> get num of frequencies~~
 - ~~get time/lat/lon/Sv from click~~
 - ~~format time w GMT/local~~
 - ~~don't hard code tile size~~
 - ~~open bottom array w zarr~~
 - ~~get leaflet working again~~
 - center the water-column view when user first opens the data...
 - get rid of zarr package from getZarrGeoSpatialIndex page - replace w zarrita
 - get jump to x axis time value working...
 - debounce mini map follow wc center...
 - refresh layer when clicking on frequency/colorMap/minSv/maxSv button...
 - add code to hide layers icon(s) in top-right via css
 - update x-axis in query searchParameters w panning
 - add better labels to color palette legend -- [start middle stop]
 - allow clicks in mini-map viewer
 - fix fetchSv to get proper frequency value? --> gets all for the plot right now
 - mask sub-bottom data w checkbox, not linestring
 - add graticules -> legend for depth, time
 - constrain the input Sv Range Minimum dB to be less than Maximum dB
 - regenerate pm-tiles with latest data
 - draw evr polygon on data -> currently circle
 - reenable click on linestring and query zarr store gps coordinates -> take to timeIndex
 - deploy to domain echo.fisf
 - add bathymetric layer to map viewer
 - add total Level_2 dataset size e.g. 120 GB to info panel
 - print total dimensions of L2 data: depth x time x frequency
 - prototype knowledge graph query
 - make sure lat/lon are always 5 decimals, sv is always 2, depth is 2
 - add link to echofish tagged releases
 - capture echopype provenance
 - open and add "speed" to zarr --> needs to be manually written to zarr stores
 - restrain boundaries for leaflet, bounce back to data
 
 - get zoom working
 - add toggle from UTC/local-time --> need to get moment library working
 
 - slowfly on home map <https://maplibre.org/maplibre-gl-js/docs/examples/flyto-options/>
 - sync views (leaflet vs maplibre): https://maplibre.org/maplibre-gl-js/docs/examples/sync-move/
 - update cfn deployment to s3 copy