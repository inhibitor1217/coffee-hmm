import 'package:flutter/material.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/cafe_image_slider.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/constants/util.dart';
import 'package:mobile_app/detail_button.dart';
import 'package:mobile_app/header.dart';

class CafeDetailScreen extends StatelessWidget {
  final String cafeId;

  CafeDetailScreen({
    required this.cafeId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: BaseHeader(),
      body: SafeArea(
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [Expanded(child: DetailBody(cafeId: cafeId))])),
    );
  }
}

class DetailBody extends StatefulWidget {
  final String cafeId;

  DetailBody({
    required this.cafeId,
  });

  @override
  _DetailBodyState createState() => _DetailBodyState();
}

class _DetailBodyState extends State<DetailBody> {
  late Future<SingleCafeResponse> _cafeResponse;
  late CafeModel _cafe;
  final PageController _controller = PageController();
  int? currentIndex;

  @override
  void initState() {
    super.initState();

    _cafeResponse = fetchCafe(widget.cafeId);
    _cafeResponse.then((data) {
      setState(() {
        _cafe = data.cafe;
      });
    });
  }

  void handleImageSlide(int index) {
    setState(() {
      currentIndex = index % _cafe.image.count;
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: _cafeResponse,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return _buildContent(context, cafe: _cafe);
          }

          if (snapshot.hasError) {
            return _buildError(context);
          }

          return Center(
              child: CircularProgressIndicator(color: Colors.black12));
        });
  }

  Widget _buildContent(BuildContext context, {required CafeModel cafe}) {
    return Stack(
      children: [
        ListView(
          scrollDirection: Axis.vertical,
          shrinkWrap: true,
          children: [
            CafeImageSlider(
              pageController: _controller,
              imageList: cafe.image.list,
              onSlide: handleImageSlide,
            ),
            ImageIndexBullet(
              totalCount: cafe.image.count,
              currentIndex: currentIndex ?? 0,
            ),
            CafeMinimumInfo(cafe: cafe),
            DetailButtonSet(cafe: cafe),
            SizedBox(height: 50),
          ],
        ),
        Positioned(
          bottom: 0,
          left: 0,
          child: _buildFloatingShareButton(cafe.id),
        )
      ],
    );
  }

  Widget _buildFloatingShareButton(String cafeId) {
    const _highlightedColor = Color.fromRGBO(242, 196, 109, 1);
    const _backgroundColor = Color.fromRGBO(255, 255, 255, 0.9);
    return Container(
      width: MediaQuery.of(context).size.width,
      height: 50,
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(color: _backgroundColor),
      child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            primary: _highlightedColor,
            onPrimary: Colors.white,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(4),
            ),
          ),
          child: Text('카페 공유하기'),
          onPressed: () =>
              handleLinkShareClick('https://www.coffeehmm.com/cafe/$cafeId')),
    );
  }

  Widget _buildError(BuildContext context) {
    return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(Icons.error_rounded, color: Colors.black26, size: 48),
      SizedBox(height: 8),
      Text('카페를 찾을 수 없습니다.',
          style: const TextStyle(color: Colors.black38, fontSize: 14)),
      SizedBox(height: 16),
      ElevatedButton(
        child: Text('돌아가기'),
        onPressed: () {
          Navigator.pop(context);
        },
      ),
    ]));
  }
}
