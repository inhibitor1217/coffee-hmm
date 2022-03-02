import 'package:mobile_app/constants/type.dart';

mixin CafeOperationStatus {
  final close = '영업종료';
  final open = '영업중';

  String? getCafeOperationStatus(CafeMetaOperationHoursModel? hours) {
    if(hours == null) return null;

    final _now = DateTime.now();

    if(_now.hour < hours.open.hour || _now.hour > hours.close.hour){
      return close;
    }else if(_now.hour == hours.close.hour && _now.minute > hours.close.minute){
      return close;
    }else if(_now.hour == hours.open.hour && _now.minute < hours.open.minute){
      return close;
    } else {
      return open;
    }
  }
}
