import 'package:flutter/material.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/type.dart';

class Cafe extends StatelessWidget {
  final CafeModel cafe;

  Cafe({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        CafeInfo(cafe: cafe),
        CafeImage(image: cafe.image.mainImage),
      ],
    );
  }
}

class CafeInfo extends StatelessWidget {
  final CafeModel cafe;

  CafeInfo({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              cafe.name,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Container(
              padding: EdgeInsets.symmetric(vertical: 4),
              child: Text(
                '${cafe.place.name} OPEN ${cafe.metadata.hour}',
                style: TextStyle(fontSize: 14),
              ),
            ),
            Container(
              alignment: Alignment.centerRight,
              child: Text(
                "${cafe.metadata.creator ?? 'jyuunnii'} 님이 올려주신 ${cafe.name}",
                style: TextStyle(
                  fontSize: 12,
                ),
              ),
            )
          ],
        ));
  }
}

class CafeMinimumInfo extends StatelessWidget {
  final CafeModel cafe;

  CafeMinimumInfo({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Container(
        alignment: Alignment.centerLeft,
        padding: EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              cafe.name,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),
            Container(
              padding: EdgeInsets.symmetric(vertical: 4),
              child: Text(
                '${cafe.place.name} OPEN ${cafe.metadata.hour}',
                style: TextStyle(fontSize: 14),
              ),
            ),
          ],
        ));
  }
}
