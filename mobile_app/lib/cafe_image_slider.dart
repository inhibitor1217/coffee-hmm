import 'package:flutter/material.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/type.dart';

class CafeImageSlider extends StatefulWidget {
  final List<CafeImageModel> imageList;
  final handleSlide;

  CafeImageSlider({required this.imageList, required this.handleSlide});

  @override
  _CafeImageSliderState createState() =>
      _CafeImageSliderState(imageList: imageList);
}

class _CafeImageSliderState extends State<CafeImageSlider> {
  final List<CafeImageModel> imageList;
  final _controller = PageController();

  _CafeImageSliderState({required this.imageList});

  @override
  Widget build(BuildContext context) {
    double size = MediaQuery.of(context).size.width;

    return Container(
      height: size,
      child: Stack(
        children: [_buildImageSlider()],
      ),
    );
  }

  Widget _buildImageSlider() {
    double size = MediaQuery.of(context).size.width;
    return PageView.builder(
      physics: AlwaysScrollableScrollPhysics(),
      controller: _controller,
      itemBuilder: (BuildContext context, int index) {
        return CafeImage(
            image: widget.imageList[index % widget.imageList.length],
            size: size);
      },
      onPageChanged: (index) {
        widget.handleSlide(index);
      },
    );
  }
}

class ImageIndexBullet extends StatelessWidget {
  final int totalCount;
  final int currentIndex;

  ImageIndexBullet({required this.totalCount, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Container(
        margin: EdgeInsets.symmetric(vertical: 12),
        child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: List.generate(totalCount,
                (index) => Bullet(isHighlight: currentIndex == index))));
  }
}

class Bullet extends StatelessWidget {
  final bool isHighlight;

  Bullet({required this.isHighlight});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(right: 8),
      width: 6,
      height: 6,
      decoration: BoxDecoration(
        color: isHighlight ? Colors.black45 : Colors.black12,
        borderRadius: BorderRadius.circular(50),
      ),
    );
  }
}
