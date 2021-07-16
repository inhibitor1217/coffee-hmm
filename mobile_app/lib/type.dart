class CafeListResponse {
  final CafeListType cafe;

  CafeListResponse({required this.cafe});

  factory CafeListResponse.fromJson(Map<String, dynamic> json) {
    return CafeListResponse(cafe: CafeListType.fromJson(json['cafe']));
  }
}

class CafeListType {
  final List<CafeType> list;

  CafeListType({required this.list});

  factory CafeListType.fromJson(Map<String, dynamic> json) {
    var listFromJson = json['list'] as List;
    List<CafeType> list =
        listFromJson.map((cafe) => CafeType.fromJson(cafe)).toList();
    return CafeListType(list: list);
  }
}

class CafeType {
  final String id;
  final String createdAt;
  final String updatedAt;
  final String name;
  final PlaceType place;
  final MetadataType metadata;
  final ImageListType image;
  final String state;

  CafeType(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.name,
      required this.place,
      required this.metadata,
      required this.image,
      required this.state});

  factory CafeType.fromJson(Map<String, dynamic> json) {
    return CafeType(
        id: json['id'],
        createdAt: json['createdAt'],
        updatedAt: json['updatedAt'],
        name: json['name'],
        place: PlaceType.fromJson(json['place']),
        metadata: MetadataType.fromJson(json['metadata']),
        image: ImageListType.fromJson(json['image']),
        state: json['state']);
  }
}

class ImageListType {
  final num count;
  final List<ImageType> list;

  ImageListType({required this.count, required this.list});

  factory ImageListType.fromJson(Map<String, dynamic> json) {
    var listFromJson = json['list'] as List;
    List<ImageType> list =
        listFromJson.map((image) => ImageType.fromJson(image)).toList();
    return ImageListType(count: json['count'], list: list);
  }
}

class ImageType {
  final String id;
  final String createdAt;
  final String updatedAt;
  final String cafeId;
  final num index;
  final bool isMain;
  final ImageMetadataType metadata;
  final String relativeUri;
  final String state;

  ImageType(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.cafeId,
      required this.index,
      required this.isMain,
      required this.metadata,
      required this.relativeUri,
      required this.state});

  factory ImageType.fromJson(Map<String, dynamic> json) {
    return ImageType(
        id: json['id'],
        createdAt: json['createdAt'],
        updatedAt: json['updatedAt'],
        cafeId: json['cafeId'],
        index: json['index'],
        isMain: json['isMain'],
        metadata: ImageMetadataType.fromJson(json['metadata']),
        relativeUri: json['relativeUri'],
        state: json['state']);
  }
}

class ImageMetadataType {
  final String tag;

  ImageMetadataType({required this.tag});

  factory ImageMetadataType.fromJson(Map<String, dynamic> json) {
    return ImageMetadataType(
      tag: json['tag'],
    );
  }
}

class MetadataType {
  String? creator;
  final String hour;
  final List<String> tag;

  MetadataType({required this.creator, required this.hour, required this.tag});

  factory MetadataType.fromJson(Map<String, dynamic> json) {
    var listFromJson = json['tag'];
    List<String> list = new List<String>.from(listFromJson);
    return MetadataType(
        creator: json['creator'], hour: json['hour'], tag: list);
  }
}

class PlaceListResponse {
  final PlaceListType place;

  PlaceListResponse({required this.place});

  factory PlaceListResponse.fromJson(Map<String, dynamic> json) {
    return PlaceListResponse(place: PlaceListType.fromJson(json['place']));
  }
}

class PlaceListType {
  final num count;
  final List<PlaceType> list;

  PlaceListType({required this.count, required this.list});

  factory PlaceListType.fromJson(Map<String, dynamic> json) {
    var listFromJson = json['list'] as List;
    List<PlaceType> list =
        listFromJson.map((place) => PlaceType.fromJson(place)).toList();

    return PlaceListType(
      count: json['count'],
      list: list,
    );
  }
}

class PlaceType {
  final String id;
  final String createdAt;
  final String updatedAt;
  final String name;
  final bool pinned;
  final num? cafeCount;

  PlaceType(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.name,
      required this.pinned,
      this.cafeCount});

  factory PlaceType.fromJson(Map<String, dynamic> json) {
    return PlaceType(
      id: json['id'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
      name: json['name'],
      pinned: json['pinned'],
      cafeCount: json['cafeCount'],
    );
  }
}
