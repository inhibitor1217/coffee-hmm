import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/view/cafe_main/main_feed_content.dart';
import 'package:mobile_app/view/common/skeleton.dart';

class MainFeed extends StatefulWidget {
  final ScrollController scrollController;
  final Map<String, Future<CafeListResponse>> cafeListResponses;
  final List<CafeModel> cafeList;
  final PlaceModel currentPlace;
  final List<CafeImageSetModel> imageSets;
  final Function(CafeModel) updateCurrentCafe;

  MainFeed({
    required this.scrollController,
    required this.cafeListResponses,
    required this.cafeList,
    required this.currentPlace,
    required this.imageSets,
    required this.updateCurrentCafe,
  });

  @override
  _MainFeedState createState() => _MainFeedState();
}

class _MainFeedState extends State<MainFeed> {
  @override
  Widget build(BuildContext context) {
    return Container(
        child: FutureBuilder<CafeListResponse>(
            future: widget.cafeListResponses[widget.currentPlace.id],
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return MainFeedContent(
                    imageSets: widget.imageSets,
                    scrollController: widget.scrollController,
                    updateCurrentCafe: widget.updateCurrentCafe,
                );
              } else if (snapshot.hasError) {
                return Text("${snapshot.error}");
              }
              return Skeleton();
            }
        )
    );
  }
}

