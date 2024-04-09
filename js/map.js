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
  "esri/views/MapView",
  "esri/widgets/Editor",
  "esri/widgets/Expand",
  "esri/widgets/Home",
  "esri/widgets/LayerList",
  "esri/widgets/Locate"
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
    MapView,
    Editor,
    Expand,
    Home,
    LayerList,
    Locate
    ) =>
  (async () => {

    esriConfig.apiKey = "AAPK9c2d1c71e0c54fea8c41854d79e2bb2aRY4BboQbjkrg1gzIR4byHHAPQAnvnqnY0kwBUXQfbQGvJjGbV3it18SqxWbjCtON";

    // create a basemap from the basemap styles service 
    // https://developers.arcgis.com/rest/basemap-styles/
    const basemap = new Basemap({
      style: {
        id: "arcgis/outdoor",
        language: "en" // displays basemap place labels in english
      }
    });

    // Define clipped aerial imagery layer from Desert Museum arcgis online hosted by Botany_ASDM
    const layerAerial = new TileLayer({
      url: "https://tiles.arcgis.com/tiles/KlCTOkj6oMImilrU/arcgis/rest/services/ESRI_tiled2017/MapServer",
      title: "Aerial Image"
    })



    // Define layers digitized from Desert Museum map handout and hosted by steslow@wisc.edu_UW_Mad
            const layerDirtPaths = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Desert_Museum_Dirt_Paths/FeatureServer",
              outFields: ["*"],
              labelsVisible: false,
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-line",
                  color: [210, 180, 160, 1],
                  width: "5px"
                }
              },
              title: "Dirt Paths"
            });

            const layerPavedPaths = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Desert_Museum_Paved_Paths/FeatureServer",
              outFields: ["*"],
              labelsVisible: false,
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-line",
                  color: [245, 245, 245, 1],
                  width: "5px"
                }
              },
              title: "Paved Paths"              
            });

            const layerStructures = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Desert_Museum_Structures/FeatureServer",
              outFields: ["*"],
              labelsVisible: false,
              title: "Buildings"
            });

            const layerExhibits = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Desert_Museum_Map_Exhibits/FeatureServer",
              outFields: ["*"],
              title: "Exhibit Areas",
              labelsVisible: false,
              renderer: {
                type: "unique-value", // autocasts as new UniqueValueRenderer()
                field: "Type",
                uniqueValueInfos: [{
                  value: "Building",
                  symbol: {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [70, 0, 250, 0.2],
                    outline: { // autocasts as new SimpleLineSymbol()
                      color: [70, 0, 250, 0.5],
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
              popupTemplate: {
                title: "{Name}",
                content: [{
                  type: "text", // autocasts as new TextContext
                  text: "<p>{Description}</p>"
                }]
              }
            });

            const layerPoints = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map_Points/FeatureServer",
              outFields: ["*"],
              popupEnabled: false,
              labelsVisible: false,
              renderer: await setLayerPointsRenderer(),
              // popupTemplate: {
              //   title: "{Type}",
              //   content: [{
              //     type: "text", // autocasts as new TextContext
              //     text: "<p>{Name}</p>"
              //   }]
              // }
            });
            
            const layerDetailedPoints = new FeatureLayer({
              url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Detailed_Points/FeatureServer",
              outFields: ["*"],
              title: "Points with Details",
              labelsVisible: false,
              renderer: await setLayerDetailedPointsRenderer(),
              popupTemplate: {
                title: "{name} ({category})",
                content: [{
                  type: "text", // autocasts as new TextContext
                  text: "<p>{description}</p><img src='{thumb_url}'>"
                }]
              }
            });

    /* Link to Arizona-Sonora Desert Museum wayfinding Web Map */
    // /* https://www.arcgis.com/home/item.html?id=63e9481acb8947318c7d5150b00b06c9 */
    // const webmap = new WebMap({
    //   portalItem: {
    //     id: "63e9481acb8947318c7d5150b00b06c9"
    //   }
    // });

    const layers = [layerAerial, layerDirtPaths, layerPavedPaths, layerStructures, layerExhibits, layerPoints, layerDetailedPoints]

    const map = new Map({
      basemap,
      layers: layers
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
    
    const locateBtn = new Locate({
      view: view
    });

    view.ui.add(locateBtn, {
      position: "top-left"
    });

    const homeBtn = new Home({
      view: view
    });

    view.ui.add(homeBtn, "top-left");

    // Add a legend intance of the panel of a ListItem in a LayerList instance
    const layerList = new LayerList({
      view: view,
      container: document.createElement("div"), // assign to a div to use with Expand
      listItemCreatedFunction: (event) => {
        const item = event.item;
        if (item.layer.type != "group") {
          // don't show legend twice
          item.panel = {
            content: "legend",
            open: true
          };
        }
      }
    });
    //view.ui.add(layerList, "bottom-left");

    const bgExpand = new Expand({
      view: view,
      content: layerList,
      expandTooltip: "Expand LayerList"
    });

    view.ui.add(bgExpand, "bottom-left");

    const queryExpand = new Expand({
      view: view,
      content: document.getElementById("infoDiv"),
      expanded: "true",
      expandTooltip: "Query Results Panel",
    });
    view.ui.add(queryExpand, "top-right");

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



    /*filter associated with layerview associated with layerDetailedPoints*/
    const layerView = await view.whenLayerView(layerDetailedPoints);


    // get UI components involved in top features query
    const plantsSelection = document.getElementById("plantsBtn");
    const animalsSelection = document.getElementById("animalsBtn");
    const facilitiesSelection = document.getElementById("facilitiesBtn");

    const clearQueryButton = document.getElementById("clear-query");
    //const runQueryButton = document.getElementById("run-query");

    // Grab collection of HTML elements with class name queryBtn and assign a function to
    // run attribute query on layerDetailedPoints, filter map, and add results to side panel
    allQueryBtns = document.getElementsByClassName("queryBtn");
    for (let i = 0; i < allQueryBtns.length; i++) {
      allQueryBtns[i].addEventListener("click", async () => {
        clearQueryButton.appearance = "outline";
        //runQueryButton.appearance = "solid";

      // Building the SQL where clause based on selection of plant/animal/facility buttons
      // Only allowing one attribute to be queried at a time
        let whereClause = (plantsSelection.value == "") ? 
          "": "category = 'Plant'";
        
        whereClause = (animalsSelection.value == "") ? 
          whereClause: whereClause + "category = 'Animal'";
        
        whereClause = (facilitiesSelection.value == "") ?
          whereClause: whereClause + "category = 'Facility'";
        
        //console.log(whereClause);

        // query all features from the layer and only return attributes specified in outFields.
        const query = { // autocasts as Query
          where: whereClause,
          returnGeometry: true,
          outFields: ["name", "category", "description", "thumb_url"],
          orderByFields: ["name"]
        };

        const results = await layerDetailedPoints.queryFeatures(query);

        document.getElementById("resultsDiv").style.display = "block";
        document.getElementById("resultsHeading").innerHTML = `Results: ${results.features.length} Points`;
        document.getElementById("results").innerHTML = "";


        graphics = results.features;
        graphics.forEach((result, index) => {
          const attributes = result.attributes;
          const item = document.createElement("calcite-pick-list-item");
          item.setAttribute("label", attributes.name);
          item.setAttribute("value", index);
          item.setAttribute("description", attributes.description);

          item.addEventListener("click", resultClickHandler);
          document.getElementById("results").appendChild(item);
        });

        // set query for the queryObjectIds.
        query.orderByFields = [""];
        const objectIds = await layerDetailedPoints.queryObjectIds(query);
        layerView.filter = {
          objectIds
        };

      });

    };

    // this function runs when user clicks on items in the results list
    function resultClickHandler(event) {
      const target = event.target;
      const resultId = target.getAttribute("value");

      // get the graphic corresponding to the clicked zip code
      const result = resultId && graphics && graphics[parseInt(resultId)];

      if (result) {
        view.openPopup({
          features: [result],
          location: result.geometry
        });
        view.goTo({
          center: result.geometry
        });
      }
    }

    clearQueryButton.addEventListener("click", () => {
      clearQueryButton.appearance = "solid";
      //runQueryButton.appearance = "outline";
      layerView.filter = null;
      view.closePopup();
      document.getElementById("resultsHeading").innerHTML = `Results`;
      document.getElementById("results").innerHTML = "";

      allQueryBtns = document.getElementsByClassName("queryBtn");
      for (let i = 0; i < allQueryBtns.length; i++) {
        allQueryBtns[i].value = "";
        allQueryBtns[i].className = "btn queryBtn";
      };
    });


    // async renderer functions to get external symbol pngs
    async function setLayerPointsRenderer() {
      let layerPointsRenderer = {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        field: "Type",
        uniqueValueInfos: [{
          value: "Accessible Restroom",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/wheelchair.png",
            width: "20px",
            height: "20px",
          }
        }, {
          value: "Entrance/Exit",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/star.png",
            width: "20px",
            height: "20px",
          }
        }, {
          value: "First Aid",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/firstaid.png",
            width: "20px",
            height: "20px",
          }
        }, {
          value: "Food & Drink",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/food.png",
            width: "20px",
            height: "20px",
          }
        }, {
          value: "Gift Shop",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/cart.png",
            width: "20px",
            height: "20px",
          }
        }, {
          value: "Restrooms",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/restroom.png",
            width: "20px",
            height: "20px",
          }
        }, {
          value: "Water Fountains",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/droplet.png",
            width: "20px",
            height: "20px",
          }
        }]
      };
      return layerPointsRenderer
    }

    async function setLayerDetailedPointsRenderer() {
      let layerDetailedPointsRenderer = {
        type: "unique-value", // autocasts as new UniqueValueRenderer()
        field: "category",
        uniqueValueInfos: [{
          value: "Facility",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/facility.png",
            width: "20px",
            height: "20px",
          }
        }, {
          value: "Animal",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/pawprint.png",
            width: "20px",
            height: "20px",
          }
        }, {
          value: "Plant",
          symbol: {
            type: "picture-marker",
            url: "https://steslowj.github.io/geog777_proj2/img/flower.png",
            width: "20px",
            height: "20px",
          }
        }]
      };
      return layerDetailedPointsRenderer
    }    

  })());