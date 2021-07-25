import 'package:flutter/material.dart';
import 'package:mobile_app/main_table_section.dart';
import 'package:mobile_app/place_list.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainTableView extends StatelessWidget {
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final Future<PlaceListResponse>? placeResponse;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;
  final void Function(CafeModel) onTapped;
  final void Function(PlaceModel) onChangePlace;

  MainTableView(
      {required this.cafeListResponses,
      required this.placeResponse,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace,
      required this.onTapped,
      required this.onChangePlace});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Container(
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
                })),
        Container(
            margin: EdgeInsets.only(bottom: 92),
            child: MainTable(
              cafeListResponses: cafeListResponses,
              cafeList: cafeList,
              currentCafe: currentCafe,
              currentPlace: currentPlace,
              onTapped: onTapped,
            ))
      ],
    );
  }
}
