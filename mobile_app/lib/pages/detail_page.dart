import 'package:flutter/material.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/util/common.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_info.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_location.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_menu.dart';
import 'package:mobile_app/view/common/cafe_image_slider.dart';
import 'package:mobile_app/view/common/error.dart';
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

  @override
  void initState() {
    super.initState();
    _cafeResponse = fetchCafe(widget.cafeId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: DetailHeader(cafeResponse: _cafeResponse),
      body: DetailBody(
        cafeResponse: _cafeResponse,
      ),
    );
  }
}

class DetailBody extends StatefulWidget {
  final Future<SingleCafeResponse> cafeResponse;

  DetailBody({required this.cafeResponse});

  @override
  _DetailBodyState createState() => _DetailBodyState();
}

class _DetailBodyState extends State<DetailBody> {
  late CafeModel? _cafe;

  @override
  void initState() {
    super.initState();

    widget.cafeResponse.then((data) {
      setState(() {
        _cafe = data.cafe;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: widget.cafeResponse,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return SafeArea(
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                  Expanded(child: DetailBodyContent(cafe: _cafe!))
                ]));
          }
          if (snapshot.hasError) {
            return Error(title: '카페를 찾을 수 없습니다.');
          }
          return Center(
              child: CircularProgressIndicator(color: Palette.lightGray));
        });
  }
}

class DetailBodyContent extends StatefulWidget {
  final CafeModel cafe;

  DetailBodyContent({
    required this.cafe,
  });

  @override
  _DetailBodyContentState createState() => _DetailBodyContentState(cafe: cafe);
}

class _DetailBodyContentState extends State<DetailBodyContent> {
  final CafeModel cafe;
  final PageController _controller = PageController();
  int? currentIndex;

  _DetailBodyContentState({required this.cafe});

  void handleImageSlide(int index) {
    setState(() {
      currentIndex = index % cafe.image.count;
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool hasLocation = hasCafeMetadata(cafe.metadata?.location?.lat) &&
        hasCafeMetadata(cafe.metadata?.location?.lng);
    final bool hasMenus = (cafe.metadata?.menus ?? []).length > 0;

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
              if (hasLocation)
                CafeDetailLocation(cafe: cafe),
              if(hasMenus)
                CafeDetailMenus(menus: cafe.metadata!.menus!),
              SizedBox(height: 100),
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
