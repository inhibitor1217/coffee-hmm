import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_footer.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_info.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_location.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_menu.dart';
import 'package:mobile_app/view/common/cafe_image_slider.dart';
import 'package:mobile_app/view/common/image_index_bullet.dart';

const double FOOTER_HEIGHT = 72;

class DetailBodyContent extends StatefulWidget {
  final CafeModel cafe;

  DetailBodyContent({required this.cafe});

  @override
  _DetailBodyContentState createState() => _DetailBodyContentState(cafe: cafe);
}

class _DetailBodyContentState extends State<DetailBodyContent> {
  final CafeModel cafe;
  final PageController _controller = PageController();
  final GlobalKey menuKey = new GlobalKey();
  final GlobalKey mapKey = new GlobalKey();
  bool hasLocation = false;
  bool hasMenus = false;
  double footerOffset = 0;
  int? currentIndex;

  _DetailBodyContentState({required this.cafe});

  @override
  void initState(){
    super.initState();
    hasLocation = hasCafeMetadata(cafe.metadata?.location?.lat) &&
        hasCafeMetadata(cafe.metadata?.location?.lng);
    hasMenus =  (cafe.metadata?.menus ?? []).length > 0;
    footerOffset = (hasLocation || hasMenus) ? -FOOTER_HEIGHT : 0;
  }

  void handleImageSlide(int index) {
    setState(() {
      currentIndex = index % cafe.image.count;
    });
  }
  void handleScroll(GlobalKey targetKey) {
    Scrollable.ensureVisible(targetKey.currentContext!,
        duration: Duration(milliseconds: 500),
        curve: Curves.easeInOut
    );
  }
  void handleMenuScroll(){
    handleScroll(menuKey);
  }
  void handleMapScroll(){
    handleScroll(mapKey);
  }
  void handleFooterOffset(double scrollDelta, double offset){
    setState(() {
      if(scrollDelta < 0){ // scroll to up
        if(offset < FOOTER_HEIGHT){
          footerOffset = offset - FOOTER_HEIGHT; // footer disappear
        }
      }else { // scroll to down
        if(offset < FOOTER_HEIGHT){
          footerOffset = offset - FOOTER_HEIGHT; // footer appear
        }
      }
    });
  }


  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        ScrollConfiguration(
          behavior: ScrollConfiguration.of(context).copyWith(scrollbars: false),
          child: NotificationListener<ScrollUpdateNotification>(
            onNotification: (notification) {
              if(notification.metrics.axis == Axis.vertical){
                handleFooterOffset(notification.scrollDelta ?? 0, notification.metrics.pixels);
              }
              return true;
            },
            child: ListView(
              scrollDirection: Axis.vertical,
              shrinkWrap: true,
              children: [
                CafeImageSlider(
                  pageController: _controller,
                  imageList: cafe.image.list,
                  onSlide: handleImageSlide,
                ),
                ImageIndexBullet(
                  totalCount: cafe.image.count,
                  currentIndex: currentIndex ?? 0,
                ),
                CafeDetailInfo(cafe: cafe),
                if (hasLocation)
                  Container(
                    key: mapKey,
                    child: CafeDetailLocation(cafe: cafe),
                  ),
                if (hasMenus)
                  Container(
                    key: menuKey,
                    child: CafeDetailMenus(menus: cafe.metadata!.menus!),
                  ),
                SizedBox(height: 100),
              ],
            ),
          ),
        ),
        Positioned(
          bottom: footerOffset,
          left: 0,
          child: CafeDetailFooter(
            cafeId: cafe.id,
            onMenuScroll: hasMenus ? handleMenuScroll : null,
            onMapScroll: hasLocation ? handleMapScroll : null,
          ),
        )
      ],
    );
  }
}
