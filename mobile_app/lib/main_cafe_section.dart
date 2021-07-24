import 'package:flutter/material.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/cafe_image_slider.dart';
import 'package:mobile_app/main_button.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainCafeSection extends StatelessWidget {
  final Map<String, Future<CafeListResponse>> cafeListResponse;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;
  final Function onSlide;
  final Function onTapped;

  MainCafeSection(
      {required this.cafeListResponse,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace,
      required this.onSlide,
      required this.onTapped});

  @override
  Widget build(BuildContext context) {
    return Container(
        child: FutureBuilder<CafeListResponse>(
            future: cafeListResponse[currentPlace.id],
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return GestureDetector(
                  child: Column(
                    children: [
                      CafeInfo(cafe: currentCafe),
                      CafeImageSlider(
                        imageList: cafeList
                            .map((cafe) => cafe.image.mainImage)
                            .toList(),
                        handleSlide: onSlide,
                      ),
                      MainButtonSet()
                    ],
                  ),
                  onTap: () => onTapped(currentCafe),
                );
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }
              return Skeleton();
            }));
  }
}
