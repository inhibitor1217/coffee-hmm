import 'package:mobile_app/constants/type.dart';

extension TimeFormatter on String {
  CafeMetaOperationHoursModel? createOperationHours(){
    final List<String> _operationHours = this.split(' ~ ');

    if(_operationHours.length < 2 ) return null;

    return CafeMetaOperationHoursModel(
      open: stringToDateTime(_operationHours[0]),
      close: stringToDateTime(_operationHours[1]),
    );
  }

  DateTime stringToDateTime(String value){
    return DateTime.parse('0000-00-00T' + value);
  }
}