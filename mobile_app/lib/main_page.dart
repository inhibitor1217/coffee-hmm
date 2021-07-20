import 'package:flutter/material.dart';
import 'package:mobile_app/api.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/header.dart';
import 'package:mobile_app/place_list.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainScreen extends StatelessWidget {
  final ValueChanged<CafeModel> onTapped;

  MainScreen({required this.onTapped});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
  List<CafeModel>? _cafes;
  CafeModel? _currentCafe;
  PlaceModel? _currentPlace;
  final ValueChanged<CafeModel> onTapped;

  _MainBodyState({required this.onTapped});

  @override
  void initState() {
    super.initState();
    fetchPlaceList().then((data) {
      PlaceModel initialPlace = data.place.list[0];
      setState(() {
        _currentPlace = initialPlace;
      });

      _fetchCafeListOfPlace(initialPlace).then((data) {
        setState(() {
          _cafes = data.cafe.list;
          _currentCafe = data.cafe.list[0];
        });
      });
    });
  }

  void handlePlaceClick(PlaceModel place) {
    setState(() {
      _fetchCafeListOfPlace(place).then((data) {
        setState(() {
          _cafes = data.cafe.list;
          _currentCafe = data.cafe.list[0];
        });
      });
    });
  }

  void handleCafeSlide(int index) {
    setState(() {
      _currentCafe = _cafes![index];
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
                        future: _cafeListResponse[_currentPlace?.id],
                        builder: (context, snapshot) {
                          if (snapshot.hasData && _currentPlace != null) {
                            return GestureDetector(
                              child: Column(
                                children: [
                                  CafeInfo(cafe: _currentCafe!),
                                  CafeImageSlider(
                                    cafeList: snapshot.data!.cafe.list,
                                    handleCafeSlide: handleCafeSlide,
                                  )
                                ],
                              ),
                              onTap: () => onTapped(_currentCafe!),
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
                          if (snapshot.hasData && _currentCafe != null) {
                            return PlaceListView(
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
  }
   Future<CafeListResponse> _fetchCafeListOfPlace(PlaceModel place) {
    if (!_cafeListResponse.containsKey(place.id)) {
      _cafeListResponse[place.id] = fetchCafeListByPlace(place);
    }

    return _cafeListResponse[place.id]!;
  }
}
