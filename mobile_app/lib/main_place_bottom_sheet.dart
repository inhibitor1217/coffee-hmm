import 'package:flutter/material.dart';

class MainPlaceBottomSheet extends StatefulWidget {
  final void Function(bool) handleBottomSheet;

  MainPlaceBottomSheet({required this.handleBottomSheet});

  @override
  _MainPlaceBottomSheetState createState() => _MainPlaceBottomSheetState();
}

class _MainPlaceBottomSheetState extends State<MainPlaceBottomSheet> {
  @override
  Widget build(BuildContext context) {
    return Container(
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(4),
            topLeft: Radius.circular(4),
          ),
          border: Border.all(
              color: Colors.black12, width: 1, style: BorderStyle.solid),
        ),
        child: Column(children: [
          Flexible(child: Container(child: Text('test'))),
          Flexible(
              child: GestureDetector(
                  child: Container(
                      width: MediaQuery.of(context).size.width,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border(
                            top: BorderSide(
                                color: Colors.black12,
                                width: 1,
                                style: BorderStyle.solid)),
                      ),
                      child: Center(child: Text('닫기'))),
                  onTap: () => widget.handleBottomSheet(false)))
        ]));
  }
}
