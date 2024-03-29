import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/environment.dart';
import 'package:mobile_app/util/image.dart';
import 'package:mobile_app/widgets/delayed_widget.dart';
import 'package:mobile_app/widgets/image_progress_indicator.dart';

class CafeImage extends StatelessWidget {
  final CafeImageModel image;
  final double size;

  CafeImage({required this.image, required this.size});

  @override
  Widget build(BuildContext context) {
    final path = Environment.imageBaseUrl;
    final group = '/cafes/';
    final uri = parseRelativeUri(image.relativeUri, group);
    final query = '?d=240x240';

    return Container(
      height: size,
      child: CachedNetworkImage(
        imageUrl: '$path$group$uri${size > 319 ? '' : query}',
        fit: BoxFit.cover,
        progressIndicatorBuilder: (context, url, downloadProgress) => Center(
            child: DelayedWidget(
                key: ValueKey(image.id),
                child: ImageProgressIndicator(
                    contentSize: size,
                    progress: downloadProgress.progress ?? 0.0))),
        errorWidget: (context, error, stackTrace) {
          return Center(child: Text('no image'));
        },
      ),
    );
  }
}
