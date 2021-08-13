import 'package:flutter/material.dart';
import 'package:mobile_app/api.dart';
import 'package:mobile_app/cafe_image.dart';
import 'package:mobile_app/skeleton.dart';
import 'package:mobile_app/type.dart';

class MainBottomSheet extends StatefulWidget {
  final void Function() onClose;
  final ValueChanged<CafeModel> onTappedCafe;

  MainBottomSheet({required this.onClose, required this.onTappedCafe});

  @override
  _MainBottomSheetState createState() => _MainBottomSheetState();
}

class _MainBottomSheetState extends State<MainBottomSheet> {
  Future<CafeListResponse>? _cafeListResponses;
  List<CafeModel>? _cafeList;

  @override
  void initState() {
    super.initState();
    _cafeListResponses = fetchCafeListRecommended(10);
    _cafeListResponses!.then((data) {
      setState(() {
        _cafeList = data.cafe.list;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<CafeListResponse>(
        future: _cafeListResponses,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return Container(
                padding: EdgeInsets.symmetric(vertical: 20),
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
                          margin:
                              EdgeInsets.only(left: 20, bottom: 20, right: 20),
                          child: Row(children: [
                            Expanded(
                                child: Row(
                              children: [
                                Text('커피흠 ',
                                    style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color:
                                            Color.fromRGBO(155, 218, 218, 1))),
                                Text(
                                  '핫플레이스 추천',
                                  style: TextStyle(fontSize: 14),
                                )
                              ],
                            )),
                            Expanded(
                                child: Container(
                                    child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.end,
                                        children: [
                                  Text('# 감성 ', style: TextStyle(fontSize: 12)),
                                  Text('# 데이트', style: TextStyle(fontSize: 12))
                                ])))
                          ])),
                      Container(
                          height: 180,
                          child: ListView(
                              scrollDirection: Axis.horizontal,
                              children: List.generate(
                                  10,
                                  (index) => Container(
                                      margin: EdgeInsets.only(
                                          right: index == 9 ? 20 : 4,
                                          left: index == 0 ? 20 : 0),
                                      child: GestureDetector(
                                        child: RepresentativeCafe(
                                            cafe: _cafeList![index]),
                                        onTap: () => widget
                                            .onTappedCafe(_cafeList![index]),
                                      ))))),
                    ]),
                    Positioned(
                        left: 0,
                        bottom: 0,
                        child: TextButton(
                          style: TextButton.styleFrom(
                              primary: Colors.black87,
                              padding: EdgeInsets.symmetric(vertical: 20)),
                          child: SizedBox(
                              width: MediaQuery.of(context).size.width,
                              child: Text(
                                '닫기',
                                style: TextStyle(fontSize: 14),
                                textAlign: TextAlign.center,
                              )),
                          onPressed: widget.onClose,
                        ))
                  ],
                ));
          } else if (!snapshot.hasData) {
            return Container(
                width: MediaQuery.of(context).size.width, height: 120);
          } else if (snapshot.hasError) {
            return Text("${snapshot.error}");
          }
          return Skeleton();
        });
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
            margin: EdgeInsets.only(right: 3),
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(4),
                  color: Color.fromRGBO(242, 242, 242, 1)),
              child: CafeImage(image: cafe.image.mainImage, size: 100),
            )),
        Container(
            width: 100,
            margin: EdgeInsets.only(top: 4),
            child: Text(cafe.name,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: 13))),
        Text(cafe.place.name,
            style: TextStyle(fontSize: 13, color: Colors.black45))
      ],
    );
  }
}
