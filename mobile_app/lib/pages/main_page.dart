import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/cafe_main/main_button.dart';
import 'package:mobile_app/view/cafe_main/main_slider_section.dart';
import 'package:mobile_app/view/cafe_main/main_tab.dart';
import 'package:mobile_app/view/cafe_main/main_table_section.dart';
import 'package:mobile_app/view/common/header.dart';
import 'package:mobile_app/view/common/image_index_bullet.dart';

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

class _MainBodyState extends State<MainBody> {
  final PageController _pageController = PageController();
  final ScrollController _scrollController = ScrollController();
  Map<String, Future<CafeListResponse>> _cafeListResponses = {};
  Future<PlaceListResponse>? _placeResponses;
  List<PlaceModel>? _placeList;
  List<CafeModel>? _cafeList;
  CafeModel? _currentCafe;
  PlaceModel? _currentPlace;
  Future<CafeListResponse>? _hotCafeListResponses;
  List<CafeModel>? _hotCafeList;

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

    _hotCafeListResponses = fetchHotCafeList(10);
    _hotCafeListResponses!.then((data) {
      setState(() {
        _hotCafeList = data.cafe.list;
      });
    });
  }

  Future<void> handlePlaceClick(PlaceModel place) async {
    if (_pageController.hasClients) {
      _pageController.jumpToPage(0);
    }

    if (_scrollController.hasClients) {
      await Future.delayed(const Duration(milliseconds: 300));
      _scrollController.jumpTo(_scrollController.position.minScrollExtent);
    }

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
    if (_currentPlace != null &&
        _cafeList != null &&
        _currentCafe != null &&
        _hotCafeList != null) {
      return Column(children: [
        /* 뷰 모드 공통 장소 탭 */
        PlaceTab(
          placeList: _placeList!,
          currentPlace: _currentPlace!,
          onTapped: handlePlaceClick,
        ),
        /* 뷰 모드에 따른 메인 컨텐츠 */
        Flexible(
            child: widget.isTableViewMode
                ? MainTable(
                    scrollController: _scrollController,
                    cafeListResponses: _cafeListResponses,
                    cafeList: _cafeList!,
                    currentCafe: _currentCafe!,
                    currentPlace: _currentPlace!,
                  )
                : Column(children: [
                    MainSlider(
                      pageController: _pageController,
                      cafeListResponses: _cafeListResponses,
                      cafeList: _cafeList!,
                      currentCafe: _currentCafe!,
                      currentPlace: _currentPlace!,
                      onSlide: handleCafeSlide,
                    ),
                    ImageIndexBullet(
                        totalCount: _cafeList!.length,
                        currentIndex: _cafeList!.indexOf(_currentCafe!)),
                    MainButtonSetOfSlider(
                        hotCafeList: _hotCafeList!, cafe: _currentCafe!)
                  ]))
      ]);
    } else {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            SizedBox(height: 170),
            SvgPicture.asset(
              'assets/images/loading_text.svg',
              width: 130,
              height: 68,
            ),
            SizedBox(height: 20),
            SizedBox(
              width: 14,
              height: 14,
              child: CircularProgressIndicator(
                semanticsLabel: 'Linear progress indicator',
                strokeWidth: 4,
                color: Palette.highlightedColor,
              ),
            ),
          ],
        ),
      );
    }
  }

  Future<CafeListResponse> _fetchCafeListOfPlace(PlaceModel place) {
    if (!_cafeListResponses.containsKey(place.id)) {
      _cafeListResponses[place.id] = fetchCafeListByPlace(place);
    }

    return _cafeListResponses[place.id]!;
  }
}
