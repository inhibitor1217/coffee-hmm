import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';

class PlaceList extends StatelessWidget {
  final List<PlaceModel>? placeList;
  final PlaceModel? currentPlace;
  final void Function(PlaceModel) handlePlaceClick;

  PlaceList(
      {required this.placeList,
      required this.currentPlace,
      required this.handlePlaceClick});

  List<Container> _buildGridTileList(int count) => List.generate(
      count,
      (index) => Container(
          child: CafePlace(
              place: placeList![index],
              isSelected: placeList![index] == currentPlace,
              onTapped: handlePlaceClick)));

  @override
  Widget build(BuildContext context) {
    return GridView.count(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        crossAxisCount: 5,
        childAspectRatio: 2.5,
        children: _buildGridTileList(placeList!.length));
  }
}

class CafePlace extends StatelessWidget {
  final PlaceModel place;
  final bool isSelected;
  final void Function(PlaceModel) onTapped;

  CafePlace(
      {required this.place, required this.isSelected, required this.onTapped});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: Text(
        place.name,
        style: TextStyle(
          fontSize: 14,
          color: Colors.black,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        textAlign: TextAlign.center,
      ),
      onTap: () {
        onTapped(place);
      },
    );
  }
}
