import 'package:flutter/material.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/util/common.dart';
import 'package:mobile_app/view/common/badge.dart';
import 'package:mobile_app/view/common/cafe_image.dart';
import 'package:mobile_app/view/common/cafe_info_item.dart';
import 'package:mobile_app/view/common/cafe_name.dart';
import 'package:mobile_app/view/common/skeleton.dart';

class MainTable extends StatefulWidget {
  final ScrollController scrollController;
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;

  MainTable(
      {required this.scrollController,
      required this.cafeListResponses,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace});

  @override
  _MainTableState createState() => _MainTableState();
}

class _MainTableState extends State<MainTable> {
  @override
  Widget build(BuildContext context) {
    List<CafeModel> cafes = List.from(widget.cafeList)
      ..removeWhere((cafe) => cafe.image.count < 3);

    return Container(
        child: FutureBuilder<CafeListResponse>(
            future: widget.cafeListResponses[widget.currentPlace.id],
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return MainTableCafeList(
                    cafeList: cafes, scrollController: widget.scrollController);
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }
              return Skeleton();
            }));
  }
}

class MainTableCafeList extends StatelessWidget {
  final ScrollController scrollController;

  final List<CafeModel> cafeList;

  MainTableCafeList({required this.scrollController, required this.cafeList});

  @override
  build(BuildContext context) {
    return ScrollConfiguration(
        behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
        child: ListView.builder(
            controller: scrollController,
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemCount: cafeList.length,
            itemBuilder: (context, index) {
              return Column(children: [
                MainTableCafeElement(cafe: cafeList[index]),
              ]);
            }));
  }
}

class MainTableCafeElement extends StatefulWidget {
  final CafeModel cafe;

  MainTableCafeElement({required this.cafe});

  @override
  _MainTableCafeElementState createState() => _MainTableCafeElementState();
}

class _MainTableCafeElementState extends State<MainTableCafeElement>
    with EnterCafeDetailMixin {
  @override
  Widget build(BuildContext context) {
    final data = getCafeDetailInfo(widget.cafe);

    return Container(
        height: 200,
        padding: EdgeInsets.symmetric(horizontal: 10),
        alignment: Alignment.centerLeft,
        child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        CafeName(name: widget.cafe.name, customStyle: CafeNameStyles.mainStyle,),
                        Spacer(),
                        if (widget.cafe.image.count > 8)
                          Badge(
                            text: '추천해요',
                            size: BadgeSize.big,
                            customSpec: BadgeCustomSpec(backgroundColor: Palette.lightBlue, textColor: Palette.blue)
                          )
                      ],
                    ),
                    if (hasCafeMetadata(data.hour))
                      CafeInfoItem(
                        text: data.hour,
                        icon: Icons.access_time_rounded,
                        margin: EdgeInsets.only(top: 4, bottom: 2),
                      )
                  ],
                ),
                /* 테이블 뷰 모드에서는 등록된 이미지가 3개 이상인 카페만 표시 */
                Card(
                    clipBehavior: Clip.antiAlias,
                    child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                            children: ListUtils.join(
                          [
                            Expanded(
                                child: CafeImage(
                                    image: widget.cafe.image.mainImage,
                                    size: 112)),
                            Expanded(
                                child: CafeImage(
                                    image: widget.cafe.image.basicImages[0],
                                    size: 112)),
                            Expanded(
                                child: Container(
                                    child: CafeImage(
                                        image: widget.cafe.image.basicImages[1],
                                        size: 112))),
                          ],
                          separator: SizedBox(width: 2),
                        ).toList())))
              ],
            ),
            onTap: enterDetail(widget.cafe)));
  }
}
