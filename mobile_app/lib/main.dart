import 'dart:async';

import 'package:flutter/material.dart';
import 'package:mobile_app/api.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/place_list.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

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
          body: Main(),
        ),
        debugShowCheckedModeBanner: false);
  }
}

class Main extends StatefulWidget {
  @override
  _MainState createState() => _MainState();
}

class _MainState extends State<Main> {
  Future<CafeListResponse>? _cafes;
  Future<PlaceListResponse>? _place;
  CafeModel? _selectedCafe;
  PlaceModel? _selectedPlace;

  @override
  void initState() {
    super.initState();
    _place = fetchPlaceList();
    _place!.then((data) {
      PlaceModel initialPlace = data.place.list[0];
      setState(() {
        _selectedPlace = initialPlace;
      });

      _cafes = fetchCafeListByPlace(initialPlace.name);
      _cafes!.then((data) {
        setState(() {
          _selectedCafe = data.cafe.list[0];
        });
      });
    });
  }

  void handlePlaceClick(PlaceModel place) {
    setState(() {
      _selectedPlace = place;
      _cafes = fetchCafeListByPlace(place.name);
      _cafes!.then((data) {
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
                        future: _cafes,
                        builder: (context, snapshot) {
                          if (snapshot.hasData && _selectedPlace != null) {
                            return Cafe(cafe: snapshot.data!.cafe.list.first);
                          } else if (snapshot.hasError) {
                            return Text("${snapshot.error}");
                          }
                          return Skeleton();
                        })),
                Container(
                    child: FutureBuilder<PlaceListResponse>(
                        future: _place,
                        builder: (context, snapshot) {
                          if (snapshot.hasData && _selectedCafe != null) {
                            return PlaceList(
                              placeList: snapshot.data!.place.list,
                              selectedPlace: _selectedPlace,
                              handlePlaceClick: handlePlaceClick,
                            );
                          } else if (snapshot.hasError) {
                            return Text("${snapshot.error}");
                          }
                          return Skeleton();
                        }))
              ],
            ))
          ],
        );
      },
    );
  }
}
