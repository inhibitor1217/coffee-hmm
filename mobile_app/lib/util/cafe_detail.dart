import 'package:mobile_app/constants/type.dart';

bool hasCafeMetadata(dynamic data) {
  return data != null && data != '' && data != {};
}

dynamic getCafeMetadataPlainText(dynamic data) {
  if (data == null || data == '' || data.length == 0) return null;
  return data;
}

String? getCafeMetadataHours(CafeMetaHoursModel? hours) {
  final weekday = hours?.weekday;
  final weekend = hours?.weekend;

  if (weekday == null && weekend == null) return null;

  if (weekday == weekend) {
    return '평일/주말 $weekday';
  }

  final _weekday = hasCafeMetadata(weekday) ? '평일 $weekday ' : '';
  final _weekend = hasCafeMetadata(weekend) ? '주말 $weekend' : '';

  return '$_weekday$_weekend';
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
