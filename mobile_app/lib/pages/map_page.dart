import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/common/map.dart';

class MapScreen extends StatefulWidget {
  final CafeModel? cafe;

  MapScreen({this.cafe});

  @override
  _MapScreenState createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen>{
  @override
  Widget build(BuildContext context){
    return Scaffold(
      body:  MapBody(cafe: widget.cafe),
      );
  }
}

class MapBody extends StatefulWidget {
  final CafeModel? cafe;

  MapBody({this.cafe});

  @override
  _MapBodyState createState() => _MapBodyState();
}

class _MapBodyState extends State<MapBody> {
@override
  Widget build(BuildContext context){
  return  Stack(
            children: [
              Map(
                  isOpenPage: false,
                 cafe: widget.cafe,
              ),
              Positioned(
                top: 30,
                left: 0,
                child: IconButton(
                  icon: Icon(
                    Icons.arrow_back_rounded,
                    size: 20.0,
                  ),
                  onPressed: () => Navigator.pop(context),
                )
              )
            ],
      );
}
}