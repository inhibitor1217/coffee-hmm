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
      count, (index) => Container(child: _buildPlace(placeList![index])));

  @override
  Widget build(BuildContext context) {
    return GridView.count(
        scrollDirection: Axis.vertical,
        shrinkWrap: true,
        crossAxisCount: 5,
        childAspectRatio: 2.5,
        padding: EdgeInsets.symmetric(vertical: 20),
        children: _buildGridTileList(placeList!.length));
  }

  Widget _buildPlace(PlaceModel place) {
    final isSelected = place == currentPlace;

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
        handlePlaceClick(place);
      },
    );
  }
}
