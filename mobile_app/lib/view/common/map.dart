import 'dart:async';

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
  static const mapLoadingDuration = 450;
  static const opacityDuration = 500;
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
          duration: Duration(milliseconds: opacityDuration),
          child: GoogleMap(
            mapType: MapType.normal,
            markers: _createMarkers(location: widget.location, title: widget.title),
            initialCameraPosition:
            CameraPosition(target: widget.location, zoom: 17),
            onMapCreated: (GoogleMapController controller) {
              _controller.complete(controller);
              Future.delayed(
                  Duration(milliseconds: mapLoadingDuration),
                      () => setState(() {
                    isMapLoading = true;
                  }));
            },
          ),
        ),
    );
  }
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
