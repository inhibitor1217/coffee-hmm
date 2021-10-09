import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/view/common/cafe_info_item.dart';
import 'package:mobile_app/view/common/cafe_name.dart';
import 'package:mobile_app/view/common/text_info.dart';

class CafeMainInfo extends StatelessWidget {
  final CafeModel cafe;

  CafeMainInfo({required this.cafe});

  @override
  Widget build(BuildContext context) {
    final data = getCafeDetailInfo(cafe);
    return Container(
        padding: EdgeInsets.only(left: 20, right: 20, bottom: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CafeName(name: cafe.name, customStyle: CafeNameStyles.mainStyle,),
            SizedBox(height: 4),
            if (hasCafeMetadata(data.hour))
              CafeInfoItem(
                text: data.hour,
                icon: Icons.access_time_rounded,
                margin: EdgeInsets.only(bottom: 4),
              ),
            Container(
                alignment: Alignment.centerRight,
                child: TextInfo(
                    text:
                        "${cafe.metadata?.creator ?? 'jyuunnii'} 님이 올려주신 ${cafe.name}",
                    fontSize: 11))
          ],
        ));
  }
}
