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
        margin: EdgeInsets.only(bottom: 10),
        child: ListView(
            scrollDirection: Axis.horizontal,
            children: List.generate(
                placeList.length,
                (index) => Container(
                    padding: EdgeInsets.only(
                        right: index == placeList.length - 1 ? 20 : 4,
                        left: index == 0 ? 20 : 4),
                    child: PlaceTabElement(
                        place: placeList[index],
                        isSelected: currentPlace.id == placeList[index].id,
                        onPressed: onTapped)))));
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
                  : Colors.black12,
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
