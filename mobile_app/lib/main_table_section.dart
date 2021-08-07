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
  final void Function(CafeModel) onTapped;

  MainTable(
      {required this.cafeListResponses,
      required this.cafeList,
      required this.currentCafe,
      required this.currentPlace,
      required this.onTapped});

  @override
  Widget build(BuildContext context) {
    List<CafeModel> cafes = List.from(cafeList)
      ..removeWhere((cafe) => cafe.image.count < 4);

    return Container(
        margin: EdgeInsets.only(bottom: 48),
        child: FutureBuilder<CafeListResponse>(
            future: cafeListResponses[currentPlace.id],
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return MainTableCafeList(cafeList: cafes, onTapped: onTapped);
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }
              return Skeleton();
            }));
  }
}

class MainTableCafeList extends StatelessWidget {
  final List<CafeModel> cafeList;
  final void Function(CafeModel) onTapped;

  MainTableCafeList({required this.cafeList, required this.onTapped});

  @override
  build(BuildContext context) {
    return Column(
        children: List.generate(
            cafeList.length,
            (index) => Column(children: [
                  MainTableCafeElement(
                      cafe: cafeList[index], onTapped: onTapped),
                  Visibility(
                      visible: index < cafeList.length - 1 ? true : false,
                      child: Container(
                        height: 8,
                        decoration: BoxDecoration(
                            color: Color.fromRGBO(242, 242, 242, 1)),
                      ))
                ])));
  }
}

class MainTableCafeElement extends StatelessWidget {
  final CafeModel cafe;
  final void Function(CafeModel) onTapped;

  MainTableCafeElement({required this.cafe, required this.onTapped});

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
                Container(
                    padding: EdgeInsets.only(bottom: 4),
                    child: Text(cafe.name,
                        style: TextStyle(
                            fontSize: 15, fontWeight: FontWeight.bold))),
                Container(
                    padding: EdgeInsets.only(bottom: 2),
                    child: Text('OPEN ' + cafe.metadata.hour,
                        style: TextStyle(
                          fontSize: 13,
                        ))),
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
                                    image: cafe.image.list[1], size: 112)),
                            Expanded(
                                child: Container(
                                    child: CafeImage(
                                        image: cafe.image.list[2], size: 112))),
                          ],
                          separator: SizedBox(width: 2),
                        ).toList())))
              ],
            ),
            onTap: () => onTapped(cafe)));
  }
}
