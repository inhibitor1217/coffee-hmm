enum CafeState { active, hidden }
enum CafeImageState { active, hidden }

extension GetCafeState on CafeState {
  static CafeState parse(String value) {
    return CafeState.values.firstWhere(
        (e) => e.toString().split('.').last == value,
        orElse: () => CafeState.hidden);
  }
}

extension GetCafeImageState on CafeImageState {
  static CafeImageState parse(String value) {
    return CafeImageState.values.firstWhere(
        (e) => e.toString().split('.').last == value,
        orElse: () => CafeImageState.hidden);
  }
}
