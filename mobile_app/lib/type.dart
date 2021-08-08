import 'package:flutter/material.dart';
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
  final CafeMetadataModel metadata;
  final CafeImageListModel image;
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
        metadata: CafeMetadataModel.fromJson(json['metadata']),
        image: CafeImageListModel.fromJson(json['image']),
        state: GetCafeState.parse(json['state']));
  }
}

@immutable
class CafeImageListModel {
  final int count;
  final List<CafeImageModel> list;
  final CafeImageModel mainImage; // 대표 이미지
  final List<CafeImageModel> basicImages; // 대표 이미지 제외 기본 이미지

  CafeImageListModel(
      {required this.count,
      required this.list,
      required this.mainImage,
      required this.basicImages});

  factory CafeImageListModel.fromJson(Map<String, dynamic> json) {
    final listFromJson = json['list'] as List;
    final List<CafeImageModel> list = List.unmodifiable(
        listFromJson.map((image) => CafeImageModel.fromJson(image)).toList());
    final mainImage = list.firstWhere((image) => image.isMain);
    final List<CafeImageModel> basicImages = List.from(list)
      ..removeWhere((image) => image.id == mainImage.id);
    return CafeImageListModel(
        count: json['count'],
        list: list,
        mainImage: mainImage,
        basicImages: basicImages);
  }
}

@immutable
class CafeImageModel {
  final String id;
  final String createdAt;
  final String updatedAt;
  final String cafeId;
  final int index;
  final bool isMain;
  final CafeImageMetadataModel metadata;
  final String relativeUri;
  final CafeImageState state;

  CafeImageModel(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.cafeId,
      required this.index,
      required this.isMain,
      required this.metadata,
      required this.relativeUri,
      required this.state});

  factory CafeImageModel.fromJson(Map<String, dynamic> json) {
    return CafeImageModel(
        id: json['id'],
        createdAt: json['createdAt'],
        updatedAt: json['updatedAt'],
        cafeId: json['cafeId'],
        index: json['index'],
        isMain: json['isMain'],
        metadata: CafeImageMetadataModel.fromJson(json['metadata']),
        relativeUri: json['relativeUri'],
        state: GetCafeImageState.parse(json['state']));
  }
}

@immutable
class CafeImageMetadataModel {
  final String tag;

  CafeImageMetadataModel({required this.tag});

  factory CafeImageMetadataModel.fromJson(Map<String, dynamic> json) {
    return CafeImageMetadataModel(
      tag: json['tag'],
    );
  }
}

@immutable
class CafeMetadataModel {
  final String? creator;
  final String hour;
  final List<String> tag;

  CafeMetadataModel(
      {required this.creator, required this.hour, required this.tag});

  factory CafeMetadataModel.fromJson(Map<String, dynamic> json) {
    final listFromJson = json['tag'];
    final List<String> list =
        List.unmodifiable(new List<String>.from(listFromJson));
    return CafeMetadataModel(
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