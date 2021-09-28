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
  Completer<GoogleMapController> _controller = Completer();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      child: GoogleMap(
        mapType: MapType.normal,
        markers: _createMarker(widget.location, widget.title),
        initialCameraPosition:
            CameraPosition(target: widget.location, zoom: 17),
        onMapCreated: (GoogleMapController controller) {
          _controller.complete(controller);
        },
      ),
    );
  }
}

Set<Marker> _createMarker(LatLng location, String title) {
  final markers = <Marker>[
    Marker(
        markerId: MarkerId('marker_1'),
        draggable: true,
        position: location,
        infoWindow: InfoWindow(title: title))
  ];

  return markers.toSet();
}
