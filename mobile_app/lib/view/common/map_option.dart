import 'package:flutter/foundation.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

@immutable
class MapOption {
  final int loadingDuration;
  final int opacityDuration;
  final Set<Factory<OneSequenceGestureRecognizer>> gestureRecognizerOption;
  final Set<Marker> markerOption;

  MapOption(
      {
        required this.loadingDuration,
        required this.opacityDuration,
        required this.gestureRecognizerOption,
        required this.markerOption
      }
      );
}

