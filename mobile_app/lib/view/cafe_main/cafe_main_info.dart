import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/view/common/cafe_name.dart';
import 'package:mobile_app/view/common/cafe_operation_status.dart';
import 'package:mobile_app/view/common/text_info.dart';

class CafeMainInfo extends StatelessWidget with CafeOperationStatus {
  final CafeModel cafe;

  CafeMainInfo({required this.cafe});

  @override
  Widget build(BuildContext context) {
    final _data = getCafeDetailInfo(cafe);
    final int _today = DateTime.now().weekday;
    final CafeMetaOperationHoursModel? _operationHours = _today < 6 ?  cafe.metadata?.hours?.weekday : cafe.metadata?.hours?.weekend;
    final String? _operationStatus = getCafeOperationStatus(_operationHours);

    return Container(
        padding: EdgeInsets.only(left: 20, right: 20, bottom: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CafeName(name: cafe.name, customStyle: CafeNameStyles.mainStyle,),
            SizedBox(height: 4),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                TextInfo(
                    text: "${cafe.metadata?.creator ?? 'jyuunnii'} 님이 올려주신 ${cafe.name}",
                    fontSize: 12
                ),
                if (hasCafeMetadata(_data.hour) && _operationStatus != null)
                  Text(_operationStatus,
                      style: TextStyle(
                        fontSize: 12,
                        color: _operationStatus == open ? Palette.green : Palette.gray,
                      )
                  ),
              ],
            )
          ],
        ));
  }
}
