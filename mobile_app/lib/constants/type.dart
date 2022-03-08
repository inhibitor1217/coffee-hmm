import 'package:flutter/material.dart';
import 'package:meta/meta.dart';
import 'package:mobile_app/util/type_transformer.dart';
import 'package:mobile_app/util/time_formatter.dart';

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
  final String? tag;

  CafeImageMetadataModel({this.tag});

  factory CafeImageMetadataModel.fromJson(Map<String, dynamic>? json) {
    return CafeImageMetadataModel(
      tag: json?['tag'],
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

  CafeMetadataModel(
      {this.creator,
      this.hour,
      this.tags,
      this.call,
      this.hours,
      this.location,
      this.menus,
      });

  List<CafeMetaMenuModel>? get mainMenus => menus?.where((menu) => menu.isMain ?? false ).toList();

  factory CafeMetadataModel.fromJson(Map<String, dynamic>? json) {
    final tagsFromJson = json?['tag'] ?? [];
    final List<String> tags =
        List.unmodifiable(new List<String>.from(tagsFromJson));
    final menusFromJson =  json?['menus'] ?? [];
    final List<CafeMetaMenuModel> menus = List.unmodifiable(
        menusFromJson.map((menu) => CafeMetaMenuModel.fromJson(menu)).toList());

    return CafeMetadataModel(
        creator: json?['creator'],
        hour: json?['hour'],
        tags: tags,
        call: json?['call'],
        hours: CafeMetaHoursModel.fromJson(json?['hours']),
        location: CafeMetaLocationModel.fromJson(json?['location']),
        menus: menus,
    );
  }
}

@immutable
class CafeMetaMenuModel {
  final CafeMenuCategory? category;
  final String? name;
  final String? engName;
  final int? price;
  final CafeMetaPriceOptionModel? priceOption;
  final bool? isMain;

  CafeMetaMenuModel({ this.category, this.name, this.engName, this.price, this.priceOption, this.isMain });

  factory CafeMetaMenuModel.fromJson(Map<String, dynamic>? json){
    const cafeMenuEnums = CafeMenuCategory.values;
    final String jsonCategory = json?['category'];
    final category = jsonCategory.stringToEnum<CafeMenuCategory>(cafeMenuEnums, CafeMenuCategory.coffee);

    return CafeMetaMenuModel(
      category: category,
      name: json?['name'],
      engName: json?['engName'],
      price: json?['price'],
      priceOption: CafeMetaPriceOptionModel.fromJson(json?['priceOption']),
      isMain: json?['isMain'] ?? false
    );
  }
}

@immutable
class CafeMetaPriceOptionModel {
  final int? iced;
  final int? shot;
  final int? spread;
  final int? topping;
  final int? decaffeinated;

  CafeMetaPriceOptionModel({ this.iced, this.shot, this.spread, this.topping, this.decaffeinated });

  factory CafeMetaPriceOptionModel.fromJson(Map<String, dynamic>? json){
    return CafeMetaPriceOptionModel(
      iced: json?['iced'],
      shot: json?['shot'],
      spread: json?['spread'],
      topping: json?['topping'],
      decaffeinated: json?['decaffeinated']
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
class CafeMetaOperationHoursModel {
  final DateTime open;
  final DateTime close;

  CafeMetaOperationHoursModel({required this.open, required this.close});
}

@immutable
class CafeMetaHoursModel {
  final CafeMetaOperationHoursModel? weekday;
  final CafeMetaOperationHoursModel? weekend;
  final String? weekdayStr;
  final String? weekendStr;

  CafeMetaHoursModel({this.weekday, this.weekend, this.weekdayStr, this.weekendStr});

  factory CafeMetaHoursModel.fromJson(Map<String, dynamic>? json) {
    final String? jsonWeekday = json?['weekday'];
    final String? jsonWeekend = json?['weekend'];

    return CafeMetaHoursModel(
      weekday: jsonWeekday?.createOperationHours(),
      weekend: jsonWeekend?.createOperationHours(),
      weekdayStr: jsonWeekday,
      weekendStr: jsonWeekend,
    );
  }
}

@immutable
class CafeImageSetModel {
  final CafeModel cafe;
  final CafeImageModel image;

  CafeImageSetModel({required this.cafe, required this.image});
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
