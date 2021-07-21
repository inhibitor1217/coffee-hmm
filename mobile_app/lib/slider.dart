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
      onPageChanged: (index) {},
    );
  }
}
