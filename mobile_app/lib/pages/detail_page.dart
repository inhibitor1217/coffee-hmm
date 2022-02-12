import 'package:flutter/material.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_body_content.dart';
import 'package:mobile_app/view/common/error.dart';
import 'package:mobile_app/view/common/header.dart';

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
                  Expanded(
                    child: DetailBodyContent(cafe: _cafe!)
                  )
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

