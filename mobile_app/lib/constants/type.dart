import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:mobile_app/util/type_trasnformer.dart';

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
class SingleCafeResponse {
  final CafeModel cafe;

  SingleCafeResponse({required this.cafe});

  factory SingleCafeResponse.fromJson(Map<String, dynamic> json) {
    return SingleCafeResponse(cafe: CafeModel.fromJson(json['cafe']));
  }
}

@immutable
class CafeModel {
  final String id;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String name;
  final PlaceModel place;
  final CafeImageListModel image;
  final CafeState state;
  final CafeMetadataModel? metadata;

  CafeModel({
    required this.id,
    required this.createdAt,
    required this.updatedAt,
    required this.name,
    required this.place,
    required this.image,
    required this.state,
    this.metadata,
  });

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
  final String relativeUri;
  final CafeImageState state;
  final CafeImageMetadataModel? metadata;

  CafeImageModel(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.cafeId,
      required this.index,
      required this.isMain,
      required this.relativeUri,
      required this.state,
      this.metadata});

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
  final String? hour;
  final List<String>? tags;
  final String? call;
  final CafeMetaHoursModel? hours;
  final CafeMetaLocationModel? location;
  final List<CafeMetaMenuModel>? menus;
  final List<CafeMetaMenuModel>? mainMenus;

  CafeMetadataModel(
      {this.creator,
      this.hour,
      this.tags,
      this.call,
      this.hours,
      this.location,
      this.menus,
      this.mainMenus});

  factory CafeMetadataModel.fromJson(Map<String, dynamic>? json) {
    final tagsFromJson = json?['tag'] ?? [];
    final List<String> tags =
        List.unmodifiable(new List<String>.from(tagsFromJson));
    final menusFromJson =  json?['menu'] ?? [];
    final List<CafeMetaMenuModel> menus = List.unmodifiable(
        menusFromJson.map((menu) => CafeMetaMenuModel.fromJson(menu)).toList());
    final List<CafeMetaMenuModel> mainMenus = menus.where((menu) => menu.isMain ?? false ).toList();

    return CafeMetadataModel(
        creator: json?['creator'],
        hour: json?['hour'],
        tags: tags,
        call: json?['call'],
        hours: CafeMetaHoursModel.fromJson(json?['hours']),
        location: CafeMetaLocationModel.fromJson(json?['location']),
        menus: menus,
        mainMenus: mainMenus);
  }
}

@immutable
class CafeMetaMenuModel {
  final CafeMenuCategory? category;
  final String? name;
  final int? price;
  final CafeMetaPriceOptionModel? priceOption;
  final bool? isMain;
  final bool? decaffeinated;
  final bool? seasonal;

  CafeMetaMenuModel({ this.category, this.name, this.price, this.priceOption, this.isMain, this.decaffeinated, this.seasonal});

  factory CafeMetaMenuModel.fromJson(Map<String, dynamic>? json){
    final category = CafeMenuCategory.values.stringToEnum(json?['category'], CafeMenuCategory.coffee);

    return CafeMetaMenuModel(
      category: category,
      name: json?['name'],
      price: json?['price'],
      priceOption: CafeMetaPriceOptionModel.fromJson(json?['priceOption']),
      isMain: json?['isMain'] ?? false,
      decaffeinated: json?['decaffeinated'],
      seasonal: json?['seasonal']
    );
  }
}

@immutable
class CafeMetaPriceOptionModel {
  final int? iced;

  CafeMetaPriceOptionModel({ this.iced });

  factory CafeMetaPriceOptionModel.fromJson(Map<String, dynamic>? json){
    return CafeMetaPriceOptionModel(
      iced: json?['iced'],
    );
  }
}

@immutable
class CafeMetaLocationModel {
  final String? address;
  final CafeMetaSubwayModel? subway;
  final String? lat;
  final String? lng;

  CafeMetaLocationModel({this.address, this.subway, this.lat, this.lng});

  factory CafeMetaLocationModel.fromJson(Map<String, dynamic>? json) {
    return CafeMetaLocationModel(
        address: json?['address'],
        lat: json?['lat'],
        lng: json?['lng'],
        subway: CafeMetaSubwayModel.fromJson(json?['subway']));
  }
}

@immutable
class CafeMetaSubwayModel {
  final String? station;
  final List<String>? line;
  final String? exit;
  final String? distance;

  CafeMetaSubwayModel({this.station, this.line, this.exit, this.distance});

  factory CafeMetaSubwayModel.fromJson(Map<String, dynamic>? json) {
    final listFromJson = json?['line'];
    List<String> list = [];
    if (listFromJson != null) {
      list = List.unmodifiable(new List<String>.from(listFromJson));
    }

    return CafeMetaSubwayModel(
        station: json?['station'],
        exit: json?['exit'],
        distance: json?['distance'],
        line: list);
  }
}

@immutable
class CafeMetaHoursModel {
  final String? weekday;
  final String? weekend;

  CafeMetaHoursModel({this.weekday, this.weekend});

  factory CafeMetaHoursModel.fromJson(Map<String, dynamic>? json) {
    return CafeMetaHoursModel(
        weekday: json?['weekday'], weekend: json?['weekend']);
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

@immutable
class CafeDetailInfoModel {
  final String hour;
  final String address;
  final List<String> line;
  final String station;
  final String call;

  CafeDetailInfoModel({
    required this.hour,
    required this.address,
    required this.line,
    required this.station,
    required this.call,
  });

  factory CafeDetailInfoModel.fromJson(Map<String, dynamic> json) {
    final listFromJson = json['line'] as List;
    final List<String> line = List.unmodifiable(listFromJson
        .map((element) => CafeDetailInfoModel.fromJson(element))
        .toList());
    return CafeDetailInfoModel(
        hour: json['hour'],
        address: json['address'],
        line: line,
        station: json['station'],
        call: json['call']);
  }
}
