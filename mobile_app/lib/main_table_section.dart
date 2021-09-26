import 'package:flutter/material.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/constants/color.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/constants/util.dart';
import 'package:mobile_app/router/mixins/enter_cafe_detail_mixin.dart';
import 'package:mobile_app/skeleton.dart';

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
                if (index < cafeList.length - 1)
                  Container(
                    height: 8,
                    decoration: BoxDecoration(color: Palette.grayBG),
                  )
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
    return Container(
        height: 200,
        padding: EdgeInsets.symmetric(horizontal: 20),
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
                        Text(widget.cafe.name,
                            style: TextStyle(
                                fontSize: 14, fontWeight: FontWeight.bold)),
                        Spacer(),
                        if (widget.cafe.image.count > 8)
                          Text(
                            '추천',
                            style: TextStyle(
                                color: Palette.highlightedColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 12),
                          )
                      ],
                    ),
                    Container(
                        margin: EdgeInsets.only(top: 4, bottom: 2),
                        child:
                            Text('OPEN ' + (widget.cafe.metadata?.hour ?? ''),
                                style: TextStyle(
                                  fontSize: 13,
                                )))
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
