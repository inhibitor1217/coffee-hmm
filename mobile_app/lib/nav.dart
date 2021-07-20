class RoutePath {
  final int? id;
  final bool isUnknown;

  RoutePath.home()
      : id = null,
        isUnknown = false;

  RoutePath.details(this.id) : isUnknown = false;

  RoutePath.unknown()
      : id = null,
        isUnknown = true;

  bool get isMainPage => id == null;

  bool get isDetailPage => id != null;
}
