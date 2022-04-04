class AppState {
  String? _selectedCafeId;
  bool _isOnSettings;

  String? get selectedCafeId => _selectedCafeId;

  bool get isOnDetailPage => _selectedCafeId != null;
  bool get isOnSettings => _isOnSettings;

  AppState({
    bool? isOnSettings,
  }) : _isOnSettings = isOnSettings ?? false;

  static final initial = AppState();

  void enterCafeDetails(String cafeId) {
    _selectedCafeId = cafeId;
  }

  void exitCafeDetails() {
    _selectedCafeId = null;
  }

  void enterSettings() {
    _isOnSettings = true;
  }

  void exitSettings() {
    _isOnSettings = false;
  }
}
