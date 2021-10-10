import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/pages/map_page.dart';
import 'package:mobile_app/util/map.dart';

class Map extends StatefulWidget {
  final CafeModel? cafe;
  final double? width;
  final double? height;
  final double? zoom;
  final bool? isOpenPage;

  Map({this.cafe, this.width, this.height, this.isOpenPage, this.zoom});

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
    final _location = getLocation(widget.cafe);
    return SizedBox(
        width: widget.width,
        height: widget.height,
        child: AnimatedOpacity(
          curve: Curves.fastOutSlowIn,
          opacity: isMapLoading ? 1.0 : 0,
          duration: Duration(milliseconds: opacityDuration),
          child: GoogleMap(
            onTap: (_) => {if(widget.isOpenPage ?? false) _openMapPage(context, widget.cafe)},
            mapType: MapType.normal,
            markers: _createMarkers(location: _location, title: widget.cafe?.name),
            initialCameraPosition: CameraPosition(target: _location, zoom: widget.zoom ?? 17 ),
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

void _openMapPage(BuildContext context, CafeModel? cafe){
  Navigator.push(
    context,
    MaterialPageRoute(builder: (context) =>  MapScreen(cafe: cafe)),
  );
}

Set<Marker> _createMarkers({required LatLng location, required String? title}) {
  if(title == null) return Set();
  final markers = <Marker>[
    Marker(
        markerId: MarkerId('marker_1'),
        draggable: true,
        position: location,
        infoWindow: InfoWindow(title: title))
  ];

  return markers.toSet();
}
