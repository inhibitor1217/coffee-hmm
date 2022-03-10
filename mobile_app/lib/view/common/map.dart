import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';


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
  bool isMapLoading = false;
  final Completer<GoogleMapController> _controller = Completer();
  GoogleMap? _map;

  @override
  void initState(){
    super.initState();
    final _markers = _createMarkers(location: widget.location, title: widget.title);
    final _gestureRecognizers = _createGestureRecognizers();
    _map = GoogleMap(
      myLocationButtonEnabled: false,
      gestureRecognizers: _gestureRecognizers,
      markers: _markers,
      initialCameraPosition: CameraPosition(target: widget.location, zoom: 16),
      onMapCreated: (GoogleMapController controller) {
        _controller.complete(controller);
        Future.delayed(
            Duration(milliseconds: 450),
                () => setState(() {
              isMapLoading = true;
            }));
      },
    );
  }
  @override
  void dispose() async {
    super.dispose();
    _disposeController();
  }

  Future<void> _disposeController() async {
    final GoogleMapController controller = await _controller.future;
    controller.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
        width: widget.width,
        height: widget.height,
        child: AnimatedOpacity(
          curve: Curves.fastOutSlowIn,
          opacity: isMapLoading ? 1.0 : 0,
          duration: Duration(milliseconds: 500),
          child: _map,
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
