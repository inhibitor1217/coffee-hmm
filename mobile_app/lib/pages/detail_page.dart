import 'package:flutter/material.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/common.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_info.dart';
import 'package:mobile_app/view/common/cafe_image_slider.dart';
import 'package:mobile_app/view/common/floating_button.dart';
import 'package:mobile_app/view/common/header.dart';
import 'package:mobile_app/view/common/image_index_bullet.dart';

class CafeDetailScreen extends StatefulWidget {
  final String cafeId;

  CafeDetailScreen({required this.cafeId});

  @override
  _CafeDetailScreenState createState() => _CafeDetailScreenState();
}

class _CafeDetailScreenState extends State<CafeDetailScreen> {
  late Future<SingleCafeResponse> _cafeResponse;
  late CafeModel _cafe;

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
          preferredSize: const Size.fromHeight(48),
          child: FutureBuilder(
              future: _cafeResponse,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return DetailHeader(title: _cafe.name);
                }
                if (snapshot.hasError) {
                  return _buildError(context);
                }
                return BaseHeader();
              })),
      body: FutureBuilder(
          future: _cafeResponse,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return _buildBody(context, cafe: _cafe);
            }
            if (snapshot.hasError) {
              return _buildError(context);
            }
            return Center(
                child: CircularProgressIndicator(color: Palette.lightGray));
          }),
    );
  }

  Widget _buildBody(BuildContext context, {required CafeModel cafe}) {
    return SafeArea(
        child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [Expanded(child: DetailBody(cafe: cafe))]));
  }

  Widget _buildError(BuildContext context) {
    return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(Icons.error_rounded, color: Palette.lightGray, size: 48),
      SizedBox(height: 8),
      Text('카페를 찾을 수 없습니다.',
          style: TextStyle(color: Palette.gray, fontSize: 14)),
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

class DetailBody extends StatefulWidget {
  final CafeModel cafe;

  DetailBody({
    required this.cafe,
  });

  @override
  _DetailBodyState createState() => _DetailBodyState(cafe: cafe);
}

class _DetailBodyState extends State<DetailBody> {
  final CafeModel cafe;
  final PageController _controller = PageController();
  int? currentIndex;

  _DetailBodyState({required this.cafe});

  void handleImageSlide(int index) {
    setState(() {
      currentIndex = index % cafe.image.count;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ScrollConfiguration(
          behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
          child: ListView(
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
              CafeDetailInfo(cafe: cafe),
              SizedBox(height: 60),
            ],
          ),
        ),
        Positioned(
          bottom: 0,
          left: 0,
          child: FloatingButton(
            title: '카페 공유하기',
            onPressed: () => handleLinkShareClick(
                'https://www.coffeehmm.com/cafe/${cafe.id}'),
          ),
        )
      ],
    );
  }
}
