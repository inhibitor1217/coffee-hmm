import 'package:mobile_app/constants/type.dart';

extension TimeFormatter on String {
  CafeMetaOperationHoursModel? createOperationHours(){
    final List<String> _operationHours = this.split(' ~ ');

    if(_operationHours.length < 2 ) return null;

    return CafeMetaOperationHoursModel(
      open: _operationHours[0].stringToDateTime(),
      close: _operationHours[1].stringToDateTime(),
    );
  }

  DateTime stringToDateTime(){
    return DateTime.parse('0000-00-00T' + this);
  }
}