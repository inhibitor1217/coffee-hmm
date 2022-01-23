import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/view/common/badge.dart';

class CafeDetailSectionTitle extends StatelessWidget {
  final String title;
  final bool? showBadge;

  CafeDetailSectionTitle({required this.title, this.showBadge = false});

  @override
  Widget build(BuildContext context){
    return   Container(
        margin: EdgeInsets.only(left: 20, right: 20, bottom: 16),
        child:  Row(
            children: [
              Text(title, style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              SizedBox(width: 4),
              if(showBadge!)
                Badge(text: 'NEW',
                    size: BadgeSize.small,
                    customSpec: BadgeCustomSpec(backgroundColor: Palette.lightRed, textColor: Colors.white)
                ),
            ]));
  }
}