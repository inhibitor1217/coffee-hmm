import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

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
  final num cafeCount;

  PlaceType(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.name,
      required this.pinned,
      required this.cafeCount});

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

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        theme: ThemeData(
          primaryColor: Colors.white,
        ),
        home: Scaffold(
          appBar: AppBar(
            title: Center(
              child: Text('coffeehmm',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.black,
                  )),
            ),
          ),
          body: PlaceList(),
        ));
  }
}

class PlaceList extends StatefulWidget {
  @override
  _PlaceListState createState() => _PlaceListState();
}

class _PlaceListState extends State<PlaceList> {
  Future<PlaceListResponse>? place;
  PlaceType? _selectedPlace;

  @override
  void initState() {
    super.initState();
    place = fetchPlaceList();
    place!.then((data) {
      setState(() {
        _selectedPlace = data.place.list[0];
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
            child: FutureBuilder<PlaceListResponse>(
                future: place,
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    return _buildPlaceList(snapshot.data?.place.list);
                  } else if (snapshot.hasError) {
                    return Text("${snapshot.error}");
                  }
                  return CircularProgressIndicator();
                })));
  }

  Widget _buildPlaceList(List<PlaceType>? list) {
    if (list == null) return ListTile(title: Text('검색결과가 없습니다.'));

    return ListView.builder(
        padding: const EdgeInsets.all(16.0),
        itemCount: list.length,
        itemBuilder: (context, i) {
          return _buildPlace(list[i]);
        });
  }

  Widget _buildPlace(PlaceType place) {
    final isSelected = _selectedPlace == place;

    return ListTile(
      title: Text(place.name),
      trailing: Icon(
        isSelected ? Icons.favorite : Icons.favorite_border,
        color: isSelected ? Colors.red : null,
      ),
      onTap: () {
        setState(() {
          _selectedPlace = place;
        });
      },
    );
  }
}
