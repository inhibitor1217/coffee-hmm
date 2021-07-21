import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';

class CafeImage extends StatelessWidget {
  final CafeImageModel image;

  CafeImage({required this.image});

  @override
  Widget build(BuildContext context) {
    double size = MediaQuery.of(context).size.width;
    return Container(
      height: size,
      child: CachedNetworkImage(
        imageUrl: image.relativeUri,
        fit: BoxFit.cover,
        progressIndicatorBuilder: (context, url, downloadProgress) {
          return Center(
              child: CircularProgressIndicator(
                  color: Colors.black12, value: downloadProgress.progress));
        },
        errorWidget: (context, error, stackTrace) {
          return Center(child: Text('no image'));
        },
      ),
    );
  }
}

class CafeImageSlider extends StatefulWidget {
  final List<CafeModel> cafeList;
  final handleCafeSlide;

  CafeImageSlider({required this.cafeList, required this.handleCafeSlide});

  @override
  _CafeImageSliderState createState() => _CafeImageSliderState();
}

class _CafeImageSliderState extends State<CafeImageSlider> {
  final _controller = PageController(initialPage: 0);

  @override
  Widget build(BuildContext context) {
    double size = MediaQuery.of(context).size.width;

    return Container(
      height: size,
      child: Stack(
        children: [
          _buildCafeImageSlider(),
        ],
      ),
    );
  }

  Widget _buildCafeImageSlider() {
    return PageView.builder(
      physics: AlwaysScrollableScrollPhysics(),
      controller: _controller,
      itemCount: widget.cafeList.length,
      itemBuilder: (BuildContext context, int index) {
        return CafeImage(
            image: widget
                .cafeList[index % widget.cafeList.length].image.mainImage);
      },
      onPageChanged: (index) {
        widget.handleCafeSlide(index);
      },
    );
  }
}
