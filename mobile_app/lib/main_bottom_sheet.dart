import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';

class MainBottomSheetController extends StatelessWidget {
  final double backgroundOpacity;
  final AnimationController controller;
  final List<CafeModel> cafeList;
  final void Function(bool) onTapped;

  MainBottomSheetController(
      {required this.backgroundOpacity,
      required this.controller,
      required this.cafeList,
      required this.onTapped});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        AnimatedOpacity(
            opacity: backgroundOpacity,
            duration: Duration(milliseconds: 200),
            child: BottomSheetBackground(
                isBottomSheetOpen: backgroundOpacity == 1.0,
                onTapped: onTapped)),
        PositionedTransition(
            rect: RelativeRectTween(
                    /* BottomSheet height is 280px */
                    begin: RelativeRect.fromLTRB(
                        0, MediaQuery.of(context).size.height, 0, 0),
                    end: RelativeRect.fromLTRB(
                        0, MediaQuery.of(context).size.height - 280, 0, 0))
                .animate(controller),
            child: AnimatedOpacity(
                opacity: backgroundOpacity,
                duration: Duration(milliseconds: 200),
                child: MainBottomSheet(cafeList: cafeList, onTapped: onTapped)))
      ],
    );
  }
}

class MainBottomSheet extends StatefulWidget {
  final List<CafeModel> cafeList; /* 현재 장소를 제외한 10개 장소별 대표 카페 */
  final void Function(bool) onTapped;

  MainBottomSheet({required this.cafeList, required this.onTapped});

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
            topRight: Radius.circular(4),
            topLeft: Radius.circular(4),
          ),
          border: Border.all(
              color: Colors.black12, width: 1, style: BorderStyle.solid),
        ),
        child: ListView(children: [
          Container(
              margin: EdgeInsets.only(left: 20, bottom: 12, right: 20),
              child: Row(children: [
                Expanded(child: Text('핫플레이스 추천')),
                Expanded(
                    child: Container(
                        child: Row(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                      Text('# 감성', style: TextStyle(fontSize: 11)),
                      Text('# 데이트', style: TextStyle(fontSize: 11))
                    ])))
              ])),
          Container(
              margin: EdgeInsets.only(left: 20),
              height: 160,
              child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: List.generate(
                      10,
                      (index) => Container(
                          margin: EdgeInsets.only(right: index == 9 ? 20 : 8),
                          child: RepresentativeCafe())))),
          Container(
              width: MediaQuery.of(context).size.width,
              margin: EdgeInsets.symmetric(horizontal: 20),
              height: 1,
              decoration: BoxDecoration(color: Colors.black12)),
          GestureDetector(
              behavior: HitTestBehavior.opaque,
              child: Container(
                  width: MediaQuery.of(context).size.width,
                  margin: EdgeInsets.symmetric(vertical: 12),
                  child: Text('닫기', textAlign: TextAlign.center)),
              onTap: () => widget.onTapped(false))
        ]));
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

class BottomSheetBackground extends StatelessWidget {
  final bool isBottomSheetOpen;
  final void Function(bool) onTapped;

  BottomSheetBackground(
      {required this.isBottomSheetOpen, required this.onTapped});

  @override
  Widget build(BuildContext context) {
    return Visibility(
        visible: isBottomSheetOpen ? true : false,
        child: GestureDetector(
            child: Container(
                width: MediaQuery.of(context).size.width,
                height: MediaQuery.of(context).size.height,
                decoration: BoxDecoration(color: Colors.black54)),
            onTap: () => onTapped(false)));
  }
}
