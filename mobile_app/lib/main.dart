import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
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

Future<CafeListResponse> fetchCafeListByPlace(String placeName) async {
  final response = await http.get(Uri.parse(
      'https://release.api.coffee-hmm.inhibitor.io/cafe/feed?limit=64&placeName=${placeName}'));

  if (response.statusCode == 200) {
    final jsonResponse = json.decode(response.body);

    return CafeListResponse.fromJson(jsonResponse);
  } else {
    throw Exception('Failed to load cafe list');
  }
}

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final PageController controller = PageController(initialPage: 0);
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
          body: Center(child: Main()),
        ));
  }
}

class Main extends StatefulWidget {
  @override
  _MainState createState() => _MainState();
}

class _MainState extends State<Main> {
  Future<CafeListResponse>? cafes;
  Future<PlaceListResponse>? place;
  CafeType? _selectedCafe;
  PlaceType? _selectedPlace;

  @override
  void initState() {
    super.initState();
    place = fetchPlaceList();
    place!.then((data) {
      PlaceType initialPlace = data.place.list[0];
      setState(() {
        _selectedPlace = initialPlace;
      });

      cafes = fetchCafeListByPlace(initialPlace.name);
      cafes!.then((data) {
        setState(() {
          _selectedCafe = data.cafe.list[0];
        });
      });
    });
  }

  void handlePlaceClick(PlaceType place) {
    setState(() {
      _selectedPlace = place;
      cafes = fetchCafeListByPlace(place.name);
      cafes!.then((data) {
        setState(() {
          _selectedCafe = data.cafe.list[0];
        });
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 1,
      itemBuilder: (context, index) {
        return Row(
          children: [
            Expanded(
                child: Column(
              children: [
                Container(
                    child: FutureBuilder<CafeListResponse>(
                        future: cafes,
                        builder: (context, snapshot) {
                          if (snapshot.hasData && _selectedPlace != null) {
                            return _buildCafe();
                          } else if (snapshot.hasError) {
                            return Text("${snapshot.error}");
                          }
                          return _buildSkeleton();
                        })),
                Container(
                    child: FutureBuilder<PlaceListResponse>(
                        future: place,
                        builder: (context, snapshot) {
                          if (snapshot.hasData && _selectedCafe != null) {
                            return _buildPlaceList(snapshot.data?.place.list);
                          } else if (snapshot.hasError) {
                            return Text("${snapshot.error}");
                          }
                          return _buildSkeleton();
                        }))
              ],
            ))
          ],
        );
      },
    );
  }

  Widget _buildSkeleton() {
    return Container(
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12.0), color: Colors.white60),
    );
  }

  Widget _buildPlaceList(List<PlaceType>? list) {
    if (list == null) return ListTile(title: Text('검색결과가 없습니다.'));

    List<Container> _buildGridTileList(int count) => List.generate(
        count, (index) => Container(child: _buildPlace(list[index])));

    return GridView.count(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        crossAxisCount: 5,
        childAspectRatio: 2.5,
        padding: EdgeInsets.only(top: 20),
        children: _buildGridTileList(list.length));
  }

  Widget _buildPlace(PlaceType place) {
    final isSelected = _selectedPlace == place;

    return GestureDetector(
      child: Text(
        place.name,
        style: TextStyle(
          fontSize: 14,
          color: Colors.black,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        textAlign: TextAlign.center,
      ),
      onTap: () {
        handlePlaceClick(place);
      },
    );
  }

  Widget _buildCafe() {
    return Column(
      children: <Widget>[
        Container(child: _buildCafeInfo()),
        Container(
          child: _buildCafeImage(),
        )
      ],
    );
  }

  Widget _buildCafeInfo() {
    return Container(
        width: double.infinity,
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _selectedCafe!.name,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Row(
              children: [
                Text(_selectedCafe!.place.name),
                Text(' OPEN '),
                Text(_selectedCafe!.metadata.hour,
                    style: TextStyle(fontSize: 14)),
              ],
            ),
            Container(
              alignment: Alignment.centerRight,
              child: Text(
                "${_selectedCafe!.metadata.creator ??= 'jyuunnii'} 님이 올려주신 ${_selectedCafe!.name}",
                style: TextStyle(
                  fontSize: 12,
                ),
              ),
            )
          ],
        ));
  }

  Widget _buildCafeImage() {
    double viewportWidth = MediaQuery.of(context).size.width;
    ImageType? mainImage =
        _selectedCafe!.image.list.firstWhere((image) => image.isMain);
    return Container(
        width: viewportWidth,
        height: viewportWidth,
        child: Image.network(
          mainImage.relativeUri,
          fit: BoxFit.cover,
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return Center(child: CircularProgressIndicator());
          },
          errorBuilder: (context, error, stackTrace) {
            return Center(child: Text('no image'));
          },
        ));
  }
}
