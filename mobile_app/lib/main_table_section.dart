import 'package:flutter/material.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';
import 'package:mobile_app/util.dart';

class MainTable extends StatelessWidget {
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final List<CafeModel> cafeList;
  final CafeModel currentCafe;
  final PlaceModel currentPlace;
  final ValueChanged<CafeModel> onTappedCafe;

  MainTable(
      {required this.cafeListResponses,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace,
      required this.onTappedCafe});

  @override
  Widget build(BuildContext context) {
    /* FIXME: 백엔드에서 처리하도록 수정 */
    List<CafeModel> cafes = List.from(cafeList)
      ..removeWhere((cafe) => cafe.image.count < 4);

    return Container(
        margin: EdgeInsets.only(bottom: 48),
        child: FutureBuilder<CafeListResponse>(
            future: cafeListResponses[currentPlace.id],
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return MainTableCafeList(
                    cafeList: cafes, onTappedCafe: onTappedCafe);
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }
              return Skeleton();
            }));
  }
}

class MainTableCafeList extends StatelessWidget {
  final List<CafeModel> cafeList;
  final ValueChanged<CafeModel> onTappedCafe;

  MainTableCafeList({required this.cafeList, required this.onTappedCafe});

  @override
  build(BuildContext context) {
    return Column(
        children: List.generate(
            cafeList.length,
            (index) => Column(children: [
                  MainTableCafeElement(
                      cafe: cafeList[index], onTappedCafe: onTappedCafe),
                  if (index < cafeList.length - 1)
                    Container(
                      height: 8,
                      decoration: BoxDecoration(
                          color: Color.fromRGBO(242, 242, 242, 1)),
                    )
                ])));
  }
}

class MainTableCafeElement extends StatelessWidget {
  final CafeModel cafe;
  final ValueChanged<CafeModel> onTappedCafe;

  MainTableCafeElement({required this.cafe, required this.onTappedCafe});

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
                        Text(cafe.name,
                            style: TextStyle(
                                fontSize: 15, fontWeight: FontWeight.bold)),
                        Spacer(),
                        if (cafe.image.count > 8)
                          Text(
                            '커피흠 추천',
                            style: TextStyle(
                                color: Color.fromRGBO(155, 218, 218, 1),
                                fontWeight: FontWeight.bold,
                                fontSize: 14),
                          )
                      ],
                    ),
                    Container(
                        margin: EdgeInsets.only(top: 4, bottom: 2),
                        child: Text('OPEN ' + cafe.metadata.hour,
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
                                    image: cafe.image.mainImage, size: 112)),
                            Expanded(
                                child: CafeImage(
                                    image: cafe.image.basicImages[0],
                                    size: 112)),
                            Expanded(
                                child: Container(
                                    child: CafeImage(
                                        image: cafe.image.basicImages[1],
                                        size: 112))),
                          ],
                          separator: SizedBox(width: 2),
                        ).toList())))
              ],
            ),
            onTap: () => onTappedCafe(cafe)));
  }
}