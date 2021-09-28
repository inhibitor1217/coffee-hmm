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
  bool isMapLoading = false;

  @override
  Widget build(BuildContext context) {
    const duration = 500;
    return Container(
      width: widget.width,
      height: widget.height,
      child: AnimatedOpacity(
        curve: Curves.fastOutSlowIn,
        opacity: isMapLoading ? 1.0 : 0,
        duration: Duration(milliseconds: duration),
        child: GoogleMap(
          mapType: MapType.normal,
          markers: _createMarker(widget.location, widget.title),
          initialCameraPosition:
              CameraPosition(target: widget.location, zoom: 17),
          onMapCreated: (GoogleMapController controller) {
            _controller.complete(controller);
            Future.delayed(
                Duration(milliseconds: duration - 50),
                () => setState(() {
                      isMapLoading = true;
                    }));
          },
        ),
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
