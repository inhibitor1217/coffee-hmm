import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';

LatLng createLatLng(CafeMetaLocationModel location){
  return LatLng(
      double.parse(location.lat!),
      double.parse(location.lng!));
}

LatLng getLocation(CafeModel? cafe){
  final defaultLocation = LatLng(37.49787584814758, 127.02769584933382); // FIXME : place pivot point
  if(cafe == null) return defaultLocation;

  final bool hasLocation = hasCafeMetadata(cafe.metadata?.location?.lat) &&
      hasCafeMetadata(cafe.metadata?.location?.lng);

  if(hasLocation){
    return createLatLng(cafe.metadata!.location!);
  }
  return defaultLocation;
}