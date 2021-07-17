import 'package:meta/meta.dart';

import 'enum.dart';

@immutable
class CafeListResponse {
  final CafeListModel cafe;

  CafeListResponse({required this.cafe});

  factory CafeListResponse.fromJson(Map<String, dynamic> json) {
    return CafeListResponse(cafe: CafeListModel.fromJson(json['cafe']));
  }
}

@immutable
class CafeListModel {
  final List<CafeModel> list;

  CafeListModel({required this.list});

  factory CafeListModel.fromJson(Map<String, dynamic> json) {
    final listFromJson = json['list'] as List;
    final List<CafeModel> list = List.unmodifiable(
        listFromJson.map((cafe) => CafeModel.fromJson(cafe)).toList());
    return CafeListModel(list: list);
  }
}

@immutable
class CafeModel {
  final String id;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String name;
  final PlaceModel place;
  final CafeMetadata metadata;
  final CafeImageList image;
  final CafeState state;

  CafeModel(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.name,
      required this.place,
      required this.metadata,
      required this.image,
      required this.state});

  factory CafeModel.fromJson(Map<String, dynamic> json) {
    return CafeModel(
        id: json['id'],
        createdAt: DateTime.parse(json['createdAt']),
        updatedAt: DateTime.parse(json['updatedAt']),
        name: json['name'],
        place: PlaceModel.fromJson(json['place']),
        metadata: CafeMetadata.fromJson(json['metadata']),
        image: CafeImageList.fromJson(json['image']),
        state: getCafeState.parse(json['state']));
  }
}

@immutable
class CafeImageList {
  final int count;
  final List<CafeImage> list;

  CafeImageList({required this.count, required this.list});

  factory CafeImageList.fromJson(Map<String, dynamic> json) {
    final listFromJson = json['list'] as List;
    final List<CafeImage> list = List.unmodifiable(
        listFromJson.map((image) => CafeImage.fromJson(image)).toList());
    return CafeImageList(count: json['count'], list: list);
  }
}

@immutable
class CafeImage {
  final String id;
  final String createdAt;
  final String updatedAt;
  final String cafeId;
  final int index;
  final bool isMain;
  final CafeImageMetadata metadata;
  final String relativeUri;
  final CafeImageState state;

  CafeImage(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.cafeId,
      required this.index,
      required this.isMain,
      required this.metadata,
      required this.relativeUri,
      required this.state});

  factory CafeImage.fromJson(Map<String, dynamic> json) {
    return CafeImage(
        id: json['id'],
        createdAt: json['createdAt'],
        updatedAt: json['updatedAt'],
        cafeId: json['cafeId'],
        index: json['index'],
        isMain: json['isMain'],
        metadata: CafeImageMetadata.fromJson(json['metadata']),
        relativeUri: json['relativeUri'],
        state: getCafeImageState.parse(json['state']));
  }
}

@immutable
class CafeImageMetadata {
  final String tag;

  CafeImageMetadata({required this.tag});

  factory CafeImageMetadata.fromJson(Map<String, dynamic> json) {
    return CafeImageMetadata(
      tag: json['tag'],
    );
  }
}

@immutable
class CafeMetadata {
  final String? creator;
  final String hour;
  final List<String> tag;

  CafeMetadata({required this.creator, required this.hour, required this.tag});

  factory CafeMetadata.fromJson(Map<String, dynamic> json) {
    final listFromJson = json['tag'];
    final List<String> list =
        List.unmodifiable(new List<String>.from(listFromJson));
    return CafeMetadata(
        creator: json['creator'], hour: json['hour'], tag: list);
  }
}

@immutable
class PlaceListResponse {
  final PlaceListModel place;

  PlaceListResponse({required this.place});

  factory PlaceListResponse.fromJson(Map<String, dynamic> json) {
    return PlaceListResponse(place: PlaceListModel.fromJson(json['place']));
  }
}

@immutable
class PlaceListModel {
  final int count;
  final List<PlaceModel> list;

  PlaceListModel({required this.count, required this.list});

  factory PlaceListModel.fromJson(Map<String, dynamic> json) {
    final listFromJson = json['list'] as List;
    final List<PlaceModel> list = List.unmodifiable(
        listFromJson.map((place) => PlaceModel.fromJson(place)).toList());

    return PlaceListModel(
      count: json['count'],
      list: list,
    );
  }
}

@immutable
class PlaceModel {
  final String id;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String name;
  final bool pinned;
  final int? cafeCount;

  PlaceModel(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.name,
      required this.pinned,
      this.cafeCount});

  factory PlaceModel.fromJson(Map<String, dynamic> json) {
    return PlaceModel(
      id: json['id'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      name: json['name'],
      pinned: json['pinned'],
      cafeCount: json['cafeCount'],
    );
  }
}
