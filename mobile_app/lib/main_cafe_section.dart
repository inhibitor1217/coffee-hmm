import 'package:flutter/material.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/cafe_image_slider.dart';
import 'package:mobile_app/main_button.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainCafeSection extends StatelessWidget {
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;
  final void Function(int) onSlide;
  final void Function(CafeModel) onTapped;

  MainCafeSection(
      {required this.cafeListResponses,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace,
      required this.onSlide,
      required this.onTapped});

  @override
  Widget build(BuildContext context) {
    return Container(
        child: FutureBuilder<CafeListResponse>(
            future: cafeListResponses[currentPlace.id],
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return Column(children: [
                  GestureDetector(
                    child: Column(
                      children: [
                        CafeInfo(cafe: currentCafe),
                        CafeImageSlider(
                          imageList: cafeList
                              .map((cafe) => cafe.image.mainImage)
                              .toList(),
                          handleSlide: onSlide,
                        ),
                      ],
                    ),
                    onTap: () => onTapped(currentCafe),
                  ),
                  MainButtonSet()
                ]);
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }
              return Skeleton();
            }));
  }
}
