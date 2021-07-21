import 'package:flutter/material.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/type.dart';

class CafeImageSlider extends StatefulWidget {
  final List<CafeModel>? cafeList;
  final CafeModel? cafe;
  final handleSlide;

  CafeImageSlider({this.cafeList, this.cafe, required this.handleSlide});

  @override
  _CafeImageSliderState createState() => _CafeImageSliderState(
        isDetail: cafe != null,
      );
}

class _CafeImageSliderState extends State<CafeImageSlider> {
  final bool isDetail;
  final _controller = PageController();

  _CafeImageSliderState({required this.isDetail});

  @override
  Widget build(BuildContext context) {
    double size = MediaQuery.of(context).size.width;

    return Container(
      height: size,
      child: Stack(
        children: [
          isDetail ? _buildCafeImageSlider() : _buildCafeMainImageSlider(),
        ],
      ),
    );
  }

  Widget _buildCafeMainImageSlider() {
    return PageView.builder(
      physics: AlwaysScrollableScrollPhysics(),
      controller: _controller,
      itemBuilder: (BuildContext context, int index) {
        return CafeImage(
            image: widget
                .cafeList![index % widget.cafeList!.length].image.mainImage);
      },
      onPageChanged: (index) {
        widget.handleSlide(index);
      },
    );
  }

  Widget _buildCafeImageSlider() {
    return PageView.builder(
      physics: AlwaysScrollableScrollPhysics(),
      controller: _controller,
      itemBuilder: (BuildContext context, int index) {
        return CafeImage(
            image: widget.cafe!.image.list[index % widget.cafe!.image.count]);
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
