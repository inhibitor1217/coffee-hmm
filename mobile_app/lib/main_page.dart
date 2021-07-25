import 'package:flutter/material.dart';
import 'package:mobile_app/api.dart';
import 'package:mobile_app/header.dart';
import 'package:mobile_app/main_button.dart';
import 'package:mobile_app/main_slider_view.dart';
import 'package:mobile_app/main_table_view.dart';
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
  bool isTableView = false;

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
      _currentPlace = place;
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
      return Stack(
        children: [
          ListView.builder(
            itemCount: 1,
            itemBuilder: (context, index) {
              return Column(
                children: [
                  isTableView
                      ? MainTableView(
                          cafeListResponses: _cafeListResponse,
                          placeResponse: _placeResponse,
                          cafeList: _cafeList!,
                          currentCafe: _currentCafe!,
                          currentPlace: _currentPlace!,
                          onTapped: onTapped,
                          onChangePlace: handlePlaceClick)
                      : MainSliderView(
                          cafeListResponses: _cafeListResponse,
                          placeResponse: _placeResponse,
                          cafeList: _cafeList!,
                          currentCafe: _currentCafe!,
                          currentPlace: _currentPlace!,
                          onSlide: handleCafeSlide,
                          onTapped: onTapped,
                          onChangePlace: handlePlaceClick),
                ],
              );
            },
          ),
          Positioned(
              bottom: 0,
              child: GestureDetector(
                child: MainFloatingButton(isTableView: isTableView),
                onTap: () {
                  setState(() {
                    isTableView = !isTableView;
                  });
                },
              ))
        ],
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
