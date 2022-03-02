import 'package:mobile_app/constants/type.dart';

bool hasCafeMetadata(dynamic data) {
  return data != null && data != '' && data != {};
}

dynamic getCafeMetadataPlainText(dynamic data) {
  if (data == null || data == '' || data.length == 0) return null;
  return data;
}

String? getCafeMetadataHours(CafeMetaHoursModel? hours) {
  final _weekday = hours?.weekday;
  final _weekend = hours?.weekend;
  final _weekdayStr = hours?.weekdayStr;
  final _weekendStr = hours?.weekendStr;

  if (_weekday == null && _weekend == null) return null;

  if (_weekday?.close == _weekend?.close && _weekday?.open == _weekend?.open) {
    return '평일/주말 $_weekdayStr';
  }

  final _weekdayMeta = hasCafeMetadata(_weekdayStr) ? '평일 $_weekdayStr ' : '';
  final _weekendMeta = hasCafeMetadata(_weekendStr) ? '주말 $_weekendStr' : '';

  return '$_weekdayMeta$_weekendMeta';
}

CafeDetailInfoModel getCafeDetailInfo(CafeModel cafe) {
  return CafeDetailInfoModel(
      hour: getCafeMetadataHours(cafe.metadata?.hours) ?? '',
      address: getCafeMetadataPlainText(cafe.metadata?.location?.address) ?? '',
      line:
          getCafeMetadataPlainText(cafe.metadata?.location?.subway?.line) ?? [],
      station:
          getCafeMetadataPlainText(cafe.metadata?.location?.subway?.station) ??
              '',
      call: getCafeMetadataPlainText(cafe.metadata?.call) ?? '');
}
