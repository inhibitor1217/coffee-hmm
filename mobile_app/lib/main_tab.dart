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

  @override
  Widget build(BuildContext context) {
    return Container(
        height: 36,
        margin: EdgeInsets.only(left: 20, bottom: 10),
        child: ListView(scrollDirection: Axis.horizontal, children: [
          Container(
              margin: EdgeInsets.only(right: 4),
              child: PlaceTabElement(
                  place: currentPlace, isSelected: true, onPressed: onTapped)),
          ...buildExtraPlaces()
        ]));
  }

  List<Widget> buildExtraPlaces() {
    List<PlaceModel> places = List.from(placeList)
      ..removeWhere((place) => place.id == currentPlace.id);

    return List.generate(
        places.length,
        (index) => Container(
            margin: EdgeInsets.only(right: index == places.length - 1 ? 20 : 4),
            child: PlaceTabElement(
                place: places[index], isSelected: false, onPressed: onTapped)));
  }
}

class PlaceTabElement extends StatelessWidget {
  final PlaceModel place;
  final bool isSelected;
  final void Function(PlaceModel) onPressed;

  PlaceTabElement(
      {required this.place, required this.isSelected, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
          primary: isSelected
              ? Color.fromRGBO(155, 218, 218, 1)
              : Colors.transparent,
          shadowColor: Colors.transparent,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          side: BorderSide(
              width: 1,
              color: isSelected
                  ? Color.fromRGBO(220, 238, 238, 1)
                  : Color.fromRGBO(204, 236, 236, 1),
              style: BorderStyle.solid),
          textStyle: TextStyle(
            fontSize: 14,
            letterSpacing: 1.5,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          )),
      child: Text(place.name,
          style: TextStyle(color: isSelected ? Colors.white : Colors.black)),
      onPressed: () => onPressed(place),
    );
  }
}
