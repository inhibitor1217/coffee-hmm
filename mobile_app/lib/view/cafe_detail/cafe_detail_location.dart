import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/common/badge.dart';
import 'package:mobile_app/view/common/map.dart';

class CafeDetailLocation extends StatelessWidget {
  final CafeModel cafe;

  CafeDetailLocation({required this.cafe});

  @override
  Widget build(BuildContext context){
    return Container(
        alignment: Alignment.centerLeft,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 20),
            CafeDetailLocationTitle(),
            Map(
              isOpenPage: true,
              cafe: cafe,
              height: 240),
          ],
       )
    );
  }
}

class CafeDetailLocationTitle extends StatelessWidget {
  @override
  Widget build(BuildContext context){
    return   Container(
      margin: EdgeInsets.only(left: 20, right: 20, bottom: 16),
      child:  Row(
        children: [
          Text('카페 가는 길', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          SizedBox(width: 4),
          Badge(text: 'NEW', decoration: BoxDecoration(color: Palette.lightRed, borderRadius: BorderRadius.all(Radius.circular(4))))
    ]));

  }
}