import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile_app/type.dart';

class Cafe extends StatelessWidget {
  final CafeModel cafe;

  Cafe({required this.cafe});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        Container(child: _buildCafeInfo()),
        Container(
          child: _buildCafeImage(context),
        )
      ],
    );
  }

  Widget _buildCafeInfo() {
    return Container(
        width: double.infinity,
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              cafe.name,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              '${cafe.place.name} OPEN ${cafe.metadata.hour}',
              style: TextStyle(fontSize: 14),
            ),
            Container(
              alignment: Alignment.centerRight,
              child: Text(
                "${cafe.metadata.creator ?? 'jyuunnii'} 님이 올려주신 ${cafe.name}",
                style: TextStyle(
                  fontSize: 12,
                ),
              ),
            )
          ],
        ));
  }

  Widget _buildCafeImage(context) {
    double viewportWidth = MediaQuery.of(context).size.width;
    CafeImage? mainImage = cafe.image.list.firstWhere((image) => image.isMain);
    return Container(
        width: viewportWidth,
        height: viewportWidth,
        child: CachedNetworkImage(
          imageUrl: mainImage.relativeUri,
          fit: BoxFit.cover,
          progressIndicatorBuilder: (context, url, downloadProgress) {
            return Center(
                child: CircularProgressIndicator(
                    color: Colors.black12, value: downloadProgress.progress));
          },
          errorWidget: (context, error, stackTrace) {
            return Center(child: Text('no image'));
          },
        ));
  }
}
