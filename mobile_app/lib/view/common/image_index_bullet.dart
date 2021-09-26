import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';

class ImageIndexBullet extends StatelessWidget {
  final int totalCount;
  final int currentIndex;

  ImageIndexBullet({required this.totalCount, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: EdgeInsets.symmetric(vertical: 16),
        child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: List.generate(totalCount,
                (index) => Bullet(isHighlight: currentIndex == index))));
  }
}

class Bullet extends StatelessWidget {
  final bool isHighlight;

  Bullet({required this.isHighlight});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(right: 6),
      width: 6,
      height: 6,
      decoration: BoxDecoration(
        color: isHighlight ? Palette.gray : Palette.lightGray,
        borderRadius: BorderRadius.circular(50),
      ),
    );
  }
}
