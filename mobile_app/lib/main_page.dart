import 'package:flutter/material.dart';
import 'package:mobile_app/api.dart';
import 'package:mobile_app/header.dart';
import 'package:mobile_app/main_button.dart';
import 'package:mobile_app/main_place_bottom_sheet.dart';
import 'package:mobile_app/main_slider_section.dart';
import 'package:mobile_app/main_table_section.dart';
import 'package:mobile_app/type.dart';

class MainScreen extends StatefulWidget {
  final ValueChanged<CafeModel> onTapped;

  MainScreen({required this.onTapped});

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  bool isTableView = false;

  void handleChangeView() {
    setState(() {
      isTableView = !isTableView;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: Header(isDetailPage: false, onChangeView: handleChangeView),
      body: MainBody(onTapped: widget.onTapped, isTableView: isTableView),
    );
  }
}

class MainBody extends StatefulWidget {
  final ValueChanged<CafeModel> onTapped;
  final bool isTableView;

  MainBody({required this.onTapped, required this.isTableView});

  @override
  _MainBodyState createState() => _MainBodyState(onTapped: onTapped);
}

class _MainBodyState extends State<MainBody> with TickerProviderStateMixin {
  final ValueChanged<CafeModel> onTapped;
  Map<String, Future<CafeListResponse>> _cafeListResponses = {};
  Future<PlaceListResponse>? _placeResponses;
  List<CafeModel>? _cafeList;
  CafeModel? _currentCafe;
  PlaceModel? _currentPlace;

  _MainBodyState({required this.onTapped});

  @override
  void initState() {
    super.initState();
    _placeResponses = fetchPlaceList();
    _placeResponses!.then((data) {
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

  late final AnimationController _controller = AnimationController(
    duration: const Duration(milliseconds: 500),
    vsync: this,
  );

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void handleBottomSheet(bool openMode) {
    if (openMode) {
      _controller.forward();
    } else {
      _controller.reverse();
    }
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
              return widget.isTableView
                  ? MainTable(
                      cafeListResponses: _cafeListResponses,
                      cafeList: _cafeList!,
                      currentCafe: _currentCafe!,
                      currentPlace: _currentPlace!,
                      onTapped: onTapped,
                    )
                  : Column(children: [
                      MainSlider(
                        cafeListResponses: _cafeListResponses,
                        cafeList: _cafeList!,
                        currentCafe: _currentCafe!,
                        currentPlace: _currentPlace!,
                        onSlide: handleCafeSlide,
                        onTapped: onTapped,
                      ),
                      MainButtonSetOfSlider(
                          handleBottomSheet: handleBottomSheet)
                    ]);
            },
          ),
          PositionedTransition(
              rect: RelativeRectTween(
                      /* BottomSheet height is 268px */
                      begin: RelativeRect.fromLTRB(
                          0, MediaQuery.of(context).size.height, 0, 0),
                      end: RelativeRect.fromLTRB(
                          0, MediaQuery.of(context).size.height - 268, 0, 0))
                  .animate(_controller),
              child: MainPlaceBottomSheet(handleBottomSheet: handleBottomSheet))
        ],
      );
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
