import 'dart:async';

import 'package:flutter/material.dart';
import 'package:mobile_app/api.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/place_list.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

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
            toolbarHeight: 48,
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
  Future<CafeListResponse>? _cafeListResponse;
  Future<PlaceListResponse>? _placeResponse;
  List<CafeModel>? _cafes;
  CafeModel? _selectedCafe;
  PlaceModel? _selectedPlace;

  @override
  void initState() {
    super.initState();
    _placeResponse = fetchPlaceList();
    _placeResponse!.then((data) {
      PlaceModel initialPlace = data.place.list[0];
      setState(() {
        _selectedPlace = initialPlace;
      });

      _cafeListResponse = fetchCafeListByPlace(initialPlace);
      _cafeListResponse!.then((data) {
        setState(() {
          _cafes = data.cafe.list;
          _selectedCafe = data.cafe.list[0];
        });
      });
    });
  }

  void handlePlaceClick(PlaceModel place) {
    setState(() {
      _selectedPlace = place;
      _cafeListResponse = fetchCafeListByPlace(place);
      _cafeListResponse!.then((data) {
        setState(() {
          _cafes = data.cafe.list;
          _selectedCafe = data.cafe.list[0];
        });
      });
    });
  }

  void handleCafeSlide(int index) {
    setState(() {
      _selectedCafe = _cafes![index];
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
                        future: _cafeListResponse,
                        builder: (context, snapshot) {
                          if (snapshot.hasData && _selectedPlace != null) {
                            return Column(
                              children: [
                                CafeInfoView(cafe: _selectedCafe!),
                                CafeImageSliderView(
                                  cafeList: snapshot.data!.cafe.list,
                                  handleCafeSlide: handleCafeSlide,
                                )
                              ],
                            );
                          } else if (snapshot.hasError) {
                            return Text("${snapshot.error}");
                          }
                          return Skeleton();
                        })),
                Container(
                    child: FutureBuilder<PlaceListResponse>(
                        future: _placeResponse,
                        builder: (context, snapshot) {
                          if (snapshot.hasData && _selectedCafe != null) {
                            return PlaceListView(
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
