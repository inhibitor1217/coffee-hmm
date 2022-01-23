extension EnumTransform on List {
  String enumToString<T>(T value){
    if(value == null || (isEmpty)) return '';

    final target = singleWhere((_enum) => _enum.toString() == value.toString(),
    orElse: () => '');

    if(target == null) return '';

    return target.toString().split('.').last;
  }

  T stringToEnum<T>(String value, T defaultValue) {
    return firstWhere((_enum) => _enum.toString().split('.').last == value,
    orElse: () => defaultValue);
  }
}
