import 'package:flutter/material.dart';
import 'package:mobile_app/main_slider_section.dart';
import 'package:mobile_app/place_list.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainSliderView extends StatelessWidget {
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final Future<PlaceListResponse>? placeResponse;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;
  final void Function(int) onSlide;
  final void Function(CafeModel) onTapped;
  final void Function(PlaceModel) onChangePlace;

  MainSliderView(
      {required this.cafeListResponses,
      required this.placeResponse,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace,
      required this.onSlide,
      required this.onTapped,
      required this.onChangePlace});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        MainSlider(
          cafeListResponses: cafeListResponses,
          cafeList: cafeList,
          currentCafe: currentCafe,
          currentPlace: currentPlace,
          onSlide: onSlide,
          onTapped: onTapped,
        ),
        Container(
            margin: EdgeInsets.only(top: 14, bottom: 92),
            child: FutureBuilder<PlaceListResponse>(
                future: placeResponse,
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    return PlaceList(
                      placeList: snapshot.data!.place.list,
                      currentPlace: currentPlace,
                      handlePlaceClick: onChangePlace,
                    );
                  } else if (snapshot.hasError) {
                    return Text("${snapshot.error}");
                  }
                  return Skeleton();
                }))
      ],
    );
  }
}
