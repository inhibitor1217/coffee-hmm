import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/common/cafe_info_item.dart';
import 'package:mobile_app/view/common/cafe_operation_status.dart';

class CafeDetailInfoTimeItem extends StatelessWidget with CafeOperationStatus {
  final String displayTime;
  final CafeMetaHoursModel hours;

  CafeDetailInfoTimeItem({ required this.displayTime, required this.hours });

  @override
  Widget build(BuildContext context){
    final int _today = DateTime.now().weekday;
    final CafeMetaOperationHoursModel? _operationHours = _today < 6 ?  hours.weekday : hours.weekend;
    final String? _operationStatus = getCafeOperationStatus(_operationHours);
    
    return  Container(
      margin: EdgeInsets.only(bottom: 18),
      child: Row(
        children: [
          Icon(
            Icons.access_time_rounded,
            size: 15,
            color: Palette.highlightedColor,
          ),
          SizedBox(width: 6),
          if(_operationStatus != null )
            Row(
              children: [
                Text(_operationStatus ?? '',
                    style: TextStyle(
                      fontSize: 13,
                      color: _operationStatus == open ? Palette.green : Palette.gray,
                    )
                ),
                SizedBox(width: 4),
                Text(String.fromCharCode(0X2022),
                    style: TextStyle(color: Palette.gray)
                ),
                SizedBox(width: 4),
              ],
            ),
          Text(displayTime),
        ],
      ),
    );
  }
}




