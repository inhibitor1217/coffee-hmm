import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';

import '../common/cafe_image.dart';

class CafeImageCard extends StatelessWidget {
  final CafeModel cafe;

  CafeImageCard({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Card(
            clipBehavior: Clip.antiAlias,
            elevation: 0,
            margin: EdgeInsets.only(right: 3),
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(4),
                  color: Palette.grayBG),
              child: CafeImage(image: cafe.image.mainImage, size: 100),
            )),
        Container(
            width: 100,
            margin: EdgeInsets.only(top: 8),
            child: Text(cafe.name,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: 12))),
        SizedBox(height: 2),
        Text(cafe.place.name,
            style: TextStyle(fontSize: 11, color: Palette.gray))
      ],
    );
  }
}
