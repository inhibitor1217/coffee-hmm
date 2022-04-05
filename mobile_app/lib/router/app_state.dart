class AppState {
  String? _selectedCafeId;
  bool _isOnSettings;
  bool _isOnSaved;

  String? get selectedCafeId => _selectedCafeId;

  bool get isOnDetailPage => _selectedCafeId != null;
  bool get isOnSettings => _isOnSettings;
  bool get isOnSaved => _isOnSaved;

  AppState({
    bool? isOnSettings,
    bool? isOnSaved,
  }) : _isOnSettings = isOnSettings ?? false, _isOnSaved = isOnSaved ?? false;

  static final initial = AppState();

  void enterCafeDetails(String cafeId) {
    _selectedCafeId = cafeId;
  }

  void exitCafeDetails() {
    _selectedCafeId = null;
  }

  void enterSaved(){
    _isOnSaved = true;
  }

  void exitSaved(){
    _isOnSaved = false;
  }

  void enterSettings() {
    _isOnSettings = true;
  }

  void exitSettings() {
    _isOnSettings = false;
  }
}
