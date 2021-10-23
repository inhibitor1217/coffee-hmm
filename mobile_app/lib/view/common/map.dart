import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:mobile_app/view/common/map_option.dart';


class Map extends StatefulWidget {
  final LatLng location;
  final String title;
  final double? width;
  final double? height;

  Map({required this.location, required this.title, this.width, this.height});

  @override
  _MapState createState() => _MapState();
}

class _MapState extends State<Map> {
  late final _mapOption;

  void initState(){
    super.initState();
    _mapOption = MapOption(loadingDuration: Duration(milliseconds: 450), opacityDuration: Duration(milliseconds: 500), gestureRecognizerOption: _createGestureRecognizers(), markerOption: _createMarkers(location: widget.location, title: widget.title));
  }

  final Completer<GoogleMapController> _controller = Completer();
  bool isMapLoading = false;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: widget.width,
        height: widget.height,
        child: AnimatedOpacity(
          curve: Curves.fastOutSlowIn,
          opacity: isMapLoading ? 1.0 : 0,
          duration:_mapOption.opacityDuration,
          child: GoogleMap(
            gestureRecognizers: _mapOption.gestureRecognizerOption,
            mapType: MapType.normal,
            markers: _mapOption.markerOption,
            initialCameraPosition:
            CameraPosition(target: widget.location, zoom: 17),
            onMapCreated: (GoogleMapController controller) {
              _controller.complete(controller);
              Future.delayed(
                  _mapOption.loadingDuration,
                      () => setState(() {
                    isMapLoading = true;
                  }));
            },
          ),
        ),
    );
  }
}

Set<Factory<OneSequenceGestureRecognizer>> _createGestureRecognizers(){
  final gestures = <Factory<OneSequenceGestureRecognizer>>[
    Factory<PanGestureRecognizer>(() => PanGestureRecognizer()),
    Factory<ScaleGestureRecognizer>(() => ScaleGestureRecognizer()),
    Factory<TapGestureRecognizer>(() => TapGestureRecognizer()),
    Factory<VerticalDragGestureRecognizer>(
            () => VerticalDragGestureRecognizer()),
  ];

  return  gestures.toSet();
}

Set<Marker> _createMarkers({required LatLng location, required String title}) {
  final markers = <Marker>[
    Marker(
        markerId: MarkerId('marker_1'),
        draggable: true,
        position: location,
        infoWindow: InfoWindow(title: title))
  ];

  return markers.toSet();
}
