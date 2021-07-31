import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';

class PlaceTab extends StatelessWidget {
  final List<PlaceModel> placeList;
  final PlaceModel currentPlace;
  final void Function(PlaceModel) onTapped;

  PlaceTab(
      {required this.placeList,
      required this.currentPlace,
      required this.onTapped});

  List<Widget> buildExtraPlaces() {
    List<PlaceModel> places = List.from(placeList)
      ..removeWhere((place) => place == currentPlace);

    return List.generate(
        places.length,
        (index) => Container(
            margin: EdgeInsets.only(right: index == places.length - 1 ? 20 : 4),
            child: GestureDetector(
              child: PlaceTabElement(place: places[index], isSelected: false),
              onTap: () => onTapped(places[index]),
            )));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        height: 26,
        margin: EdgeInsets.only(left: 20),
        child: ListView(scrollDirection: Axis.horizontal, children: [
          Container(
              margin: EdgeInsets.only(right: 4),
              child: PlaceTabElement(place: currentPlace, isSelected: true)),
          ...buildExtraPlaces()
        ]));
  }
}

class PlaceTabElement extends StatelessWidget {
  final PlaceModel place;
  final bool isSelected;

  PlaceTabElement({required this.place, required this.isSelected});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 10, vertical: 2),
        decoration: BoxDecoration(
            color: isSelected
                ? Color.fromRGBO(155, 218, 218, 1)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
                color: isSelected
                    ? Color.fromRGBO(220, 238, 238, 1)
                    : Color.fromRGBO(204, 236, 236, 1),
                width: 1,
                style: BorderStyle.solid)),
        child: Text(place.name,
            style: TextStyle(
                fontSize: 12,
                letterSpacing: 2,
                color: isSelected ? Colors.white : Colors.black)));
  }
}
