import 'package:flutter/material.dart';
import 'package:mobile_app/cafe.dart';
import 'package:mobile_app/cafe_image_slider.dart';
import 'package:mobile_app/detail_button.dart';
import 'package:mobile_app/header.dart';
import 'package:mobile_app/type.dart';

class CafeDetailPage extends Page {
  final CafeModel cafe;

  CafeDetailPage({required this.cafe});

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
        settings: this,
        builder: (BuildContext context) {
          return CafeDetailScreen(cafe: cafe);
        });
  }
}

class CafeDetailScreen extends StatelessWidget {
  final CafeModel cafe;

  CafeDetailScreen({
    required this.cafe,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: DetailHeader(), body: DetailBody(cafe: cafe));
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
  CafeModel cafe;
  int? currentIndex;

  _DetailBodyState({required this.cafe});

  void handleImageSlide(int index) {
    setState(() {
      currentIndex = index % cafe.image.count;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CafeImageSlider(
          imageList: cafe.image.list,
          handleSlide: handleImageSlide,
        ),
        ImageIndexBullet(
          totalCount: cafe.image.count,
          currentIndex: currentIndex ?? 0,
        ),
        CafeMinimumInfo(cafe: cafe),
        DetailButtonSet(cafeId: cafe.id),
      ],
    );
  }
}
