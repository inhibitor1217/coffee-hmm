import 'package:flutter/material.dart';
import 'package:mobile_app/api.dart';
import 'package:mobile_app/header.dart';
import 'package:mobile_app/main_button.dart';
import 'package:mobile_app/main_slider_section.dart';
import 'package:mobile_app/main_tab.dart';
import 'package:mobile_app/main_table_section.dart';
import 'package:mobile_app/type.dart';

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  /* Main Page has 2 view mode : Slider, Table */
  bool isTableViewMode = false;

  void handleViewMode() {
    setState(() {
      isTableViewMode = !isTableViewMode;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        appBar: MainHeader(
          isTableViewMode: isTableViewMode,
          onChangeViewMode: handleViewMode,
        ),
        body: MainBody(isTableViewMode: isTableViewMode));
  }
}

class MainBody extends StatefulWidget {
  final bool isTableViewMode;

  MainBody({required this.isTableViewMode});

  @override
  _MainBodyState createState() => _MainBodyState();
}

class _MainBodyState extends State<MainBody> with TickerProviderStateMixin {
  Map<String, Future<CafeListResponse>> _cafeListResponses = {};
  Future<PlaceListResponse>? _placeResponses;
  List<PlaceModel>? _placeList;
  List<CafeModel>? _cafeList;
  CafeModel? _currentCafe;
  PlaceModel? _currentPlace;

  @override
  void initState() {
    super.initState();
    _placeResponses = fetchPlaceList();
    _placeResponses!.then((data) {
      PlaceModel initialPlace = data.place.list[0];
      setState(() {
        _placeList = data.place.list;
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
      _currentCafe = _cafeList![index % _cafeList!.length];
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_currentPlace != null && _cafeList != null && _currentCafe != null) {
      return Column(children: [
        /* 뷰 모드 공통 장소 탭 */
        PlaceTab(
          placeList: _placeList!,
          currentPlace: _currentPlace!,
          onTapped: handlePlaceClick,
        ),
        /* 뷰 모드에 따른 메인 컨텐츠 */
        Flexible(
            child: ListView.builder(
                itemCount: 1,
                itemBuilder: (context, index) {
                  return widget.isTableViewMode
                      ? MainTable(
                          cafeListResponses: _cafeListResponses,
                          cafeList: _cafeList!,
                          currentCafe: _currentCafe!,
                          currentPlace: _currentPlace!,
                        )
                      : Column(children: [
                          MainSlider(
                            cafeListResponses: _cafeListResponses,
                            cafeList: _cafeList!,
                            currentCafe: _currentCafe!,
                            currentPlace: _currentPlace!,
                            onSlide: handleCafeSlide,
                          ),
                          MainButtonSetOfSlider()
                        ]);
                }))
      ]);
    } else {
      return Center(child: Text('loading...'));
    }
  }

  Future<CafeListResponse> _fetchCafeListOfPlace(PlaceModel place) {
    if (!_cafeListResponses.containsKey(place.id)) {
      _cafeListResponses[place.id] = fetchCafeListByPlace(place);
    }

    return _cafeListResponses[place.id]!;
  }
}
