import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';

class CafeImageView extends StatelessWidget {
  final CafeImage image;

  CafeImageView({required this.image});

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

class CafeImageSliderView extends StatefulWidget {
  final List<CafeModel> cafeList;
  final handleCafeSlide;

  CafeImageSliderView({required this.cafeList, required this.handleCafeSlide});

  @override
  _CafeImageSliderState createState() => _CafeImageSliderState();
}

class _CafeImageSliderState extends State<CafeImageSliderView> {
  List<Widget> _images = [];
  final _controller = PageController(initialPage: 0);

  @override
  void initState() {
    super.initState();
    _images = widget.cafeList.map((cafe) {
      return CafeImageView(
        image: GetCafeMainImage.get(cafe),
      );
    }).toList();
  }

  void updateImages() {
    _images = widget.cafeList.map((cafe) {
      return CafeImageView(
        image: GetCafeMainImage.get(cafe),
      );
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    double size = MediaQuery.of(context).size.width;
    updateImages();

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
      itemCount: _images.length,
      itemBuilder: (BuildContext context, int index) {
        return _images[index % _images.length];
      },
      onPageChanged: (index) {
        widget.handleCafeSlide(index);
      },
    );
  }
}

extension GetCafeMainImage on CafeImage {
  static CafeImage get(CafeModel cafe) {
    return cafe.image.list.firstWhere((image) => image.isMain);
  }
}
