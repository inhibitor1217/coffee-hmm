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

Future<CafeResponse> fetchCafeById(String id) async {
  final response = await http
      .get(Uri.parse('https://release.api.coffee-hmm.inhibitor.io/cafe/$id'));

  if (response.statusCode == 200) {
    final jsonResponse = json.decode(response.body);

    return CafeResponse.fromJson(jsonResponse);
  } else {
    throw Exception('Failed to load cafe');
  }
}
