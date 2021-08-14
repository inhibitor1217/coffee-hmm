import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:mobile_app/type.dart';

Future<PlaceListResponse> fetchPlaceList() async {
  final response = await http
      .get(Uri.parse('https://release.api.coffee-hmm.inhibitor.io/place/list'));

  if (response.statusCode == 200) {
    final jsonResponse = json.decode(response.body);

    return PlaceListResponse.fromJson(jsonResponse);
  } else {
    throw Exception('Failed to load place list');
  }
}

Future<CafeListResponse> fetchCafeListByPlace(PlaceModel place) async {
  final placeName = place.name;
  final response = await http.get(Uri.parse(
      'https://release.api.coffee-hmm.inhibitor.io/cafe/feed?limit=64&placeName=$placeName'));

  if (response.statusCode == 200) {
    final jsonResponse = json.decode(response.body);

    return CafeListResponse.fromJson(jsonResponse);
  } else {
    throw Exception('Failed to load cafe list');
  }
}

Future<SingleCafeResponse> fetchCafe(String cafeId) async {
  final response = await http.get(
      Uri.parse('https://release.api.coffee-hmm.inhibitor.io/cafe/$cafeId'));

  if (response.statusCode == 200) {
    final jsonResponse = json.decode(response.body);

    return SingleCafeResponse.fromJson(jsonResponse);
  } else {
    throw Exception('Failed to load cafe');
  }
}

Future<CafeListResponse> fetchHotCafeList(int limit) async {
  // FIXME: release api 로 교체
  final response = await http.get(Uri.parse(
      'https://beta.api.coffee-hmm.inhibitor.io/cafe/feed?place=mixed&limit=$limit'));

  if (response.statusCode == 200) {
    final jsonResponse = json.decode(response.body);

    return CafeListResponse.fromJson(jsonResponse);
  } else {
    throw Exception('Failed to load cafe list');
  }
}
