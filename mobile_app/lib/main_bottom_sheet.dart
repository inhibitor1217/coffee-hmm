import 'package:flutter/material.dart';
import 'package:mobile_app/api/api.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';

class MainBottomSheet extends StatefulWidget {
  final List<CafeModel> hotCafeList;
  final void Function() onClose;

  MainBottomSheet({required this.hotCafeList, required this.onClose});

  @override
  _MainBottomSheetState createState() =>
      _MainBottomSheetState(initialHotCafeList: hotCafeList);
}

class _MainBottomSheetState extends State<MainBottomSheet>
    with EnterCafeDetailMixin {
  final ScrollController _scrollController = ScrollController();
  Future<CafeListResponse>? _hotCafeListResponses;
  List<CafeModel>? _hotCafeList;

  _MainBottomSheetState({required List<CafeModel> initialHotCafeList})
      : _hotCafeList = initialHotCafeList;

  void handleHotCafesClick(int number) {
    _hotCafeListResponses = fetchHotCafeList(number);
    _hotCafeListResponses!.then((data) {
      setState(() {
        _hotCafeList = data.cafe.list;
      });
    });
    _scrollController.animateTo(0,
        duration: Duration(microseconds: 500), curve: Curves.ease);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(
              topRight: Radius.circular(12),
              topLeft: Radius.circular(12),
            )),
        child: Stack(
          children: [
            ListView(children: [
              Container(
                  padding: EdgeInsets.only(top: 38),
                  margin: EdgeInsets.only(left: 20, bottom: 30, right: 20),
                  child: Row(children: [
                    Expanded(
                        child: Row(
                      children: [
                        Text('커피흠 ',
                            style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Palette.highlightedColor)),
                        Text(
                          '핫플레이스 추천',
                          style: TextStyle(fontSize: 14),
                        )
                      ],
                    )),
                    Expanded(
                        child: Container(
                            child: Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                          Text('# 감성 ', style: TextStyle(fontSize: 12)),
                          Text('# 데이트', style: TextStyle(fontSize: 12))
                        ])))
                  ])),
              Container(
                height: 180,
                child: ScrollConfiguration(
                    behavior: ScrollConfiguration.of(context)
                        .copyWith(scrollbars: false),
                    child: SingleChildScrollView(
                        controller: _scrollController,
                        scrollDirection: Axis.horizontal,
                        child: Row(
                            children: List.generate(
                                10,
                                (index) => Container(
                                    margin: EdgeInsets.only(
                                        right: index == 9 ? 20 : 4,
                                        left: index == 0 ? 20 : 0),
                                    child: GestureDetector(
                                      child: RepresentativeCafe(
                                          cafe: (_hotCafeList ??
                                              widget.hotCafeList)[index]),
                                      onTap: enterDetail((_hotCafeList ??
                                          widget.hotCafeList)[index]),
                                    )))))),
              ),
            ]),
            Positioned(
              right: 4,
              top: 0,
              child: IconButton(
                icon: Icon(Icons.close),
                color: Palette.lightGray,
                onPressed: widget.onClose,
              ),
            ),
            Positioned(
                left: 0,
                bottom: 16,
                child: TextButton(
                  style: TextButton.styleFrom(
                      primary: Palette.darkGray,
                      padding: EdgeInsets.symmetric(vertical: 20)),
                  child: SizedBox(
                      width: MediaQuery.of(context).size.width,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          IconButton(
                            icon: Icon(Icons.refresh_rounded),
                            color: Palette.highlightedColor,
                            iconSize: 18,
                            onPressed: () {},
                          ),
                          Text(
                            '새로고침',
                            style: TextStyle(
                                fontSize: 13, color: Palette.darkGray),
                            textAlign: TextAlign.center,
                          ),
                          SizedBox(width: 40, height: 40)
                        ],
                      )),
                  onPressed: () {
                    handleHotCafesClick(10);
                  },
                ))
          ],
        ));
  }
}

class RepresentativeCafe extends StatelessWidget {
  final CafeModel cafe;

  RepresentativeCafe({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Card(
            clipBehavior: Clip.antiAlias,
            elevation: 0,
            margin: EdgeInsets.only(right: 3),
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(4),
                  color: Palette.grayBG),
              child: CafeImage(image: cafe.image.mainImage, size: 100),
            )),
        Container(
            width: 100,
            margin: EdgeInsets.only(top: 8),
            child: Text(cafe.name,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: 12))),
        SizedBox(height: 2),
        Text(cafe.place.name,
            style: TextStyle(fontSize: 11, color: Palette.gray))
      ],
    );
  }
}
