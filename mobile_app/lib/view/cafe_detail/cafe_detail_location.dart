import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_section_title.dart';
import 'package:mobile_app/view/common/map.dart';

class CafeDetailLocation extends StatelessWidget {
  final CafeModel cafe;

  CafeDetailLocation({required this.cafe});

  @override
  Widget build(BuildContext context){
    return Container(
        alignment: Alignment.centerLeft,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 56),
            CafeDetailSectionTitle(title: '카페 가는 길'),
            Map(
                location: LatLng(
                    double.parse(cafe.metadata!.location!.lat!),
                    double.parse(cafe.metadata!.location!.lng!)),
                title: cafe.name,
                height: 220)
          ],
       )
    );
  }
}
