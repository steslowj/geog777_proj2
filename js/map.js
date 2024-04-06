require([
  "esri/config",
  "esri/Basemap",
  "esri/Map",
  "esri/WebMap",
  "esri/geometry/Point",
  "esri/geometry/SpatialReference",
  "esri/layers/MediaLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/support/ControlPointsGeoreference",
  "esri/layers/support/ImageElement",
  "esri/layers/TileLayer",
  "esri/renderers/UniqueValueRenderer",
  "esri/rest/support/TopFeaturesQuery",
  "esri/rest/support/TopFilter",
  "esri/symbols/WebStyleSymbol",
  "esri/views/MapView"
], (
    esriConfig, 
    Basemap, 
    Map, 
    WebMap, 
    Point, 
    SpatialReference, 
    MediaLayer, 
    FeatureLayer, 
    ControlPointsGeoreference, 
    ImageElement, 
    TileLayer,
    UniqueValueRenderer, 
    TopFeaturesQuery, 
    TopFilter,
    WebStyleSymbol, 
    MapView
    ) =>
  (async () => {

    esriConfig.apiKey = "AAPK9c2d1c71e0c54fea8c41854d79e2bb2aRY4BboQbjkrg1gzIR4byHHAPQAnvnqnY0kwBUXQfbQGvJjGbV3it18SqxWbjCtON";

    // create a basemap from the basemap styles service 
    // https://developers.arcgis.com/rest/basemap-styles/
    const basemap = new Basemap({
      style: {
        id: "arcgis/streets-relief",
        language: "en" // displays basemap place labels in english
      }
    });

    // Define clipped aerial imagery layer from Desert Museum arcgis online hosted by Botany_ASDM
    const layerAerial = new TileLayer({
      url: "https://tiles.arcgis.com/tiles/KlCTOkj6oMImilrU/arcgis/rest/services/ESRI_tiled2017/MapServer"
    })



    // Define layers digitized from Desert Museum map handout and hosted by steslow@wisc.edu_UW_Mad
            const layer = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Desert_Museum_Dirt_Paths/FeatureServer",
              outFields: ["*"],
            });

            const layerPavedPaths = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Desert_Museum_Paved_Paths/FeatureServer",
              outFields: ["*"],
            });

            const layerStructures = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Desert_Museum_Structures/FeatureServer",
              outFields: ["*"],
            });

            const layerExhibits = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Desert_Museum_Map_Exhibits/FeatureServer",
              outFields: ["*"],
              renderer: {
                type: "unique-value", // autocasts as new UniqueValueRenderer()
                field: "Type",
                uniqueValueInfos: [{
                  value: "Building",
                  symbol: {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [70, 0, 250, 0.1],
                    outline: { // autocasts as new SimpleLineSymbol()
                      color: [70, 0, 250, 0.3],
                      width: "1px"
                    }
                  }
                }, {
                  value: "Exhibit",
                  symbol: {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [0, 200, 200, 0.3],
                    outline: { // autocasts as new SimpleLineSymbol()
                      color: [0, 200, 200, 0.5],
                      width: "1px"
                    }
                  }
                }, {
                  value: "Garden",
                  symbol: {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [50, 180, 0, 0.3],
                    outline: { // autocasts as new SimpleLineSymbol()
                      color: [50, 180, 0, 0.5],
                      width: "1px"
                    }
                  }
                }, {
                  value: "Trail",
                  symbol: {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [200, 145, 0, 0.3],
                    outline: { // autocasts as new SimpleLineSymbol()
                      color: [200, 145, 0, 0.5],
                      width: "1px"
                    }
                  }
                }]
              },
              popupTemplate: createPopupTemplate()
            });

            const layerPoints = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map_Points/FeatureServer",
              outFields: ["*"],
              popupTemplate: createPopupTemplate()
            });
            
            const layerDetailedPoints = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Detailed_Points/FeatureServer",
              outFields: ["*"],
              popupTemplate: createPopupTemplate()
            });

    /* Link to Arizona-Sonora Desert Museum wayfinding Web Map */
    // /* https://www.arcgis.com/home/item.html?id=63e9481acb8947318c7d5150b00b06c9 */
    // const webmap = new WebMap({
    //   portalItem: {
    //     id: "63e9481acb8947318c7d5150b00b06c9"
    //   }
    // });

    const map = new Map({
      basemap,
      layers: [layer, layerPavedPaths, layerStructures, layerExhibits, layerPoints, layerDetailedPoints]
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-111.168, 32.243],
      zoom: 17,
      padding: {
        right: 380
      }
    });



    // creating parameters to add Desert Museum Illustration PNG and georeference it
    // currently doesn't seem to add the image to the application

    const addIllustrationMediaLayer = async () => {

      // view.constraints.maxScale = 10000;
      // view.constraints.minScale = 10000000;

            // Define spatial reference for control points
            const spatialReference = new SpatialReference({ wkid: 2868});

            // Define array of control points representing coordiates on the MediaLayer's ImageElement
            const sourcePoint1 = new Point({x: 931191.654534, y: 453191.920111, spatialReference });
            const sourcePoint2 = new Point({x: 931285.894417, y: 452878.318674, spatialReference });
            const sourcePoint3 = new Point({x: 931481.067735, y: 452898.693216, spatialReference });
            const sourcePoint4 = new Point({x: 931292.618170, y: 452630.342485, spatialReference });
            const sourcePoint5 = new Point({x: 930878.863162, y: 452615.594395, spatialReference });
            const sourcePoint6 = new Point({x: 930739.162564, y: 452921.023118, spatialReference });
            const sourcePoint7 = new Point({x: 931227.857009, y: 453641.544508, spatialReference });
            const sourcePoint8 = new Point({x: 930679.811750, y: 452660.514004, spatialReference });
            const sourcePoint9 = new Point({x: 931682.195710, y: 452729.766582, spatialReference });

            // create an array of control points composed of a sourcePoint, a point on the image element
            // in pixels, and a mapPoint which is the location of the sourcePoint in map space

            const controlPoint1 = {
              sourcePoint: sourcePoint1,
              mapPoint: {x: 931242.130451, y:	453168.263039}
            };

            const controlPoint2 = {
              sourcePoint: sourcePoint2,
              mapPoint: {x: 931355.790700, y:	452890.095253}
            };

            const controlPoint3 = {
              sourcePoint: sourcePoint3,
              mapPoint: {x: 931535.343910, y:	452950.059892}
            };

            const controlPoint4 = {
              sourcePoint: sourcePoint4,
              mapPoint: {x: 931394.290724, y:	452644.444655}
            };

            const controlPoint5 = {
              sourcePoint: sourcePoint5,
              mapPoint: {x: 930991.573656, y: 452550.068490}
            };

            const controlPoint6 = {
              sourcePoint: sourcePoint6,
              mapPoint: {x: 930816.108944, y:	452815.139453}
            };

            const controlPoint7 = {
              sourcePoint: sourcePoint7,
              mapPoint: {x: 931238.501909, y:	453615.143553}
            };

            const controlPoint8 = {
              sourcePoint: sourcePoint8,
              mapPoint: {x: 930807.925293, y:	452562.109063}
            };

            const controlPoint9 = {
              sourcePoint: sourcePoint9,
              mapPoint: {x: 931746.035777, y:	452821.831921}
            };

            const controlPoints = [
              controlPoint1,
              controlPoint2,
              controlPoint3,
              controlPoint4,
              controlPoint5,
              controlPoint6,
              controlPoint7,
              controlPoint8,
              controlPoint9
            ];

            // georeference for the imageElement using the control points, image width, and image height
            const controlPointsGeoreference = new ControlPointsGeoreference({ controlPoints, width: 2510, height: 2325});

            const imageElement = new ImageElement({
              image: "./img/Desert-Museum-Illustration",
              georeference: controlPointsGeoreference
            });

            const mediaLayer = new MediaLayer({
              source: [imageElement],
              title: "Illustration",
              spatialReference
            });

        map.add(mediaLayer);


        await view.when();
        await mediaLayer.when();

    };

    //addIllustrationMediaLayer();



    const layerView = await view.whenLayerView(layer);


    // get UI components involved in top features query
    const plantsSelection = document.getElementById("plantsBtn");
    const animalsSelection = document.getElementById("animalsBtn");
    const facilitiesSelection = document.getElementById("facilitiesBtn");
    const eventsSelection = document.getElementById("eventsBtn");

    const clearQueryButton = document.getElementById("clear-query");
    const queryParksButton = document.getElementById("query-parks");

    // This function runs when user clicks on query parks button
    document.getElementById("query-parks").addEventListener("click", async () => {
      clearQueryButton.appearance = "outline";
      queryParksButton.appearance = "solid";



      // TopFeatureQuery parameter for the queryTopFeatures method collect user inputs 
      query = new TopFeaturesQuery({
        topFilter: new TopFilter({
          topCount: parseInt(topCountSelect.selectedOption.value),
          groupByFields: ["State"],
          orderByFields: orderByField
        }),
        orderByFields: orderByField,
        outFields: ["State, TOTAL, F2018, F2019, F2020, Park"],
        returnGeometry: true,
        cacheHint: false
      });
      const results = await layer.queryTopFeatures(query);


      document.getElementById("resultsDiv").style.display = "block";
      document.getElementById("resultsHeading").innerHTML = `Results: ${results.features.length} parks`;
      document.getElementById("results").innerHTML = "";


      graphics = results.features;
      graphics.forEach((result, index) => {
        const attributes = result.attributes;
        const item = document.createElement("calcite-pick-list-item");
        item.setAttribute("label", attributes.Park);
        item.setAttribute("value", index);

        item.setAttribute("description", index);
        item.addEventListener("click", parkResultClickHandler);
        document.getElementById("results").appendChild(item);
      });



      // set query for the queryTopObjectIds.
      query.orderByFields = [""];
      const objectIds = await layer.queryTopObjectIds(query);
      layerView.filter = {
        objectIds
      };

    });

    // this function runs when user clicks on items in the results list
    function parkResultClickHandler(event) {
      const target = event.target;
      const resultId = target.getAttribute("value");

      // get the graphic corresponding to the clicked zip code
      const result = resultId && graphics && graphics[parseInt(resultId, 10)];

      if (result) {
        view.openPopup({
          features: [result],
          location: result.geometry
        });
      }
    }

    clearQueryButton.addEventListener("click", () => {
      clearQueryButton.appearance = "solid";
      queryParksButton.appearance = "outline";
      layerView.filter = null;
      view.closePopup();
      document.getElementById("resultsHeading").innerHTML = `Results`;
      document.getElementById("results").innerHTML = "";
    });

    async function setExhibitRenderer() {
      const symbol = new WebStyleSymbol({
        name: "park",
        styleName: "Esri2DPointSymbolsStyle"
      });

      const cimSymbol = await symbol.fetchCIMSymbol();
      const symbolLayer = cimSymbol.data.symbol.symbolLayers[0];
      symbolLayer.size = 16;
      cimSymbol.data.symbol.symbolLayers = [symbolLayer];

      return {
        type: "simple",
        symbol: cimSymbol
      };
    }

    function createPopupTemplate() {
      return {
        title: "{Park}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "TOTAL",
                label: "Total visits",
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: "F2018",
                label: "2018",
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: "F2019",
                label: "2019",
                format: {
                  places: 0,
                  digitSeparator: true
                }
              },
              {
                fieldName: "F2020",
                label: "2020",
                format: {
                  places: 0,
                  digitSeparator: true
                }
              }
            ]
          }
        ]
      };
    }
  })());