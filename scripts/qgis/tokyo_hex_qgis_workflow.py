# -*- coding: utf-8 -*-
# Run with:
# D:\Qgis\bin\python-qgis-ltr.bat scripts\qgis\tokyo_hex_qgis_workflow.py
#
# The raw GIS layers are intentionally reduced to hex-level metrics. The web page
# should not load hundreds of thousands of polygons just to show an abstract map.

import os
import sys
import json
from pathlib import Path

from qgis.PyQt.QtCore import QVariant
from qgis.core import (
    QgsApplication,
    QgsCoordinateTransform,
    QgsFeatureRequest,
    QgsField,
    QgsGeometry,
    QgsProject,
    QgsSpatialIndex,
    QgsVectorFileWriter,
    QgsVectorLayer,
)


QGIS_PREFIX = r"D:\Qgis\apps\qgis-ltr"
QGIS_PLUGIN_PATH = os.path.join(QGIS_PREFIX, "python", "plugins")
if QGIS_PLUGIN_PATH not in sys.path:
    sys.path.append(QGIS_PLUGIN_PATH)

qgs_app = None
if QgsApplication.instance() is None:
    QgsApplication.setPrefixPath(QGIS_PREFIX, True)
    qgs_app = QgsApplication([], False)
    qgs_app.initQgis()

import processing
from processing.core.Processing import Processing

Processing.initialize()


PROJECT_ROOT = Path(r"D:\project\reactTest")
DATA_DIR = PROJECT_ROOT / "gis-data"
OUTPUT_PATH = PROJECT_ROOT / "public" / "data" / "tokyo-hex-cells.geojson"
WARD_OVERLAY_PATH = PROJECT_ROOT / "public" / "data" / "tokyo-ward-overlay.json"

WARD_PATH = DATA_DIR / "tokyo-admin-boundary-2026" / "N03-20260101_13.shp"
SCHOOL_PATH = DATA_DIR / "tokyo-schools-2021" / "P29-21_13.shp"
STATION_PATH = DATA_DIR / "japan-railway-2023" / "UTF-8" / "N02-23_Station.shp"
LANDUSE_PATH = DATA_DIR / "tokyo-23ku-landuse-building-2021" / "R03区部全域" / "R03土地利用現況.shp"

HEX_SPACING = 0.028
SVG_BASE_X = 120
SVG_BASE_Y = 82
SVG_HEX_RADIUS = 42
SVG_SQRT_3 = 3 ** 0.5

# Tokyo land-use survey codes. LU_1 is the main category, and LU_2 is a
# subcategory used where the official table exposes useful detail.
LANDUSE_RULES = [
    ("campus", lambda lu1, lu2: lu1 == 112 and lu2 == 1),
    ("theater_square", lambda lu1, lu2: lu1 == 112 and lu2 == 2),
    ("holy_site", lambda lu1, lu2: lu1 == 112 and lu2 == 3),
    ("commercial", lambda lu1, lu2: lu1 in {121, 122, 123, 124}),
    ("entertainment_complex", lambda lu1, lu2: lu1 == 125),
    ("industrial", lambda lu1, lu2: lu1 in {141, 142, 143}),
    ("residential", lambda lu1, lu2: lu1 in {131, 132, 133}),
    ("park", lambda lu1, lu2: lu1 == 300),
    ("railway_harbor", lambda lu1, lu2: lu1 == 520),
    ("farm", lambda lu1, lu2: lu1 in {150, 611, 612, 613, 620}),
    ("water", lambda lu1, lu2: lu1 == 700),
]

# A few high-signal civic/landmark readings are applied before metric fallback.
# This keeps the map close to how people actually describe Tokyo: Chiyoda is not
# just "many rail lines", and Bunkyo is not just "many school points".
WARD_OVERRIDES = {
    "13101": ("government_plaza", "Chiyoda civic core"),
    "13105": ("campus", "Bunkyo academic cluster"),
}

WARD_NAMES = {
    "13101": "千代田区",
    "13102": "中央区",
    "13103": "港区",
    "13104": "新宿区",
    "13105": "文京区",
    "13106": "台東区",
    "13107": "墨田区",
    "13108": "江東区",
    "13109": "品川区",
    "13110": "目黒区",
    "13111": "大田区",
    "13112": "世田谷区",
    "13113": "渋谷区",
    "13114": "中野区",
    "13115": "杉並区",
    "13116": "豊島区",
    "13117": "北区",
    "13118": "荒川区",
    "13119": "板橋区",
    "13120": "練馬区",
    "13121": "足立区",
    "13122": "葛飾区",
    "13123": "江戸川区",
}

LANDMARK_OVERRIDES = [
    {
        "type": "holy_site",
        "name": "Meiji Jingu / Yoyogi grove",
        "lon": 139.6993,
        "lat": 35.6764,
        "radius": 0.018,
    },
    {
        "type": "government_plaza",
        "name": "Imperial Palace / national civic core",
        "lon": 139.7528,
        "lat": 35.6852,
        "radius": 0.02,
    },
    {
        "type": "theater_square",
        "name": "Ueno cultural cluster",
        "lon": 139.7730,
        "lat": 35.7148,
        "radius": 0.016,
    },
    {
        "type": "commercial_hub",
        "name": "Ginza / Nihonbashi trade core",
        "lon": 139.7671,
        "lat": 35.6717,
        "radius": 0.014,
    },
    {
        "type": "commercial_hub",
        "name": "Shinjuku station commerce",
        "lon": 139.7006,
        "lat": 35.6909,
        "radius": 0.014,
    },
    {
        "type": "commercial_hub",
        "name": "Shibuya crossing commerce",
        "lon": 139.7004,
        "lat": 35.6595,
        "radius": 0.014,
    },
    {
        "type": "harbor",
        "name": "Tokyo Port / Odaiba harbor",
        "lon": 139.7730,
        "lat": 35.6286,
        "radius": 0.02,
    },
    {
        "type": "aerodrome",
        "name": "Haneda Airport",
        "lon": 139.7798,
        "lat": 35.5494,
        "radius": 0.026,
    },
    {
        "type": "aqueduct",
        "name": "Nihonbashi / Kanda waterway",
        "lon": 139.7712,
        "lat": 35.6852,
        "radius": 0.012,
    },
    {
        "type": "dam",
        "name": "Arakawa flood control edge",
        "lon": 139.7258,
        "lat": 35.7830,
        "radius": 0.014,
    },
]


def find_shapefiles(root):
    return [path for path in root.rglob("*.shp") if path.is_file()]


def require_layer(path, name):
    layer = QgsVectorLayer(str(path), name, "ogr")
    if not layer.isValid():
        raise RuntimeError("Layer cannot be loaded: {}".format(path))
    QgsProject.instance().addMapLayer(layer)
    return layer


def load_layers(paths, name_prefix):
    layers = []
    for index, path in enumerate(paths, start=1):
        try:
            layers.append(require_layer(path, "{} {}".format(name_prefix, index)))
        except RuntimeError as exc:
            print("Skip layer: {}".format(exc))
    return layers


def count_intersects(target_geom, source_layers):
    count = 0
    for source_layer in source_layers:
        for feature in source_layer.getFeatures(QgsFeatureRequest().setFilterRect(target_geom.boundingBox())):
            if target_geom.intersects(feature.geometry()):
                count += 1
    return count


def count_indexed_intersects(target_geom, source_layer, source_index):
    candidate_ids = source_index.intersects(target_geom.boundingBox())
    if not candidate_ids:
        return 0
    count = 0
    request = QgsFeatureRequest().setFilterFids(candidate_ids)
    for feature in source_layer.getFeatures(request):
        if target_geom.intersects(feature.geometry()):
            count += 1
    return count


def landuse_group_for(lu1, lu2):
    for group, matches in LANDUSE_RULES:
        if matches(lu1, lu2):
            return group
    return None


def summarize_landuse(hex_geom, landuse_layer, landuse_index, transform_to_landuse):
    metric_geom = hex_geom
    metric_geom.transform(transform_to_landuse)

    areas = {
        "campus": 0.0,
        "theater_square": 0.0,
        "holy_site": 0.0,
        "commercial": 0.0,
        "entertainment_complex": 0.0,
        "industrial": 0.0,
        "residential": 0.0,
        "park": 0.0,
        "railway_harbor": 0.0,
        "farm": 0.0,
        "water": 0.0,
    }
    candidate_ids = landuse_index.intersects(metric_geom.boundingBox())
    if not candidate_ids:
        return areas

    request = QgsFeatureRequest().setFilterFids(candidate_ids)
    for feature in landuse_layer.getFeatures(request):
        group = landuse_group_for(feature["LU_1"], feature["LU_2"])
        if group is None:
            continue
        feature_geom = feature.geometry()
        if not metric_geom.intersects(feature_geom):
            continue
        intersection = metric_geom.intersection(feature_geom)
        if not intersection.isEmpty():
            areas[group] += intersection.area()
    return areas


def classify_tile(metrics):
    water_count = metrics["water_count"]
    green_count = metrics["green_count"]
    station_count = metrics["station_count"]
    school_count = metrics["school_count"]
    areas = metrics["areas"]

    if water_count > 0 or areas["water"] >= 1000000:
        return "river"
    if areas["railway_harbor"] >= 300000 and station_count >= 6:
        return "railway"
    if areas["entertainment_complex"] >= 250000:
        return "entertainment_complex"
    if areas["holy_site"] >= 300000:
        return "holy_site"
    if areas["theater_square"] >= 250000:
        return "theater_square"
    if school_count >= 80:
        return "campus"
    if areas["commercial"] >= 1000000 and areas["commercial"] >= areas["industrial"] * 1.5:
        return "commercial_hub"
    if areas["industrial"] >= 600000 and areas["industrial"] >= areas["commercial"]:
        return "industrial_zone"
    if areas["farm"] >= 100000:
        return "farm"
    if green_count >= 2 or areas["park"] >= 600000:
        return "park"
    if areas["residential"] >= 500000:
        return "neighborhood"
    return "urban_plain"


def landmark_override_for(point):
    for landmark in LANDMARK_OVERRIDES:
        dx = point.x() - landmark["lon"]
        dy = point.y() - landmark["lat"]
        if (dx * dx + dy * dy) <= landmark["radius"] * landmark["radius"]:
            return landmark
    return None


def ward_code_for(point, ward_layer, ward_index):
    point_geom = QgsGeometry.fromPointXY(point)
    candidate_ids = ward_index.intersects(point_geom.boundingBox())
    if not candidate_ids:
        return None
    request = QgsFeatureRequest().setFilterFids(candidate_ids)
    for feature in ward_layer.getFeatures(request):
        if feature.geometry().contains(point_geom):
            return str(feature["N03_007"])
    return None


def dominant_ward_code_for(target_geom, ward_layer, ward_index):
    candidate_ids = ward_index.intersects(target_geom.boundingBox())
    if not candidate_ids:
        return None

    best_code = None
    best_area = 0
    request = QgsFeatureRequest().setFilterFids(candidate_ids)
    for feature in ward_layer.getFeatures(request):
        ward_geom = feature.geometry()
        if not target_geom.intersects(ward_geom):
            continue
        intersection = target_geom.intersection(ward_geom)
        if intersection.isEmpty():
            continue
        area = intersection.area()
        if area > best_area:
            best_area = area
            best_code = str(feature["N03_007"])
    return best_code


def narrative_override_for(point, ward_layer, ward_index):
    landmark = landmark_override_for(point)
    if landmark is not None:
        return landmark["type"], landmark["name"]

    ward_code = ward_code_for(point, ward_layer, ward_index)
    if ward_code in WARD_OVERRIDES:
        return WARD_OVERRIDES[ward_code]
    return None, None


def kind_for(tile_type):
    if tile_type in {
        "campus",
        "industrial_zone",
        "commercial_hub",
        "theater_square",
        "holy_site",
        "harbor",
        "neighborhood",
        "government_plaza",
        "entertainment_complex",
        "aerodrome",
        "aqueduct",
        "dam",
    }:
        return "district"
    if tile_type in {"farm", "park", "railway"}:
        return "improvement"
    return "terrain"


def symbol_for(tile_type):
    return {
        "river": "W",
        "park": "G",
        "railway": "R",
        "urban_plain": "U",
        "campus": "A",
        "industrial_zone": "I",
        "commercial_hub": "C",
        "theater_square": "T",
        "holy_site": "H",
        "government_plaza": "V",
        "harbor": "P",
        "entertainment_complex": "E",
        "aerodrome": "A",
        "aqueduct": "Q",
        "dam": "D",
        "neighborhood": "N",
        "farm": "F",
    }.get(tile_type, "U")


def rounded_area(value):
    return int(round(value))


def point_to_svg(point, min_x, min_y):
    q = (point.x() - min_x) / HEX_SPACING
    r = (point.y() - min_y) / HEX_SPACING
    return [
        round(SVG_BASE_X + SVG_HEX_RADIUS * SVG_SQRT_3 * (q + r / 2), 2),
        round(SVG_BASE_Y + SVG_HEX_RADIUS * 1.5 * r, 2),
    ]


def geometry_rings_to_svg(geometry, min_x, min_y):
    if geometry.isEmpty():
        return []

    simplified = geometry.simplify(0.0012)
    if simplified.isEmpty():
        simplified = geometry

    if simplified.isMultipart():
        polygons = simplified.asMultiPolygon()
    else:
        polygons = [simplified.asPolygon()]

    rings = []
    for polygon in polygons:
        if not polygon:
            continue
        outer_ring = polygon[0]
        if len(outer_ring) < 3:
            continue
        rings.append([point_to_svg(point, min_x, min_y) for point in outer_ring])
    return rings


def write_ward_overlay(ward_layer, min_x, min_y):
    wards = []
    for feature in ward_layer.getFeatures():
        geometry = feature.geometry()
        point = geometry.pointOnSurface().asPoint()
        code = str(feature["N03_007"])
        wards.append(
            {
                "code": code,
                "name": WARD_NAMES.get(code, code),
                "label": point_to_svg(point, min_x, min_y),
                "rings": geometry_rings_to_svg(geometry, min_x, min_y),
            }
        )

    WARD_OVERLAY_PATH.parent.mkdir(parents=True, exist_ok=True)
    WARD_OVERLAY_PATH.write_text(
        json.dumps({"wards": wards}, ensure_ascii=True, separators=(",", ":")),
        encoding="utf-8",
    )


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    ward_layer = require_layer(WARD_PATH, "Tokyo administrative boundary")
    green_layers = load_layers(find_shapefiles(DATA_DIR / "tokyo-green-parks"), "Tokyo green layer")
    water_layers = load_layers(find_shapefiles(DATA_DIR / "tokyo-water-system"), "Tokyo water layer")
    school_layer = require_layer(SCHOOL_PATH, "Tokyo schools")
    station_layer = require_layer(STATION_PATH, "Tokyo rail stations")
    landuse_layer = require_layer(LANDUSE_PATH, "Tokyo land use")

    ward_23 = processing.run(
        "native:extractbyexpression",
        {
            "INPUT": ward_layer,
            "EXPRESSION": 'to_int("N03_007") >= 13101 AND to_int("N03_007") <= 13123',
            "OUTPUT": "memory:",
        },
    )["OUTPUT"]

    ward_23_dissolved = processing.run(
        "native:dissolve",
        {
            "INPUT": ward_23,
            "FIELD": [],
            "OUTPUT": "memory:",
        },
    )["OUTPUT"]

    ward_23_by_code = processing.run(
        "native:dissolve",
        {
            "INPUT": ward_23,
            "FIELD": ["N03_007"],
            "OUTPUT": "memory:",
        },
    )["OUTPUT"]

    hex_grid = processing.run(
        "native:creategrid",
        {
            "TYPE": 4,
            "EXTENT": ward_23_dissolved.extent(),
            "HSPACING": HEX_SPACING,
            "VSPACING": HEX_SPACING,
            "HOVERLAY": 0,
            "VOVERLAY": 0,
            "CRS": ward_23_dissolved.crs(),
            "OUTPUT": "memory:",
        },
    )["OUTPUT"]

    clipped_hex = processing.run(
        "native:clip",
        {
            "INPUT": hex_grid,
            "OVERLAY": ward_23_dissolved,
            "OUTPUT": "memory:",
        },
    )["OUTPUT"]

    station_index = QgsSpatialIndex(station_layer.getFeatures())
    school_index = QgsSpatialIndex(school_layer.getFeatures())
    landuse_index = QgsSpatialIndex(landuse_layer.getFeatures())
    ward_index = QgsSpatialIndex(ward_23.getFeatures())
    transform_to_landuse = QgsCoordinateTransform(
        clipped_hex.crs(),
        landuse_layer.crs(),
        QgsProject.instance(),
    )

    provider = clipped_hex.dataProvider()
    provider.addAttributes(
        [
            QgsField("id", QVariant.String),
            QgsField("q", QVariant.Int),
            QgsField("r", QVariant.Int),
            QgsField("type", QVariant.String),
            QgsField("kind", QVariant.String),
            QgsField("symbol", QVariant.String),
            QgsField("name", QVariant.String),
            QgsField("ward_code", QVariant.String),
            QgsField("ward_name", QVariant.String),
            QgsField("areaHint", QVariant.String),
            QgsField("attributes", QVariant.String),
            QgsField("description", QVariant.String),
            QgsField("green_count", QVariant.Int),
            QgsField("water_count", QVariant.Int),
            QgsField("campus_count", QVariant.Int),
            QgsField("commercial_count", QVariant.Int),
            QgsField("industrial_count", QVariant.Int),
            QgsField("culture_count", QVariant.Int),
            QgsField("holy_count", QVariant.Int),
            QgsField("station_count", QVariant.Int),
            QgsField("farm_count", QVariant.Int),
            QgsField("commercial_area", QVariant.Int),
            QgsField("entertainment_area", QVariant.Int),
            QgsField("industrial_area", QVariant.Int),
            QgsField("residential_area", QVariant.Int),
            QgsField("farm_area", QVariant.Int),
            QgsField("park_area", QVariant.Int),
            QgsField("railway_area", QVariant.Int),
            QgsField("water_area", QVariant.Int),
        ]
    )
    clipped_hex.updateFields()

    field_index = {field.name(): clipped_hex.fields().indexOf(field.name()) for field in clipped_hex.fields()}
    features = list(clipped_hex.getFeatures())
    min_x = min(feature.geometry().centroid().asPoint().x() for feature in features)
    min_y = min(feature.geometry().centroid().asPoint().y() for feature in features)
    write_ward_overlay(ward_23_by_code, min_x, min_y)

    attribute_updates = {}
    for sequence, feature in enumerate(features, start=1):
        geom = feature.geometry()
        point = geom.centroid().asPoint()
        ward_point = geom.pointOnSurface().asPoint()
        ward_code = dominant_ward_code_for(geom, ward_23, ward_index) or ward_code_for(ward_point, ward_23, ward_index) or ""
        ward_name = ward_code
        q = int(feature["col_index"])
        r = int(feature["row_index"])
        override_type, override_name = narrative_override_for(ward_point, ward_23, ward_index)

        green_count = count_intersects(geom, green_layers)
        water_count = count_intersects(geom, water_layers)
        school_count = count_indexed_intersects(geom, school_layer, school_index)
        station_count = count_indexed_intersects(geom, station_layer, station_index)
        areas = summarize_landuse(QgsGeometry(geom), landuse_layer, landuse_index, transform_to_landuse)

        metrics = {
            "green_count": green_count,
            "water_count": water_count,
            "school_count": school_count,
            "station_count": station_count,
            "areas": areas,
        }
        tile_type = override_type or classify_tile(metrics)
        tile_kind = kind_for(tile_type)
        attributes = (
            "green={green}, water={water}, school={school}, station={station}, "
            "commercial_area={commercial}, industrial_area={industrial}, "
            "residential_area={residential}, entertainment_area={entertainment}, "
            "holy_area={holy}, theater_area={theater}, farm_area={farm}"
        ).format(
            green=green_count,
            water=water_count,
            school=school_count,
            station=station_count,
            commercial=rounded_area(areas["commercial"]),
            industrial=rounded_area(areas["industrial"]),
            residential=rounded_area(areas["residential"]),
            entertainment=rounded_area(areas["entertainment_complex"]),
            holy=rounded_area(areas["holy_site"]),
            theater=rounded_area(areas["theater_square"]),
            farm=rounded_area(areas["farm"]),
        )

        attribute_updates[feature.id()] = {
            field_index["id"]: sequence,
            field_index["q"]: q,
            field_index["r"]: r,
            field_index["type"]: tile_type,
            field_index["kind"]: tile_kind,
            field_index["symbol"]: symbol_for(tile_type),
            field_index["name"]: override_name or "Tokyo Hex {}".format(sequence),
            field_index["ward_code"]: ward_code,
            field_index["ward_name"]: ward_name,
            field_index["areaHint"]: "Tokyo 23 wards",
            field_index["attributes"]: attributes,
            field_index["description"]: "Hex tile generated from Tokyo 23 wards and classified by aggregated public GIS metrics.",
            field_index["green_count"]: green_count,
            field_index["water_count"]: water_count,
            field_index["campus_count"]: school_count,
            field_index["commercial_count"]: 1 if areas["commercial"] > 0 else 0,
            field_index["industrial_count"]: 1 if areas["industrial"] > 0 else 0,
            field_index["culture_count"]: 1 if areas["theater_square"] > 0 else 0,
            field_index["holy_count"]: 1 if areas["holy_site"] > 0 else 0,
            field_index["station_count"]: station_count,
            field_index["farm_count"]: 1 if areas["farm"] > 0 else 0,
            field_index["commercial_area"]: rounded_area(areas["commercial"]),
            field_index["entertainment_area"]: rounded_area(areas["entertainment_complex"]),
            field_index["industrial_area"]: rounded_area(areas["industrial"]),
            field_index["residential_area"]: rounded_area(areas["residential"]),
            field_index["farm_area"]: rounded_area(areas["farm"]),
            field_index["park_area"]: rounded_area(areas["park"]),
            field_index["railway_area"]: rounded_area(areas["railway_harbor"]),
            field_index["water_area"]: rounded_area(areas["water"]),
        }

    provider.changeAttributeValues(attribute_updates)
    clipped_hex.updateFields()

    QgsProject.instance().addMapLayer(clipped_hex)
    QgsVectorFileWriter.writeAsVectorFormat(clipped_hex, str(OUTPUT_PATH), "UTF-8", clipped_hex.crs(), "GeoJSON")
    print("Exported {}".format(OUTPUT_PATH))


if __name__ == "__main__":
    main()

    if qgs_app is not None:
        qgs_app.exitQgis()
