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
  /* Main Page has 2 view mode : Slider, Table */
  bool isTableViewMode = false;
  double opacityLevel = 0.0;

  void handleChangeViewMode() {
    setState(() {
      isTableViewMode = !isTableViewMode;
    });
  }

  void handleOpacity(double opacity) {
    setState(() {
      opacityLevel = opacity;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        extendBodyBehindAppBar: true,
        appBar: Header(
            isDetailPage: false,
            isTableViewMode: isTableViewMode,
            onChangeViewMode: handleChangeViewMode,
            opacityLevel: opacityLevel),
        body: MainBody(
            onTapped: widget.onTapped,
            isTableViewMode: isTableViewMode,
            onChangeOpacity: handleOpacity));
  }
}

class MainBody extends StatefulWidget {
  final ValueChanged<CafeModel> onTapped;
  final ValueChanged<double> onChangeOpacity;
  final bool isTableViewMode;

  MainBody(
      {required this.onTapped,
      required this.isTableViewMode,
      required this.onChangeOpacity});

  @override
  _MainBodyState createState() =>
      _MainBodyState(onTapped: onTapped, onChangeOpacity: onChangeOpacity);
}

class _MainBodyState extends State<MainBody> with TickerProviderStateMixin {
  final ValueChanged<CafeModel> onTapped;
  final ValueChanged<double> onChangeOpacity;
  Map<String, Future<CafeListResponse>> _cafeListResponses = {};
  Future<PlaceListResponse>? _placeResponses;
  List<CafeModel>? _cafeList;
  CafeModel? _currentCafe;
  PlaceModel? _currentPlace;
  double opacityLevel = 0.0;

  _MainBodyState({required this.onTapped, required this.onChangeOpacity});

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
    duration: Duration(milliseconds: 300),
    vsync: this,
  );

  void handleBottomSheet(bool openMode) {
    if (openMode) {
      _controller.forward();
      setState(() {
        opacityLevel = 1.0;
      });
      onChangeOpacity(1.0);
    } else {
      _controller.reverse();
      setState(() {
        opacityLevel = 0.0;
      });
      onChangeOpacity(0.0);
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
              return widget.isTableViewMode
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
          AnimatedOpacity(
              opacity: opacityLevel,
              duration: Duration(milliseconds: 200),
              child: Visibility(
                  visible: opacityLevel == 0.0 ? false : true,
                  child: GestureDetector(
                      child: Container(
                          height: double.infinity,
                          decoration: BoxDecoration(color: Colors.black45)),
                      onTap: () => handleBottomSheet(false)))),
          PositionedTransition(
              rect: RelativeRectTween(
                      /* BottomSheet height is 320px */
                      begin: RelativeRect.fromLTRB(
                          0, MediaQuery.of(context).size.height, 0, 0),
                      end: RelativeRect.fromLTRB(
                          0, MediaQuery.of(context).size.height - 320, 0, 0))
                  .animate(_controller),
              child: AnimatedOpacity(
                  opacity: opacityLevel,
                  duration: Duration(milliseconds: 200),
                  child: MainPlaceBottomSheet(
                      cafeList: _cafeList!,
                      handleBottomSheet: handleBottomSheet)))
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
