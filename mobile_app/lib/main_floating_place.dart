import 'package:flutter/material.dart';
import 'package:mobile_app/place_list.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainFloatingPlace extends StatelessWidget {
  final Future<PlaceListResponse>? placeResponses;
  final PlaceModel currentPlace;
  final void Function(PlaceModel) onChangePlace;

  MainFloatingPlace(
      {required this.placeResponses,
      required this.currentPlace,
      required this.onChangePlace});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: Container(
          width: MediaQuery.of(context).size.width - 40,
          padding: EdgeInsets.symmetric(vertical: 10),
          margin: EdgeInsets.symmetric(vertical: 20),
          decoration: BoxDecoration(
              color: Colors.white, borderRadius: BorderRadius.circular(4)),
          child: FutureBuilder<PlaceListResponse>(
              future: placeResponses,
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
      onTap: () {},
    );
  }
}
