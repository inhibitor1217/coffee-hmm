import 'package:flutter/material.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/cafe_image_slider.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainSlider extends StatelessWidget {
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;
  final void Function(int) onSlide;
  final ValueChanged<CafeModel> onTappedCafe;

  MainSlider(
      {required this.cafeListResponses,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace,
      required this.onSlide,
      required this.onTappedCafe});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<CafeListResponse>(
        future: cafeListResponses[currentPlace.id],
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return GestureDetector(
              child: Column(
                children: [
                  CafeInfo(cafe: currentCafe),
                  CafeImageSlider(
                    imageList:
                        cafeList.map((cafe) => cafe.image.mainImage).toList(),
                    handleSlide: onSlide,
                  ),
                ],
              ),
              onTap: () => onTappedCafe(currentCafe),
            );
          } else if (!snapshot.hasData) {
            return Container(
                width: MediaQuery.of(context).size.width + 48,
                height: MediaQuery.of(context).size.width);
          } else if (snapshot.hasError) {
            return Text("${snapshot.error}");
          }
          return Skeleton();
        });
  }
}
