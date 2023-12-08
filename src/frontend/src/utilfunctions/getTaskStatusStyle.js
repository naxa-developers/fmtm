import { Fill, Icon, Stroke, Style } from 'ol/style';
import { transform } from 'ol/proj';
import { Point } from 'ol/geom';
import AssetModules from '../shared/AssetModules';
import { createTextStyle, defaultStyles } from '../components/MapComponent/OpenLayersComponent/helpers/styleUtils';
import { task_priority_str } from '../types/enums';



const strokeColor = 'rgb(0,0,0,0.5)';
function createPolygonStyle(fillColor, strokeColor,customLabel) {
  return new Style({
    stroke: new Stroke({
      color: strokeColor,
      width: 3,
    }),
    fill: new Fill({
      color: fillColor,
    }),
    text: customLabel,

  });
}
function createIconStyle(iconSrc,customLabel) {
  return new Style({
    image: new Icon({
      anchor: [0.5, 1],
      scale: 0.8,
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: iconSrc,
    }),
    text: customLabel,

    geometry: function (feature) {
      const convertedCenter = transform(feature.values_.centroid, 'EPSG:4326', 'EPSG:3857');
      return new Point(convertedCenter);
    },
  });
}
const getTaskStatusStyle = (feature,resolution, mapTheme) => {
  let id = feature.getId().toString().replace('_', ',');
  const customTaskLabel =createTextStyle({...defaultStyles,showLabel:true,labelField:'name',labelOffsetY:-20}, feature, resolution);
  const status = id.split(',')[1];
  const lockedPolygonStyle = createPolygonStyle(mapTheme.palette.mapFeatureColors.locked_for_mapping_rgb, strokeColor,customTaskLabel);
  const lockedValidationStyle = createPolygonStyle(
    mapTheme.palette.mapFeatureColors.locked_for_validation_rgb,
    strokeColor,
    customTaskLabel
  );
  const iconStyle = createIconStyle(AssetModules.LockPng);
  const redIconStyle = createIconStyle(AssetModules.RedLockPng);

    
  const geojsonStyles = {
    READY: new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: 3,
      }),
      fill: new Fill({
        color: mapTheme.palette.mapFeatureColors.ready_rgb,
      }),
      text: customTaskLabel,

    }),
    LOCKED_FOR_MAPPING: [lockedPolygonStyle, iconStyle],
    MAPPED: new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: 3,
      }),
      fill: new Fill({
        color: mapTheme.palette.mapFeatureColors.mapped_rgb,
      }),
      text: customTaskLabel,

    }),
    LOCKED_FOR_VALIDATION: [lockedValidationStyle, redIconStyle],

    VALIDATED: new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: 3,
      }),
      fill: new Fill({
        color: mapTheme.palette.mapFeatureColors.validated_rgb,
      }),
      text: customTaskLabel,

    }),
    INVALIDATED: new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: 3,
      }),
      fill: new Fill({
        color: mapTheme.palette.mapFeatureColors.invalidated_rgb,
      }),
      text: customTaskLabel,

    }),
    BAD: new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: 3,
      }),
      fill: new Fill({
        color: mapTheme.palette.mapFeatureColors.bad_rgb,
      }),
      text: customTaskLabel,

    }),
    SPLIT: new Style({
      stroke: new Stroke({
        color: strokeColor,
        width: 3,
      }),
      fill: new Fill({
        color: mapTheme.palette.mapFeatureColors.split_rgb,
      }),
      text: customTaskLabel,

    }),
  };
  return geojsonStyles[status];
};

export default getTaskStatusStyle;
