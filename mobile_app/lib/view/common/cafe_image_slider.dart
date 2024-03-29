import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/common/cafe_image.dart';

class CafeImageSlider extends StatefulWidget {
  final PageController pageController;
  final List<CafeImageModel> imageList;
  final ValueChanged<int> onSlide;
  final double? size;

  CafeImageSlider({
    required this.pageController,
    required this.imageList,
    required this.onSlide,
    this.size,
  });

  @override
  _CafeImageSliderState createState() =>
      _CafeImageSliderState(imageList: imageList);
}

class _CafeImageSliderState extends State<CafeImageSlider> {
  final List<CafeImageModel> imageList;

  _CafeImageSliderState({required this.imageList});

  @override
  Widget build(BuildContext context) {
    final _size = widget.size ?? MediaQuery.of(context).size.width;

    return Container(
      height: _size,
      child: Stack(
        children: [
          PageView.builder(
            physics: AlwaysScrollableScrollPhysics(),
            controller: widget.pageController,
            itemBuilder: (BuildContext context, int index) {
              return CafeImage(
                  image: widget.imageList[index % widget.imageList.length],
                  size: _size);
            },
            onPageChanged: (index) {
              widget.onSlide(index);
            },
          )
        ],
      ),
    );
  }
}
