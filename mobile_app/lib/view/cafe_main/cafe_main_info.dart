import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/common/cafe_name.dart';

class CafeMainInfo extends StatelessWidget {
  final CafeModel cafe;

  CafeMainInfo({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.only(left: 20, right: 20, bottom: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CafeName(name: cafe.name),
            SizedBox(height: 4),
            Text(
              '${cafe.place.name} OPEN ${cafe.metadata?.hour ?? ''}',
              style: TextStyle(fontSize: 14),
            ),
            SizedBox(
              height: 4,
            ),
            Container(
              alignment: Alignment.centerRight,
              child: Text(
                "${cafe.metadata?.creator ?? 'jyuunnii'} 님이 올려주신 ${cafe.name}",
                style: TextStyle(
                  fontSize: 11,
                ),
              ),
            )
          ],
        ));
  }
}
