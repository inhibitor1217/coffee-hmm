import 'package:mobile_app/constants/type.dart';

mixin CafeOperationStatus {
  final close = '영업종료';
  final open = '영업중';

  String? getCafeOperationStatus(String? hours) {
    if(hours == null) return null;

    final List<String> _operationHours = hours.split(' ~ ');

    if(_operationHours.length < 2 ) return null;
    
    final _now = DateTime.now();
    final _formattedHours = _CafeOperationTime(
      open: DateTime.parse('0000-00-00T' + _operationHours[0]),
      close: DateTime.parse('0000-00-00T' + _operationHours[1]),
    );

    if(_now.hour < _formattedHours.open.hour || _now.hour > _formattedHours.close.hour){
      return close;
    }else if(_now.hour == _formattedHours.close.hour && _now.minute > _formattedHours.close.minute){
      return close;
    }else {
      return open;
    }
  }
}


class _CafeOperationTime {
  final DateTime open;
  final DateTime close;

  _CafeOperationTime({required this.open, required this.close});
}
