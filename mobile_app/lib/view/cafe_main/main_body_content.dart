import 'package:flutter/material.dart';
import 'package:mobile_app/view/common/image_index_bullet.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/cafe_main/main_slider_section.dart';
import 'package:mobile_app/view/cafe_main/main_tab.dart';
import 'package:mobile_app/view/cafe_main/main_feed_section.dart';
import 'package:mobile_app/view/common/initial_loading.dart';

class MainBody extends StatefulWidget {
  final bool isFeedViewMode;

  MainBody({required this.isFeedViewMode});

  @override
  _MainBodyState createState() => _MainBodyState();
}

class _MainBodyState extends State<MainBody> {
  PageController _pageController = PageController();
  final ScrollController _scrollController = ScrollController();

  Future<PlaceListResponse>? _placeResponses;
  List<PlaceModel> _placeList = [];
  PlaceModel? _currentPlace;

  final Map<String, Future<CafeListResponse>> _cafeListResponses = {};
  List<CafeModel> _currentCafeList = [];
  CafeModel? _currentCafe;

  final Map<String, List<CafeImageSetModel>> _feedElements = {};
  List<CafeImageSetModel> get _imageSets => _feedElements[_currentPlace?.id] ?? [];

  @override
  void initState() {
    super.initState();
    _placeResponses = fetchPlaceList();
    _placeResponses?.then((data) {
      _updatePlacesInfo(data);
      _updateCafeListResponse(data.place.list[0]);
    });
  }
  @override
  void didUpdateWidget(covariant MainBody oldWidget){
    super.didUpdateWidget(oldWidget);
    if(_currentCafe != null){
      _pageController = PageController(initialPage: _currentCafeList.indexOf(_currentCafe!));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_currentPlace != null && _currentCafe != null) {
      return Column(
          children: [
            PlaceTab(
              placeList: _placeList,
              currentPlace: _currentPlace!,
              onTapped: _handlePlaceClick,
            ),
            Flexible(
                child: widget.isFeedViewMode
                    ? MainFeed(
                        scrollController: _scrollController,
                        cafeListResponses: _cafeListResponses,
                        cafeList: _currentCafeList,
                        currentPlace: _currentPlace!,
                        imageSets: _imageSets,
                      )
                    : Column(
                        children: [
                          MainSlider(
                            pageController: _pageController,
                            cafeListResponses: _cafeListResponses,
                            cafeList: _currentCafeList,
                            currentCafe: _currentCafe!,
                            currentPlace: _currentPlace!,
                            onSlide: _handleCafeSlide,
                          ),
                          ImageIndexBullet(
                              totalCount: _currentCafeList.length,
                              currentIndex: _currentCafeList.indexOf(_currentCafe!)
                          ),
                        ]
                    )
            )
      ]);
    }

    return InitialLoading();
  }

  Future<CafeListResponse> _fetchCafeListResponseOfPlace(PlaceModel place) {
    if (!_cafeListResponses.containsKey(place.id)) {
      _cafeListResponses[place.id] = fetchCafeListByPlace(place);
    }
    return _cafeListResponses[place.id]!;
  }

  void _updateCafeListResponse(PlaceModel place){
    _fetchCafeListResponseOfPlace(place).then((data) {
      _updateCafesInfo(data.cafe);
      _updateFeedElements(place, data.cafe);
    });
  }

  void _updateCafesInfo (CafeListModel cafe){
    setState(() {
      _currentCafeList = cafe.list;
      _currentCafe = cafe.list[0];
    });
  }

  void _updatePlacesInfo(PlaceListResponse data){
    setState(() {
      _placeList = data.place.list;
      _currentPlace = data.place.list[0];
    });
  }

  void _updateFeedElements(PlaceModel place, CafeListModel cafe){
    if(!_feedElements.containsKey(place.id)) {
      setState(() {
        _feedElements[place.id] = _createFeedElements(place, cafe.list);
      });
    }
  }

  Future<void> _handlePlaceClick(PlaceModel place) async {
    if (_pageController.hasClients) {
      _pageController.jumpToPage(0);
    }
    if (_scrollController.hasClients) {
      await Future.delayed(const Duration(milliseconds: 300));
      _scrollController.jumpTo(_scrollController.position.minScrollExtent);
    }

    setState(() {
      _currentPlace = place;
      _updateCafeListResponse(place);
    });
  }

  void _handleCafeSlide(int index) {
    setState(() {
      _currentCafe = _currentCafeList[index % _currentCafeList.length];
    });
  }

}

List<CafeImageSetModel> _createFeedElements(PlaceModel place, List<CafeModel> cafeList){
  List<CafeImageSetModel> _elements = [];
  for(final _cafe in cafeList){
    for(final _image in _cafe.image.basicImages){
      _elements.add(new CafeImageSetModel(cafe: _cafe, image: _image));
    }
  }

  if(_elements.isNotEmpty){
    _elements.shuffle();
  }
  return _elements;
}