import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/image.dart';
import 'package:mobile_app/type.dart';
import 'package:mobile_app/util/environment.dart';
import 'package:mobile_app/widgets/delayed_widget.dart';

class CafeImage extends StatelessWidget {
  final CafeImageModel image;
  final double size;

  CafeImage({required this.image, required this.size});

  @override
  Widget build(BuildContext context) {
    final path = Environment.imageBaseUrl;
    final group = '/cafes/';
    final uri = parseRelativeUri(image.relativeUri, group);
    final query = '?d=' + (size > 319 ? '720x720' : '240x240');

    return Container(
      height: size,
      child: CachedNetworkImage(
        imageUrl: '$path$group$uri$query',
        fit: BoxFit.cover,
        progressIndicatorBuilder: (context, url, downloadProgress) => Center(
            child: DelayedWidget(
                key: ValueKey(image.id),
                child: _CafeImageProgressIndicator(
                    contentSize: size,
                    progress: downloadProgress.progress ?? 0.0))),
        errorWidget: (context, error, stackTrace) {
          return Center(child: Text('no image'));
        },
      ),
    );
  }
}

class _CafeImageProgressIndicator extends StatelessWidget {
  static const _color = Colors.black12;

  final double contentSize;
  final double progress;
  _CafeImageProgressIndicator(
      {required this.contentSize, required this.progress});

  double get _displayedProgress => progress.clamp(0.1, 1.0);
  double get _desiredSize => contentSize * 0.25;

  @override
  Widget build(BuildContext context) {
    return Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(Icons.image,
          color: _color, size: _roundToMultipleOfFour(_desiredSize * 0.75)),
      SizedBox(height: _roundToMultipleOfFour(_desiredSize * 0.05)),
      _progressBar(context)
    ]);
  }

  final _progressBarBorderRadius = BorderRadius.circular(4.0);

  double get _progressBarWidth => _roundToMultipleOfFour(_desiredSize);
  double get _progressBarHeight =>
      _roundToMultipleOfFour(_progressBarWidth * 0.125)
          .clamp(4.0, double.infinity);

  Widget _progressBar(BuildContext context) {
    return Container(
        width: _progressBarWidth,
        height: _progressBarHeight,
        padding: const EdgeInsets.all(2.0),
        decoration: BoxDecoration(
            color: _color, borderRadius: _progressBarBorderRadius),
        child: LayoutBuilder(
            builder: (context, constraints) => Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _animatedProgress(context, maxSize: constraints.maxWidth),
                    Spacer()
                  ],
                )));
  }

  Widget _animatedProgress(BuildContext context, {required double maxSize}) {
    return AnimatedContainer(
        decoration: BoxDecoration(
            color: Colors.white, borderRadius: _progressBarBorderRadius),
        duration: const Duration(milliseconds: 150),
        curve: Curves.ease,
        constraints: BoxConstraints(maxWidth: maxSize * _displayedProgress));
  }

  double _roundToMultipleOfFour(double value) {
    return (value * 0.25).roundToDouble() * 4.0;
  }
}
