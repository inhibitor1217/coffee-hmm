import 'package:flutter/material.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

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
    return Container(
        child: FutureBuilder<CafeListResponse>(
            future: cafeListResponses[currentPlace.id],
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return MainTableCafeList(
                    cafeList: cafeList, onTapped: onTapped);
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

  List<Widget> _buildCafeListTable(int count) => List.generate(
      count,
      (index) =>
          MainTableCafeElement(cafe: cafeList[index], onTapped: onTapped));

  @override
  build(BuildContext context) {
    return Column(children: _buildCafeListTable(cafeList.length));
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
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                    padding: EdgeInsets.only(bottom: 4),
                    child: Text(cafe.name,
                        style: TextStyle(
                            fontSize: 14,
                            color: Color.fromRGBO(0, 75, 141, 1),
                            fontWeight: FontWeight.bold))),
                Container(
                    padding: EdgeInsets.only(bottom: 2),
                    child: Text('OPEN ' + cafe.metadata.hour,
                        style: TextStyle(
                          fontSize: 12,
                        ))),
                Container(
                    child: Text('# ' + cafe.metadata.tag.first,
                        style: TextStyle(
                          fontSize: 11,
                        ))),
                Card(
                    clipBehavior: Clip.antiAlias,
                    child: Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                                child: Container(
                                    padding: EdgeInsets.only(right: 2),
                                    child: CafeImage(
                                        image: cafe.image.mainImage,
                                        size: 112))),
                            Expanded(
                                child: Container(
                                    padding: EdgeInsets.only(right: 2),
                                    child: CafeImage(
                                        image: cafe.image.mainImage,
                                        size: 112))),
                            Expanded(
                                child: Container(
                                    child: CafeImage(
                                        image: cafe.image.mainImage,
                                        size: 112))),
                          ],
                        )))
              ],
            ),
            onTap: () => onTapped(cafe)));
  }
}
