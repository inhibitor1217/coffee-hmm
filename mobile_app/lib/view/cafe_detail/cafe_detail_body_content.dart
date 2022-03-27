import 'package:flutter/material.dart';
import 'package:mobile_app/constants/type.dart';
import 'package:mobile_app/util/cafe_detail.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_footer.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_info.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_location.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_media_search.dart';
import 'package:mobile_app/view/cafe_detail/cafe_detail_menu.dart';
import 'package:mobile_app/view/common/cafe_image_slider.dart';
import 'package:mobile_app/view/common/image_index_bullet.dart';

const double _footerHeight = 80;

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
  bool get _hasLocation => hasCafeMetadata(cafe.metadata?.location?.lat) &&
  hasCafeMetadata(cafe.metadata?.location?.lng);
  bool get _hasMenus => (cafe.metadata?.mainMenus ?? []).length > 0;
  bool get _hasMetadata => _hasLocation || _hasMenus;
  double footerOffset = 0;
  int? _currentIndex;

  _DetailBodyContentState({required this.cafe});

  @override
  void initState(){
    super.initState();
    footerOffset = _hasMetadata ? -_footerHeight : -2;
  }

  void _handleImageSlide(int index) {
    setState(() {
      _currentIndex = index % cafe.image.count;
    });
  }
  void _handleScroll(GlobalKey targetKey) {
    final context = targetKey.currentContext;
    if (context == null) return;

    Scrollable.ensureVisible(context,
        duration: Duration(milliseconds: 500),
        curve: Curves.easeInOut
    );
  }
  void _handleMenuScroll(){
    _handleScroll(menuKey);
  }
  void _handleMapScroll(){
    _handleScroll(mapKey);
  }
  void _handleFooterOffset(double scrollDelta, double offset){
    if(!_hasMetadata) return;
    final isScrollingToDown = scrollDelta > 0;
    final isScrollingToUp =  scrollDelta < 0;

    setState(() {
        if(0 < offset && offset < _footerHeight && isScrollingToDown){
          footerOffset = 0;
        }
        if(offset <= 0 && isScrollingToUp){
          footerOffset = - _footerHeight;
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
                _handleFooterOffset(notification.scrollDelta ?? 0, notification.metrics.pixels);
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
                  onSlide: _handleImageSlide,
                ),
                ImageIndexBullet(
                  totalCount: cafe.image.count,
                  currentIndex: _currentIndex ?? 0,
                ),
                CafeDetailInfo(cafe: cafe),
                if (_hasLocation)
                  Container(
                    key: mapKey,
                    child: CafeDetailLocation(cafe: cafe),
                  ),
                if (_hasMenus)
                  Container(
                    key: menuKey,
                    child: CafeDetailMenus(menus: cafe.metadata!.mainMenus!),
                  ),
                CafeDetailMediaSearch(cafeName: cafe.name),
                SizedBox(height: 100),
              ],
            ),
          ),
        ),
        AnimatedPositioned(
          bottom: footerOffset,
          left: 0,
          duration: Duration(milliseconds: 150),
          child: CafeDetailFooter(
            cafeId: cafe.id,
            onMenuScroll: _hasMenus ? _handleMenuScroll : null,
            onMapScroll: _hasLocation ? _handleMapScroll : null,
          ),
        )
      ],
    );
  }
}
