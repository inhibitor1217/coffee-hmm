import 'package:flutter/material.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/type.dart';

class Cafe extends StatelessWidget {
  final CafeModel cafe;

  Cafe({required this.cafe});

  @override
  Widget build(BuildContext context) {
    double size = MediaQuery.of(context).size.width;
    return Column(
      children: <Widget>[
        CafeInfo(cafe: cafe),
        CafeImage(image: cafe.image.mainImage, size: size),
      ],
    );
  }
}

/* 메인 페이지 */
class CafeInfo extends StatelessWidget {
  final CafeModel cafe;

  CafeInfo({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.only(left: 20, right: 20, bottom: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              cafe.name,
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 2),
            Text(
              '${cafe.place.name} OPEN ${cafe.metadata.hour}',
              style: TextStyle(fontSize: 14),
            ),
            SizedBox(
              height: 2,
            ),
            Container(
              alignment: Alignment.centerRight,
              child: Text(
                "${cafe.metadata.creator ?? 'jyuunnii'} 님이 올려주신 ${cafe.name}",
                style: TextStyle(
                  fontSize: 11,
                ),
              ),
            )
          ],
        ));
  }
}

/* 디테일 페이지 */
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
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 2),
            Text(
              '${cafe.place.name} OPEN ${cafe.metadata.hour}',
              style: TextStyle(
                fontSize: 14,
              ),
            ),
          ],
        ));
  }
}
