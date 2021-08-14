import 'package:flutter/material.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/cafe_image_slider.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainSlider extends StatefulWidget {
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;
  final void Function(int) onSlide;

  MainSlider(
      {required this.cafeListResponses,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace,
      required this.onSlide});

  @override
  _MainSliderState createState() => _MainSliderState();
}

class _MainSliderState extends State<MainSlider> with EnterCafeDetailMixin {
  @override
  Widget build(BuildContext context) {
    return Container(
        child: FutureBuilder<CafeListResponse>(
            future: widget.cafeListResponses[widget.currentPlace.id],
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return GestureDetector(
                  child: Column(
                    children: [
                      CafeInfo(cafe: widget.currentCafe),
                      CafeImageSlider(
                        imageList: widget.cafeList
                            .map((cafe) => cafe.image.mainImage)
                            .toList(),
                        handleSlide: widget.onSlide,
                      ),
                    ],
                  ),
                  onTap: enterDetail(widget.currentCafe),
                );
              } else if (!snapshot.hasData) {
                return Container(
                    width: MediaQuery.of(context).size.width + 48,
                    height: MediaQuery.of(context).size.width);
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }
              return Skeleton();
            }));
  }
}
