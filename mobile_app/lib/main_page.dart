import 'package:flutter/material.dart';
import 'package:mobile_app/api.dart';
import 'package:mobile_app/header.dart';
import 'package:mobile_app/main_cafe_section.dart';
import 'package:mobile_app/place_list.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainScreen extends StatelessWidget {
  final ValueChanged<CafeModel> onTapped;

  MainScreen({required this.onTapped});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: Header(),
      body: MainBody(onTapped: onTapped),
    );
  }
}

class MainBody extends StatefulWidget {
  final ValueChanged<CafeModel> onTapped;

  MainBody({required this.onTapped});

  @override
  _MainBodyState createState() => _MainBodyState(onTapped: onTapped);
}

class _MainBodyState extends State<MainBody> {
  Map<String, Future<CafeListResponse>> _cafeListResponse = {};
  Future<PlaceListResponse>? _placeResponse;
  List<CafeModel>? _cafeList;
  CafeModel? _currentCafe;
  PlaceModel? _currentPlace;
  final ValueChanged<CafeModel> onTapped;

  _MainBodyState({required this.onTapped});

  @override
  void initState() {
    super.initState();
    _placeResponse = fetchPlaceList();
    _placeResponse!.then((data) {
      PlaceModel initialPlace = data.place.list[0];
      setState(() {
        _currentPlace = initialPlace;
      });

      _fetchCafeListOfPlace(initialPlace).then((data) {
        setState(() {
          _cafeList = data.cafe.list;
          _currentCafe = data.cafe.list[0];
        });
      });
    });
  }

  void handlePlaceClick(PlaceModel place) {
    setState(() {
      _fetchCafeListOfPlace(place).then((data) {
        setState(() {
          _cafeList = data.cafe.list;
          _currentCafe = data.cafe.list[0];
        });
      });
    });
  }

  void handleCafeSlide(int index) {
    setState(() {
      _currentCafe = _cafeList![index];
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_currentPlace != null && _cafeList != null && _currentCafe != null) {
      return ListView.builder(
        itemCount: 1,
        itemBuilder: (context, index) {
          return Row(
            children: [
              Expanded(
                  child: Column(
                children: [
                  MainCafeSection(
                    cafeListResponse: _cafeListResponse,
                    cafeList: _cafeList!,
                    currentCafe: _currentCafe!,
                    currentPlace: _currentPlace!,
                    onSlide: handleCafeSlide,
                    onTapped: onTapped,
                  ),
                  Container(
                      child: FutureBuilder<PlaceListResponse>(
                          future: _placeResponse,
                          builder: (context, snapshot) {
                            if (snapshot.hasData) {
                              return PlaceList(
                                placeList: snapshot.data!.place.list,
                                currentPlace: _currentPlace,
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
    } else {
      return Center(child: Text('loading...'));
    }
  }

  Future<CafeListResponse> _fetchCafeListOfPlace(PlaceModel place) {
    if (!_cafeListResponse.containsKey(place.id)) {
      _cafeListResponse[place.id] = fetchCafeListByPlace(place);
    }

    return _cafeListResponse[place.id]!;
  }
}
