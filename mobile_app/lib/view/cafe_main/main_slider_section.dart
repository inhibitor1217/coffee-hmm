import 'package:flutter/material.dart';
import 'package:mobile_app/constants/size.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/view/cafe_main/cafe_main_info.dart';
import 'package:mobile_app/view/common/cafe_image_slider.dart';
import 'package:mobile_app/view/common/skeleton.dart';

class MainSlider extends StatefulWidget {
  final PageController pageController;
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;
  final void Function(int) onSlide;

  MainSlider({
    required this.pageController,
    required this.cafeListResponses,
    required this.cafeList,
    required this.currentCafe,
    required this.currentPlace,
    required this.onSlide,
  });

  @override
  _MainSliderState createState() => _MainSliderState();
}

class _MainSliderState extends State<MainSlider> with EnterCafeDetailMixin {
  @override
  Widget build(BuildContext context) {
    final _displayWidth = MediaQuery.of(context).size.width;
    final _displayHeight = MediaQuery.of(context).size.height;


    return FutureBuilder<CafeListResponse>(
        future: widget.cafeListResponses[widget.currentPlace.id],
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return GestureDetector(
              child: Column(
                children: [
                  CafeMainInfo(cafe: widget.currentCafe),
                  CafeImageSlider(
                    pageController: widget.pageController,
                    imageList: widget.cafeList
                        .map((cafe) => cafe.image.mainImage)
                        .toList(),
                    onSlide: widget.onSlide,
                    size: _displayHeight < LengthwiseDisplayMinimum ? _displayWidth : _displayWidth * 4/3,
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
        });
  }
}
