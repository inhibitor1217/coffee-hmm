import 'dart:convert';

abstract class SavedCafeModel {
  String version;

  SavedCafeModel({required this.version});

  List<String> get cafeIds;

  dynamic toJsonObject();
}

class SavedCafeModelV1 implements SavedCafeModel {
  final List<String> cafeIds;
  String version = '1';

  SavedCafeModelV1({required this.cafeIds});

  factory SavedCafeModelV1.fromJson(Map<String, dynamic> json){
    final listFromJson = json['cafes'] as List;
    final List<String> list = List.unmodifiable(List<String>.from(listFromJson));

    return SavedCafeModelV1(cafeIds: list);
  }

  Map<String, dynamic> toJsonObject() {
    return {
      'version': version,
      'cafes': cafeIds,
    };
  }
}

class SavedCafeModelV2 implements SavedCafeModel {
  final List<SavedCafeItemModelV2> cafes;
  String version = '2';

  SavedCafeModelV2({required this.cafes});

  List<String> get cafeIds => List.unmodifiable(this.cafes.map((cafe) => cafe.id));

  factory SavedCafeModelV2.fromJson(Map<String, dynamic> json){
    final listFromJson = json['cafes'] as List;
    final List<SavedCafeItemModelV2> list = List.unmodifiable(listFromJson.map((item) => SavedCafeItemModelV2.fromJson(jsonDecode(item))).toList());

    return SavedCafeModelV2(cafes: list);
  }

  Map<String, dynamic> toJsonObject() {
    return {
      'version': version,
      'cafes': List.unmodifiable(cafes.map((cafe) => jsonEncode(cafe.toJsonObject())))
    };
  }
}

class SavedCafeItemModelV2 {
  final String id;
  final String timestamp;

  SavedCafeItemModelV2({required this.id, required this.timestamp});

  factory SavedCafeItemModelV2.fromJson(Map<String, dynamic> json){
    return SavedCafeItemModelV2(
      id: json['id'],
      timestamp: json['timestamp']
    );
  }

  Map<String, dynamic> toJsonObject(){
    return {
      'id': id,
      'timestamp': timestamp
    };
  }
}