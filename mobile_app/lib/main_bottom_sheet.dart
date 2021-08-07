import 'package:flutter/material.dart';

class MainBottomSheet extends StatefulWidget {
  // final PlaceModel currentPlace;
  final void Function() onTapped;

  MainBottomSheet({required this.onTapped});

  @override
  _MainBottomSheetState createState() => _MainBottomSheetState();
}

class _MainBottomSheetState extends State<MainBottomSheet> {
  @override
  Widget build(BuildContext context) {
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
                  margin: EdgeInsets.only(left: 20, bottom: 20, right: 20),
                  child: Row(children: [
                    Expanded(child: Text('핫플레이스 추천')),
                    Expanded(
                        child: Container(
                            child: Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                          Text('# 감성 ', style: TextStyle(fontSize: 11)),
                          Text('# 데이트', style: TextStyle(fontSize: 11))
                        ])))
                  ])),
              Container(
                  height: 160,
                  child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: List.generate(
                          10,
                          (index) => Container(
                              margin: EdgeInsets.only(
                                  right: index == 9 ? 20 : 8,
                                  left: index == 0 ? 20 : 0),
                              child: RepresentativeCafe())))),
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
                  onPressed: widget.onTapped,
                ))
          ],
        ));
  }
}

class RepresentativeCafe extends StatelessWidget {
  // final CafeModel cafe;
  //
  // RepresentativeCafe({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          // FIXME : CafeImage 로 대체
          width: 90,
          height: 90,
          decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(4), color: Colors.black12),
        ),
        Container(
            margin: EdgeInsets.only(top: 10, bottom: 2),
            child: Text('동네이름', style: TextStyle(fontSize: 12))),
        Text('카페이름', style: TextStyle(fontSize: 12, color: Colors.black45))
      ],
    );
  }
}
