import 'package:meta/meta.dart';
import 'package:mobile_app/router/pages.dart';

@immutable
class PageConfiguration {
  final Pages type;
  final Map<String, dynamic> params;

  PageConfiguration({required this.type, this.params = const {}});

  T get<T>(String name) {
    return params[name] as T;
  }

  String get location {
    switch (type) {
      case Pages.home:
        return '/';
      case Pages.cafeDetail:
        final cafeId = get<String>('cafeId');
        return '/cafe/$cafeId';
      case Pages.settings:
        return '/settings';
    }
  }

  static final home = PageConfiguration(type: Pages.home);

  static PageConfiguration cafeDetail({required String cafeId}) {
    return PageConfiguration(
        type: Pages.cafeDetail, params: {'cafeId': cafeId});
  }

  static final settings = PageConfiguration(type: Pages.settings);
}
